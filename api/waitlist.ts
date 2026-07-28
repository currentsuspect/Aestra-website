import { waitUntil } from "@vercel/functions";
import { checkBotId } from "botid/server";

type WaitlistPurpose = "early-access" | "supporter-notify" | "founder-waitlist";

type WaitlistPayload = {
  name?: unknown;
  email?: unknown;
  daw?: unknown;
  source?: unknown;
  website?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PURPOSES = new Set<WaitlistPurpose>([
  "early-access",
  "supporter-notify",
  "founder-waitlist",
]);

function text(value: unknown, maxLength: number, singleLine = false): string {
  if (typeof value !== "string") return "";
  const normalized = singleLine ? value.replace(/[\r\n]+/g, " ") : value;
  return normalized.trim().slice(0, maxLength);
}

function isWaitlistPurpose(value: string): value is WaitlistPurpose {
  return PURPOSES.has(value as WaitlistPurpose);
}

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...Object.fromEntries(new Headers(headers)),
    },
  });
}

async function resendFetch(apiKey: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(init.headers)),
    },
  });
  return response;
}

async function ensureContact(apiKey: string, email: string, name: string) {
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  const existing = await resendFetch(apiKey, contactPath);
  if (existing.ok) return;
  if (existing.status !== 404) {
    const detail = await existing.text().catch(() => "");
    throw new Error(`Resend contact lookup failed (${existing.status}): ${detail.slice(0, 500)}`);
  }

  const created = await resendFetch(apiKey, "/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      ...(name ? { first_name: name } : {}),
      unsubscribed: false,
    }),
  });
  if (created.ok) return;

  // A concurrent duplicate submission can win the create race.
  const raced = await resendFetch(apiKey, contactPath);
  if (raced.ok) return;

  const detail = await created.text().catch(() => "");
  throw new Error(`Resend contact create failed (${created.status}): ${detail.slice(0, 500)}`);
}

async function idempotencyKey(source: WaitlistPurpose, email: string) {
  const bytes = new TextEncoder().encode(`${source}:${email}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return `waitlist-notify/${source}/${hex}`;
}

async function sendNotification(
  apiKey: string,
  payload: Record<string, unknown>,
  key: string,
) {
  const response = await resendFetch(apiKey, "/emails", {
    method: "POST",
    headers: { "Idempotency-Key": key },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend rejected email (${response.status}): ${detail.slice(0, 500)}`);
  }
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
    }

    const verification = await checkBotId();
    if (verification.isBot) {
      return json({ error: "Access denied" }, 403);
    }

    const origin = request.headers.get("Origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return json({ error: "Access denied" }, 403);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return json({ error: "Email service unavailable" }, 503);
    }

    let body: WaitlistPayload;
    try {
      body = await request.json() as WaitlistPayload;
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    // Honeypot: real forms hide this field from users.
    if (text(body.website, 200)) {
      return json({ ok: true });
    }

    const name = text(body.name, 100, true);
    const email = text(body.email, 254, true).toLowerCase();
    const daw = text(body.daw, 120, true);
    const source = text(body.source, 40, true);

    if (!EMAIL_RE.test(email) || !isWaitlistPurpose(source)) {
      return json({ error: "Invalid waitlist submission" }, 400);
    }
    if (source !== "founder-waitlist" && !name) {
      return json({ error: "Name is required" }, 400);
    }

    const notifyTo = process.env.WAITLIST_NOTIFY_TO || "hello@aestra.studio";
    const from = process.env.RESEND_FROM || "Aestra <hello@aestra.studio>";
    const label = source === "supporter-notify"
      ? "Supporter notification"
      : source === "founder-waitlist"
        ? "Founder waitlist"
        : "Early access";

    try {
      // This is the durable record. Email is only an operational alert.
      await ensureContact(apiKey, email, name);
    } catch (error) {
      console.error("Waitlist contact persistence failed", error);
      return json({ error: "Could not save waitlist request" }, 502);
    }

    const notification = (async () => {
      const key = await idempotencyKey(source, email);
      await sendNotification(apiKey, {
        from,
        to: [notifyTo],
        reply_to: email,
        subject: `[Aestra] ${label}: ${name || email}`,
        text: [
`${label} signup`,
"",
`Name: ${name || "Not provided"}`,
`Email: ${email}`,
`Current DAW: ${daw || "Not provided"}`,
`Source: ${source}`,
        ].join("\n"),
      }, key);
    })().catch((error) => {
      console.error("Waitlist notification email failed", error);
    });

    waitUntil(notification);
    return json({ ok: true });
  },
};
