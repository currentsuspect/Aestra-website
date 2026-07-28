type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

type WaitlistPurpose = "early-access" | "supporter-notify";

type WaitlistPayload = {
  name?: unknown;
  email?: unknown;
  daw?: unknown;
  source?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PURPOSES = new Set<WaitlistPurpose>(["early-access", "supporter-notify"]);

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseBody(body: unknown): WaitlistPayload | null {
  if (body && typeof body === "object") return body as WaitlistPayload;
  if (typeof body !== "string") return null;

  try {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" ? parsed as WaitlistPayload : null;
  } catch {
    return null;
  }
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend rejected email (${response.status}): ${detail.slice(0, 500)}`);
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return res.status(503).json({ error: "Email service unavailable" });
  }

  const body = parseBody(req.body);
  if (!body) return res.status(400).json({ error: "Invalid JSON body" });

  const name = text(body.name, 100);
  const email = text(body.email, 254).toLowerCase();
  const daw = text(body.daw, 120);
  const source = text(body.source, 40) as WaitlistPurpose;

  if (!name || !EMAIL_RE.test(email) || !PURPOSES.has(source)) {
    return res.status(400).json({ error: "Invalid waitlist submission" });
  }

  const notifyTo = process.env.WAITLIST_NOTIFY_TO || "hello@aestra.studio";
  const from = process.env.RESEND_FROM || "Aestra <hello@aestra.studio>";
  const label = source === "supporter-notify" ? "Supporter notification" : "Early access";

  try {
    await sendEmail(apiKey, {
      from,
      to: [notifyTo],
      reply_to: email,
      subject: `[Aestra] ${label}: ${name}`,
      text: [
        `${label} signup`,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Current DAW: ${daw || "Not provided"}`,
        `Source: ${source}`,
      ].join("\n"),
    });

    // Confirmation is useful, but the signup itself is the source of truth.
    // A transient confirmation failure must not make a successful signup look lost.
    try {
      await sendEmail(apiKey, {
        from,
        to: [email],
        subject: source === "supporter-notify"
          ? "You're on the Aestra Supporter list"
          : "You're on the Aestra early access list",
        text: source === "supporter-notify"
          ? `Hey ${name},\n\nYou're on the list. We'll email you when Aestra Supporter opens.\n\n— Aestra`
          : `Hey ${name},\n\nYou're on the list. We'll email you when Aestra early access opens.\n\n— Aestra`,
      });
    } catch (error) {
      console.error("Waitlist confirmation email failed", error);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Waitlist notification email failed", error);
    return res.status(502).json({ error: "Could not send waitlist request" });
  }
}
