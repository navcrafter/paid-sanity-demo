# #paid — Next.js + Sanity demo

Demo rebuild of hashtagpaid.com (Home, Creators, Company, and an Events collection) on
Next.js 16 with Sanity Studio embedded at `/studio`.

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack)
- **Sanity** (Studio v6 embedded at `/studio`, Presentation tool for click-to-edit, Sanity Live)
- **Draft → Preview → Publish**: every edit saves as a draft (the staging copy). The "Preview this page" button at the top of each page/event opens the draft on the real page; only Publish changes the live site.
- **Testimonials** are a collection (Studio → Testimonials); the Home carousel picks quotes from it.
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
| `npm run seed:settings` | Fills Site settings (navigation, footer, badges) with the live site's content. |
| `npm run seed:pages [-- home creators company]` | Loads page sections from `scripts/content/*.json` (captured from the live site), uploading images and Vidzflow posters to Sanity. **Overwrites** the pages' sections. |

## Events

- One **Events** collection (Studio → Events, with folders per category). URL: `/events/{category}/{slug}`.
- **Template** (Supper Club / Mid Tier / Webinar) sets the hero layout; **Theme** sets the page background
  (black / dark / light) and hero colour. New events start from a template with its usual sections.
- Optional sections per event: logo strip, testimonials, people (creators/speakers), venues.
- Registration: a HubSpot form ID per event (the portal ID lives in Site settings).
- `/events` is a page-builder page with an **Events list** section: category filters, upcoming and past
  (split automatically by date; refreshed hourly).
- `npm run seed:pages -- events events-page` reloads the 3 demo events and the Events page.

## Page builder

Home, Creators and Company are lists of **sections** (Studio → Pages → a page → Page sections).
Each section type lives in three places:

- Schema: `src/sanity/schemaTypes/sections/`
- Component: `src/components/sections/` (registered in `registry.ts`)
- Styles: `src/styles/sections/` (Client-First class names)

Shared animations (word reveal, fade-up, scroll colour switch, letter roll, galleries,
tickers, Vidzflow players) are in `src/components/effects`, `src/components/galleries`
and `src/components/media`.

## Click-to-edit (Studio → Visual editing)

- Text is clickable automatically: in draft mode Sanity hides edit markers inside the text.
- Images, videos, icons and list items need a `data-sanity` attribute: pass `editAttr={edit('field.path')}`
  (section components get `edit`, scoped to the section; other places use `editAttrFor(doc, options.stega)`).
- Sanity adds no markers to fields named `tag`, `url`, `slug`, `color` and similar, so those need
  `data-sanity` too (see the hero and feature-tab tags).
- Use `stegaClean()` on any value used for logic, class names, URLs or `alt` text.

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

## Deployment (Netlify)

- Site: https://paid-sanity-demo.netlify.app (Studio at `/studio`). Netlify adds its Next.js
  adapter automatically; `netlify.toml` only pins Node 24 and the build command.
- Environment variables are set in Netlify (Project configuration → Environment variables), the same
  keys as `.env.example`. `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are stored as secrets.
- Sanity: the Netlify URL is an allowed CORS origin (with credentials), and the webhook
  "Netlify: refresh cached pages" posts to `/api/revalidate` on publish, unpublish and delete.
- Every push to `main` deploys through GitHub Actions (`.github/workflows/deploy.yml`), which
  needs the repository secrets `NETLIFY_AUTH_TOKEN` and `SANITY_API_READ_TOKEN`.
- **Staging = pull request previews.** Every PR is built and deployed by
  `.github/workflows/preview.yml` to `https://pr-<number>--paid-sanity-demo.netlify.app`
  (Studio at `/studio` on that URL); the link is posted as a comment on the PR and updated on
  every push. For the Studio to log in on a preview URL, Sanity needs the CORS origin
  `https://*--paid-sanity-demo.netlify.app` (with credentials). The published pages work without it. Netlify's own Git
  integration needs a paid plan for private organization repos. Re-run a deploy from the
  Actions tab → "Deploy to Netlify" → Run workflow.
- Manual deploy from this machine: `npx netlify-cli deploy --build --prod`. On Windows, stop
  `npm run dev` first, or the Next.js plugin can't move the `.next` folder.

## Content updates and caching

Published pages are cached. They refresh when content changes in two ways:

- `<SanityLive>` updates pages that are open in a browser.
- A Sanity webhook calls `POST /api/revalidate` on every publish, signed with
  `SANITY_REVALIDATE_SECRET`, which expires every cached Sanity query.
