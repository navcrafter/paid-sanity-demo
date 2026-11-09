# #paid — Next.js + Sanity demo

Demo rebuild of hashtagpaid.com (Home, Creators, Company, and an Events collection) on
Next.js 16 with Sanity Studio embedded at `/studio`.

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack)
- **Sanity** (Studio v6 embedded at `/studio`, Presentation tool for click-to-edit, Sanity Live)
- **Client-First** class naming for all site CSS (from phase 2)
- Hosted on **Netlify**

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
3. `npm run dev`, then open http://localhost:3000 (site) and http://localhost:3000/studio (Studio).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typegen` | Re-extracts the Sanity schema and regenerates `src/sanity/sanity.types.ts`. Run after changing schemas or GROQ queries. |

## Project layout

```
sanity.config.ts              Studio config (tools, templates, singleton rules)
src/app/(site)/               Public pages: /, /creators, /company, /events/[category]/[slug]
src/app/studio/               Embedded Studio
src/app/api/draft-mode/       Enable/disable draft mode (used by the Presentation tool)
src/app/api/revalidate/       Sanity publish webhook → expires cached pages
src/sanity/schemaTypes/       Content model
src/sanity/structure.ts       Studio sidebar
src/sanity/presentation/      URL ↔ document mapping for visual editing
src/sanity/lib/               Client, Sanity Live, queries, image URLs
scripts/                      One-off content scripts (`npx sanity exec <file> --with-user-token`)
```

## Content updates and caching

Published pages are cached. They refresh when content changes in two ways:

- `<SanityLive>` updates pages that are open in a browser.
- A Sanity webhook calls `POST /api/revalidate` on every publish, signed with
  `SANITY_REVALIDATE_SECRET`, which expires every cached Sanity query.
