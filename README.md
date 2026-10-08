# Akash Kumar — Portfolio

Next.js 16 (App Router) + TypeScript, hand-written CSS, no UI kit. Fully static.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Edit content

All text lives in `lib/data.ts` (profile, experience, projects, skills, education).
Replace `public/akash-kumar-resume.pdf` to update the résumé download.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Framework is auto-detected; no settings needed.
3. Optional: once you have a custom domain, set the env var `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
   so share previews use it (otherwise the Vercel production URL is used automatically).

Or from the terminal: `npx vercel` (preview) then `npx vercel --prod`.

## Structure

- `app/page.tsx` — the page
- `app/globals.css` — all styling
- `components/GridWorld.tsx` — live Q-learning demo in the hero
- `components/ProjectFigure.tsx` — animated project schematics
- `app/opengraph-image.tsx` — generated social share image
