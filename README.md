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

## Waitlist email

Waitlist submissions post to `/api/waitlist`, which sends mail through Resend. The Resend API key is server-side only and must never use a `VITE_` prefix.

Configure these environment variables in Vercel Project Settings:

```text
RESEND_API_KEY=re_...
WAITLIST_NOTIFY_TO=hello@aestra.studio   # optional; this is the default
RESEND_FROM=Aestra <hello@aestra.studio> # optional; this is the default
```

`hello@aestra.studio` must remain a verified Resend sender/domain for the default configuration to work.

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
