# Aestra Website

Marketing and product site for Aestra, built with Vite and React.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

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
