# Freehold: Read This First

Orientation for any agent or human picking this up with zero prior context, possibly months later, possibly a different model. This file tells you everything you need to participate.

## What this is

**Freehold** is a philosophy and a movement (eventually a book; **never call it a manifesto**) about using AI + the MCP protocol + open repos to empower ordinary people, so that AI doesn't become the third technology captured by the few (after the Internet and social media). "Freehold" means owning your software outright, the way freehold means owning land outright instead of renting from a landlord. The people are **freeholders**; the home is **freeholders.org**. This repo is the movement itself: the philosophy, the standard, and the freeholders.org website (in `site/`, once it exists). **Apps are not in here.** Freehold Ledger and every other Freehold app live in their own repos; this repo only points to them from the marketplace page. Other people's Freehold software can live anywhere; the standard never requires being here.

## The files

| File | What it is |
|------|-----------|
| [PHILOSOPHY.md](PHILOSOPHY.md) | **The living document.** The distilled, evolving philosophy. Read this to understand the ideas. |
| [FRAMEWORK.md](FRAMEWORK.md) | **The standard and the build framework.** Part 0 defines what makes software Freehold; Part 1 is the 10-point standard; Part 2 the build order; Part 3 the first app. Read this before building anything. |
| [raw/](raw/) | **Verbatim captures.** Marcus's spoken/dictated/typed rambles, preserved word-for-word, dated. Never edit these. |
| [drafts/](drafts/) | **Outward-facing drafts** (posts, replies, future site copy). |
| [tmp/](tmp/) | **Session handoff artifacts** for the `linear-project-workflow` skill. |
| [site/](site/) | **The freeholders.org website.** Astro + Vue, static, deployed to Cloudflare Pages. Renders PHILOSOPHY.md and FRAMEWORK.md from this root at build time; holds the feed posts and the marketplace registry. See [site/README.md](site/README.md). |

## How to work on this (the workflow)

1. **When Marcus rambles** (stream-of-consciousness idea dumps, often with dictation or typing errors): save the ramble **verbatim**, typos and all, as a new dated file in `raw/` (pattern: `YYYY-MM-DD-short-slug-verbatim.md`, with a small header linking back to PHILOSOPHY.md).
2. **Then fold the ideas into [PHILOSOPHY.md](PHILOSOPHY.md)**: distill, place them in the right section (or create one), promote rough thoughts to the Ideas Inbox, and add a dated entry to the Log section at the bottom.
3. **Engage.** Marcus explicitly wants a thinking partner, not a stenographer. Offer connections, name tensions between captures, answer his open questions when a new ramble resolves one, and challenge ideas honestly. Several of the doc's best refinements ("you can't capture people who can leave," curation-as-certification, the name itself) came from that back-and-forth.
4. **Keep the Log current.** Every capture gets a Log entry in PHILOSOPHY.md. That log is the project's memory.
5. **Optionally, write a feed post.** If a capture deserves a public, digested version, add `site/src/content/feed/YYYY-MM-DD-slug.md` (frontmatter: `title`, `date`, optional `summary`, optional `raw` pointing at the capture file). It goes live on the next deploy. Marketplace entries are `site/src/content/registry/<slug>.yaml`, one per app, scored against the 10 points of the standard.

## Voice and style rules

- **No em dashes. Ever.** Use periods, commas, colons, or parentheses. Marcus feels strongly about this. (Raw captures are exempt because they're verbatim.)
- It's a **philosophy**, **framework**, or **movement**, never a manifesto (stigma).
- Hopeful and empowering in tone, not just tech-criticism. The spine is: **Threat → Opportunity → Method.**
- Marcus's touchstones: Teddy Roosevelt (big-G Government = the people), Lincoln (the leader is not the movement), teach-a-man-to-fish, the 250,000-people-times-$5 math.
- Core commitments (the non-negotiables; full list in PHILOSOPHY.md): everything at cost, teach-don't-do-for, no walled platform, curated but free (curation = certification, not taste), outlives any founder, the human owns the product, no lock-in by protocol.
- Naming: apps are **Freehold + plain noun** (Freehold Ledger). Freehold is a status anyone can earn, never a brand anyone owns.

## License

The writing (PHILOSOPHY.md, FRAMEWORK.md, raw/, drafts/, and the site's feed posts) is CC BY-SA 4.0. The code in site/ is MIT. See [LICENSE.md](LICENSE.md).

## Current state (update this section whenever it changes)

- **Repo:** `~/Programming/Personal/freehold`, created 2026-10-20 by moving `jippylong12xyz/philosophy/` out into its own project. Layout: root = philosophy/standard, `site/` = freeholders.org. Freehold Ledger is a separate repo (`~/Programming/Personal/freehold-ledger`, not created yet; JIP-470 creates it).
- **Website:** built in `site/` (decided and started 2026-10-20): Astro 7 + Vue 3 + Tailwind 4, static output, Cloudflare Pages free tier, domain on Cloudflare. `/` renders PHILOSOPHY.md, `/standard` renders FRAMEWORK.md, `/feed` is Markdown posts with RSS, `/marketplace` is the registry with `/registry.json`. Linear project: https://linear.app/jippylong12/project/freeholdersorg-809c612d7e46. Live at https://freeholders-org.pages.dev (Cloudflare Pages project `freeholders-org`, deployed with `pnpm deploy`); source at https://github.com/jl12-studio/freehold. Still to do: bind freeholders.org and www.freeholders.org to the project and add the www redirect (steps in `site/DEPLOY.md`).
- **Follow-up, not started:** once freeholders.org is up, add a Freehold section to jippylong12.xyz (repo at `~/WebstormProjects/jippylong12xyz`) linking out to it.
- **Name and domain:** Freehold / freeholders / freeholders.org, decided 2026-10-20. **freeholders.org purchased on Cloudflare 2026-10-20** ($8.50 first year). GitHub `freehold` and `freeholders` were unclaimed on 2026-10-20; nothing claimed yet.
- **Roadmap position:** Step 1 of 3 (1. Ramble → 2. freeholders.org → 3. Book). The site's shape is set (philosophy page + live feed, plus the marketplace) and it is built in `site/` and deployed.
- **First application:** **Freehold Ledger**, the simple accounting app (the "QuickBooks scene" in PHILOSOPHY.md). Planned in Linear, Jippylong12 team: https://linear.app/jippylong12/project/freehold-ledger-3aeec41a94a4. Stage 1 (local desktop, Mac-first) only, per Desktop → Cloud → Mobile. Active milestones: M1 Foundation & Data Model → M2 Local Ledger Core → M3 MCP Surface (ship point) → M4 Tax-Ready Output → M6 Import exploratory (JIP-469 to 476, 480). Cloud descoped: JIP-477/478/479 canceled, kept as reference. Work it with the `linear-project-workflow` skill; first-session prompt at `tmp/freehold-ledger-m1-first-session.md`. JIP-470 still needs: license (Marcus approves), platform approach, and creating the `freehold-ledger` repo.
- **Last activity:** 2026-10-20, named the movement, moved the repo, renamed the Linear project, decided the site stack, built freeholders.org in `site/`, and deployed it to Cloudflare Pages. See the Log in PHILOSOPHY.md for full history.
