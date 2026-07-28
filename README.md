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

BotID reduces automated abuse, but the production project should also keep a Vercel Firewall rate-limit rule on `POST /api/waitlist` as a quota guard.

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
