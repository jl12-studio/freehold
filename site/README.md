# freeholders.org

The website of the Freehold movement. Static site built with Astro 7, Vue 3 islands, and Tailwind CSS 4, deployed to Cloudflare Pages. The philosophy and the standard are rendered from `../PHILOSOPHY.md` and `../FRAMEWORK.md` at build time; this folder never holds a copy of them.

## Commands

```bash
pnpm install
pnpm dev        # local server
pnpm build      # static output in dist/
pnpm preview    # serve dist/
pnpm check      # astro check
pnpm test       # vitest
pnpm run deploy # build and upload to Cloudflare Pages (needs wrangler login once)
```

## Where things are

- `src/pages/` routes: `/`, `/standard`, `/feed`, `/feed/[slug]`, `/feed.xml`, `/marketplace`, `/marketplace/[slug]`, `/registry.json`, `/404`.
- `src/content/feed/` one Markdown file per post, named `YYYY-MM-DD-slug.md`. Frontmatter: `title`, `date`, optional `summary`, optional `raw` (repo path of the verbatim capture), `draft`.
- `src/content/registry/` one YAML file per Freehold app, scored against the 10 points. Copy `freehold-ledger.yaml` to start a new entry.
- `src/content.config.ts` the schemas for all three collections.
- `src/lib/standard.ts` the 10 point titles, the one deliberate duplication of FRAMEWORK.md Part 1. Keep them in step.
- `src/styles/global.css` design tokens and prose styles. `DESIGN.md` explains every decision and is binding for new UI.
- `DEPLOY.md` the runbook: Cloudflare Pages from GitHub, manual deploy, and the plain-host escape hatch.

## Rules

No em dashes in anything the site itself authors (`pnpm test` enforces it). Fonts and scripts are self-hosted; the one third party is Google Analytics 4 (measurement id in `src/config.ts`, loaded only in production builds, so dev and preview traffic never count; it sets Google's cookies). The Content-Security-Policy in `public/_headers` admits exactly the Google hosts it needs and nothing else. Writing is CC BY-SA 4.0, code is MIT (see `../LICENSE.md`).
