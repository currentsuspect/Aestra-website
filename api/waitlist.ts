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

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
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

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
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

    const name = text(body.name, 100);
    const email = text(body.email, 254).toLowerCase();
    const daw = text(body.daw, 120);
    const source = text(body.source, 40) as WaitlistPurpose;

    if (!name || !EMAIL_RE.test(email) || !PURPOSES.has(source)) {
      return json({ error: "Invalid waitlist submission" }, 400);
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

      return json({ ok: true });
    } catch (error) {
      console.error("Waitlist notification email failed", error);
      return json({ error: "Could not send waitlist request" }, 502);
    }
  },
};
