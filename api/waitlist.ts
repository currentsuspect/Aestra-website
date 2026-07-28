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
const SEGMENT_ENV: Record<WaitlistPurpose, string> = {
  "early-access": "RESEND_SEGMENT_EARLY_ACCESS",
  "supporter-notify": "RESEND_SEGMENT_SUPPORTER",
  "founder-waitlist": "RESEND_SEGMENT_FOUNDER",
};

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
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(init.headers)),
    },
  });
}

async function addContactToSegment(
  apiKey: string,
  email: string,
  segmentId: string,
) {
  const response = await resendFetch(
    apiKey,
    `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
    { method: "POST" },
  );
  if (response.ok) return;

  const detail = await response.text().catch(() => "");
  throw new Error(`Resend segment assignment failed (${response.status}): ${detail.slice(0, 500)}`);
}

async function ensureContact(
  apiKey: string,
  email: string,
  name: string,
  segmentId: string,
) {
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  const existing = await resendFetch(apiKey, contactPath);

  if (existing.ok) {
    await addContactToSegment(apiKey, email, segmentId);
    return;
  }
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
      segments: [{ id: segmentId }],
    }),
  });
  if (created.ok) return;

  // A concurrent duplicate submission can win the create race. In that case,
  // recover by locating the contact and assigning the intended segment.
  const raced = await resendFetch(apiKey, contactPath);
  if (raced.ok) {
    await addContactToSegment(apiKey, email, segmentId);
    return;
  }

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

    const segmentEnv = SEGMENT_ENV[source];
    const segmentId = process.env[segmentEnv]?.trim();
    if (!segmentId) {
      console.error(`${segmentEnv} is not configured`);
      return json({ error: "Waitlist service unavailable" }, 503);
    }

    const notifyTo = process.env.WAITLIST_NOTIFY_TO || "hello@aestra.studio";
    const from = process.env.RESEND_FROM || "Aestra <hello@aestra.studio>";
    const label = source === "supporter-notify"
      ? "Supporter notification"
      : source === "founder-waitlist"
        ? "Founder waitlist"
        : "Early access";

    try {
      // Contact + Segment membership is the durable source of truth.
      await ensureContact(apiKey, email, name, segmentId);
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
