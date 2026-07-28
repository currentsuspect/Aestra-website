# Aestra Website

Marketing and product site for Aestra, built with Vite and React.

## Run locally

```bash
npm install
npm run dev
```

The Vite dev server only serves the frontend. The waitlist endpoint lives at `api/waitlist.ts` and runs as a Vercel serverless function. Use `vercel dev` when testing the full signup flow locally.

## Build

```bash
npm run build
```

The build runs the agent-skills validation, TypeScript checking for both frontend and `api/`, then the Vite production build.

## Waitlist email

All waitlist forms post to `/api/waitlist`. The endpoint verifies the browser with Vercel BotID, rejects obvious bot submissions with a honeypot and same-origin check, persists the email as a Resend Contact in the correct waitlist Segment, then queues an internal signup notification through Resend.

The Resend API key is server-side only and must never use a `VITE_` prefix. Because the endpoint manages Contacts and Segments as well as sending email, use a Resend key with **Full access**, not a sending-only key.

Create three Resend Segments — one each for Early Access, Supporter, and Founder — then configure their IDs with the API key in Vercel Project Settings:

```text
RESEND_API_KEY=re_...
RESEND_SEGMENT_EARLY_ACCESS=<segment UUID>
RESEND_SEGMENT_SUPPORTER=<segment UUID>
RESEND_SEGMENT_FOUNDER=<segment UUID>
WAITLIST_NOTIFY_TO=hello@aestra.studio   # optional; this is the default
RESEND_FROM=Aestra <hello@aestra.studio> # optional; this is the default
```

`hello@aestra.studio` must remain a verified Resend sender/domain for the default configuration to work.

BotID reduces automated abuse. Rate limiting is a quota guard on top of it, and it lives on **Cloudflare**, not the Vercel WAF: `www.aestra.studio` is proxied by Cloudflare, so every request reaches Vercel from a Cloudflare edge IP. A Vercel rate-limit rule keyed on `ip` (or `ja4`, which fingerprints the Cloudflare-to-Vercel handshake) would count unrelated users against one another and throttle real traffic.

The live rule is on `aestra.studio` under Security -> WAF -> Rate limiting rules: `POST` to `/api/waitlist` on host `www.aestra.studio`, 10 requests per 10 minutes per IP.

## Routing

`vercel.json` rewrites are evaluated **in array order, first match wins**, and that ordering is load-bearing:

1. the two BotID proxy rewrites (the `/149e9513-.../2d206a39-...` paths)
2. the SPA catch-all to `/index.html`

The catch-all's negative-lookahead regex does not exclude the BotID paths, so it only stays out of their way because it is listed last. Move it above them and the bot-protection challenge script starts returning `index.html`, which disables BotID silently — the endpoint keeps working, so nothing fails loudly. Keep the catch-all last when editing `vercel.json`.

## Deploy

Push to `main` for the normal GitHub -> Vercel flow, or deploy manually with:

```bash
vercel build --prod --yes
vercel deploy --prebuilt --prod
```

## Structure

- `src/App.tsx` is the main app router
- `src/pages/*` contains route-level pages
- `src/components/*` contains shared UI and DAW mock components
- `src/styles.css` is the active stylesheet entry
- `api/waitlist.ts` is the server-side waitlist/Resend endpoint
- `shared/*` is imported by both `src/` and `api/`; keep it dependency-free so the function bundle stays clean
