# Freehold design system

Binding for every UI issue after JIP-1332. Read this instead of loading a design skill. If something you need is not here, use the closest rule here and note the gap in your report; do not invent a new color, size, font, or motion.

Source of truth for values: `src/styles/global.css`. This document explains them and says how to use them.

## Intent

Freehold means owning your ground outright: the homestead, the deed, the commons kept for everyone. The site reads like a document, not a landing page. Typography carries the identity; color is paper, ink, and one field green. No boxes around reading text, no cards on the reading pages, no shadows, no gradients.

## Type

| Role | Family | Package | CSS name | Tailwind |
| --- | --- | --- | --- | --- |
| Reading and display | Literata (variable, `opsz` 7 to 72, `wght` 200 to 900, roman and italic) | `@fontsource-variable/literata` (`opsz.css`, `opsz-italic.css`) | `"Literata Variable"` | `font-serif` |
| UI: nav, labels, tables, badges, footer links | Public Sans (variable, `wght` 100 to 900, roman only) | `@fontsource-variable/public-sans` (`wght.css`) | `"Public Sans Variable"` | `font-sans` |
| Code | System monospace stack (no webfont) | none | `ui-monospace, ...` | `font-mono` |

Why: Literata was drawn for long reading on screens (Google Play Books) and has an optical-size axis, so the same family is sturdy at 17px and refined at 96px. Its bracketed, bookish forms carry the "permanence, land deed, eventual book" mood without costume. Public Sans is the US Web Design System's typeface: civic, plain, legible at 14px, a quiet nod to the big-G Government is the people. Both are self-hosted through Vite into `/_astro/`; no request leaves the origin. Rejected: Newsreader (more elegant, but condensed and newsy, less grounded), Source Serif 4 (excellent but anonymous), Fraunces (charming at display, too quirky for 5,000 words), Inter (the default startup look), any Google Fonts or CDN link (external request).

Body (`body`) defaults to `font-serif`. UI chrome must opt into `font-sans` explicitly.

### Scale

Fluid sizes clamp between 375px and 1280px viewports. Each size token sets its own line height.

| Token | Utility | Size | Line height | Use |
| --- | --- | --- | --- | --- |
| `--text-display` | `text-display` | 52px to 96px | 0.95 | The hero masthead "Freehold" only. Weight `font-[560]`, `tracking-[-0.03em]`. |
| `--text-h1` | `text-h1` | 32px to 44px | 1.1 | Page and document titles. Weight 600, tracking -0.015em. |
| `--text-h2` | `text-h2` | 24px to 32px | 1.2 | Section headings. Weight 600. |
| `--text-h3` | `text-h3` | 20px to 23px | 1.3 | Subsections. Weight 600. |
| `--text-h4` | `text-h4` | 16px | 1.4 | Minor heads, set in `font-sans` weight 650. |
| `--text-lead` | `text-lead` | 20px to 24px | 1.4 | One-line definitions, post summaries. Often `italic`. |
| `--text-body` | `text-body` | 17px to 19px | 1.65 | All reading text. Never below 17px. |
| `--text-ui` | `text-ui` | 15px | 1.4 | Nav, table text, footer links, buttons. |
| `--text-caption` | `text-caption` | 14px | 1.5 | Dates, metadata, badges, TOC on desktop. Smallest size allowed. |

Weights: 400 body, 560 to 620 for UI emphasis and the wordmark, 600 headings, 650 `strong`. Do not use 700+.

### Measure

- `--container-measure: 39rem` (`max-w-measure`). At 19px Literata this is 68 characters per line (measured in the browser at 1280px: 624px wide, 68.1 characters). Every block of reading text sits inside this width.
- `--container-toc: 13rem` (the desktop table-of-contents column).
- `--container-page: 56rem` (`max-w-page`) = TOC 13rem + 4rem gap + measure 39rem. The wide frame.

## Color

Semantic tokens only. The default Tailwind palette is removed (`--color-*: initial`), so `bg-red-500` and friends do not exist. Use `bg-bg`, `text-fg`, `text-muted`, `text-accent`, `border-rule`, `bg-surface`, and the status tokens. Opacity modifiers are allowed on these (`text-fg/90`, `bg-current/10`).

Light and dark follow `prefers-color-scheme` only. There is no toggle and no theme script.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--color-bg` | `#f6f2e9` paper | `#14120f` loam | Page background. |
| `--color-surface` | `#ede7da` | `#211e19` | Code blocks, inline code, the rare filled region. Never a card around reading text. |
| `--color-fg` | `#1f1b16` ink | `#ece5d7` parchment | Body text, headings. |
| `--color-muted` | `#5f574b` | `#a79d8c` | Secondary text: sub-lines, dates, nav at rest, blockquotes, list markers. |
| `--color-accent` | `#2d6141` field green | `#93c4a1` sage | Link hover, link underlines, current nav underline, blockquote rule, the mark. Never large fills. |
| `--color-rule` | `#d8cfbe` | `#35302a` | Hairlines: header border, table rows, `hr`, TOC rail. Decorative only (it is not text). |
| `--color-focus` | `#2d6141` | `#93c4a1` | Focus outline. |

Dark is designed, not inverted: a warm loam black instead of gray, parchment text instead of white, and a lighter sage so the accent keeps its weight without glowing.

### Contrast (WCAG 2.x, computed from the hex values)

| Pair | Light | Dark | Needed |
| --- | --- | --- | --- |
| Body text (`fg`) on `bg` | 15.32 : 1 | 14.92 : 1 | 4.5 |
| Muted text (`muted`) on `bg` | 6.37 : 1 | 6.98 : 1 | 4.5 |
| Link at rest (`fg`, accent underline) on `bg` | 15.32 : 1 | 14.92 : 1 | 4.5 |
| Link on hover (`accent`) on `bg` | 6.49 : 1 | 9.48 : 1 | 4.5 |
| `fg` on `surface` | 13.89 : 1 | 13.25 : 1 | 4.5 |
| `muted` on `surface` | 5.77 : 1 | 6.20 : 1 | 4.5 |
| Focus outline (`focus`) on `bg` | 6.49 : 1 | 9.48 : 1 | 3 (non-text) |
| `building` text on `bg` | 6.03 : 1 | 9.34 : 1 | 4.5 |
| `certified` / `pass` text on `bg` | 6.49 : 1 | 9.48 : 1 | 4.5 |
| Badge text on its own tint (10 to 12% of itself over `bg`), worst case | 5.09 : 1 (building) | 5.85 : 1 (planned) | 4.5 |

Any new pair must be computed and added here before it ships.

### Status colors (reserved)

Only the marketplace badges and checklist statuses use these. Never use them for anything else, and never show a status by color alone: every status renders its glyph and its word.

| Status | Token (utility) | Light | Dark | Glyph | Component |
| --- | --- | --- | --- | --- | --- |
| planned | `--color-planned` (`text-planned`) | `#5f574b` | `#a79d8c` | ○ | `<StatusBadge status="planned" />` |
| building | `--color-building` (`text-building`) | `#83500f` ochre | `#ddb06a` | ◐ | `<StatusBadge status="building" />` |
| certified | `--color-certified` (`text-certified`) | `#2d6141` | `#93c4a1` | ● | `<StatusBadge status="certified" />` |
| pass | `--color-pass` (`text-pass`) | `#2d6141` | `#93c4a1` | ✓ | `<PointStatus status="pass" />` |
| not yet | `--color-not-yet` (`text-not-yet`) | `#83500f` | `#ddb06a` | ○ | `<PointStatus status="not-yet" />` |
| n/a | `--color-na` (`text-na`) | `#5f574b` | `#a79d8c` | – | `<PointStatus status="n/a" />` |

Use the components in `src/components/ui/`; do not restyle them per page.

- **Badge** (`StatusBadge.astro`): pill, `rounded-full`, 1px border in the status color at 35%, fill in the status color at 10%, `font-sans text-caption font-[560]`, `px-2.5 py-0.5`, glyph then word. The one place a pill shape is allowed.
- **Checklist status** (`PointStatus.astro`): no pill, no fill. Glyph in a 1em box, then the word, `font-sans text-caption font-[560]` in the status color.
- **Checklist layout** (for `/marketplace/<slug>`): an `<ol>` of the 10 points, each row a two-line block: line 1 is the point number (`font-sans text-caption text-muted tabular-nums`, fixed `w-8`), the point title (`font-serif text-body`), and `PointStatus` pushed right (`ml-auto`); line 2 (optional) is the note in `text-muted` and the evidence link. Rows are separated by `border-b border-rule` with `py-4`. No row backgrounds, no zebra stripes.

## Spacing

Tailwind's default 0.25rem step stays, but only these steps are used: `1` (4px), `1.5`, `2` (8px), `2.5`, `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `14` (56px), `16` (64px), `24` (96px), `32` (128px). Space between things is the primary structure; prefer more space over a line or a box.

Rhythm inside `.prose` is in `em` and handled by the class (paragraphs 1.25em apart, headings 1.75em to 1.9em of their own size above, 0.75em below). Do not add margins to Markdown output.

## Layout and frames

- `.frame` is the reading frame: `max-width` = measure plus gutters, centered. Gutters are 1.25rem (20px) below 640px and 2rem from 640px up.
- Add `.frame-wide` for wide pages. `BaseLayout` does this for you: pass `wide` and the header, `<main>`, and footer all switch together, so their left and right edges always line up with the content.
- Pages that need `wide`: `/` and `/standard` (TOC), `/marketplace` (card grid). Reading pages (`/feed/<slug>`, `/marketplace/<slug>`, `/feed`, `/404`) use the default measure.
- `<main>` already has `pt-12 sm:pt-16`. Do not add another top padding.
- Breakpoints are Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px. The TOC switches at `lg`.

## BaseLayout

`src/layouts/BaseLayout.astro`, props: `title?` (page name; rendered `<title> · Freehold`; omit on `/` to get just `Freehold`), `description?` (defaults to `site.description`), `wide?`. It renders the head (charset, viewport, canonical from `Astro.url`, Open Graph with `/og.png`, RSS alternate, favicon, theme-color per scheme, `<ClientRouter />`), the header, `<main id="main">` with your slot, and the footer. Every page uses it.

## Header

- Wordmark at left: the mark (the F seal, `ui/Mark.astro`) plus "Freehold" in `font-serif`, 22px, weight 620, tracking -0.012em, ink color, no underline, `transition:name="wordmark"`. It links to `/`.
- Nav at right, `font-sans text-ui`: Philosophy `/`, Standard `/standard`, Feed `/feed`, Marketplace `/marketplace`. At rest `text-muted`; hover `text-fg` with a rule-colored underline; current page `text-fg`, weight 560, and a 2px accent underline offset 0.45em. `aria-current="page"` on an exact match, `aria-current="true"` on a child route (for example `/feed/<slug>` marks Feed).
- From 640px up the header is sticky (`top-0`), solid `bg-bg`, with a 1px `border-rule` bottom. No blur, no shadow, no shrink-on-scroll.
- Below 640px (the 375px rule): the header is not sticky, so it never eats reading height. The wordmark sits on the first row and the nav on a second row, all four items visible at 375px (measured: 364px of nav in a 375px viewport with gutters). If a future item no longer fits, the nav row scrolls horizontally (`overflow-x-auto` is already set); it never wraps into a menu, and there is no hamburger.
- A "Skip to content" link is the first focusable element; it appears only on focus.
- Heading anchors get `scroll-margin-top: var(--header-offset)` (1.5rem below 640px, 5.5rem above), set globally. Anything you make linkable by `id` inherits it via `:target`.

## Footer

Top hairline (`border-rule`), `mt-24 sm:mt-32` above it. Two blocks:

1. Text, max measure: the definition "Freehold software is software you own outright." in `font-serif text-lead text-fg`; then "Freehold is a status, not a brand. The standard is public; this is one registry." in serif italic; then the receipts line from `site.costs` as a `.label` (sans, caption, muted, tabular numbers): "Built at cost: $0 a month on Cloudflare Pages, $8.50 a year for the domain."
2. Links, `font-sans text-ui text-muted` with muted underlines: Source, RSS, Registry JSON, Writing CC BY-SA 4.0, code MIT. On wide pages from `md` up they stack right-aligned in a second column; otherwise they wrap in a row under the text.

Do not add newsletter boxes, social icons, or "made with" badges.

## Prose (`.prose`)

Wrap rendered Markdown in `<article class="prose">` inside a measure-width column. The class covers:

- `h1` to `h4` per the scale above; `h4` switches to sans. Headings balance their lines (`text-wrap: balance`); paragraphs use `text-wrap: pretty`.
- Paragraphs 1.25em apart. `strong` 650, `em` italic (Literata has a true italic).
- Links: ink text, 1px accent underline at 55%, offset 0.2em; hover turns text and underline full accent. Links are always underlined in prose (never color alone).
- Lists: disc, then circle when nested; ordered lists use decimal with sans tabular markers. Markers are muted. Items 0.5em apart, nested lists 0.5em below their parent line.
- Blockquote: 2px accent rule at left, 1.25em indent, italic, muted text; `strong` and links inside return to ink.
- Tables: `font-sans text-ui`, tabular numbers, left aligned, header row with a muted bottom border, body rows with `border-rule`, no vertical lines, no fills. Wide tables scroll horizontally inside themselves; the page never scrolls sideways.
- Inline code: monospace at 0.84em on `surface`, 3px radius. Code blocks: `surface` background, 5px radius, 1rem by 1.25rem padding, horizontal scroll. Syntax colors are flattened to ink on purpose (calm, and Shiki's default theme fails contrast in light mode).
- `hr`: 1px `rule`, 3em above and below.
- `del` / `s` (the Open Questions list): muted with a 1px strike.

## Hero (`/`)

The shape is in `src/pages/index.astro`; JIP-1333 keeps it and replaces only the copy and data.

```
section.hero (aria-label="Freehold"), left aligned to the wide frame
  p   "Freehold"                         font-serif text-display font-[560] tracking-[-0.03em] text-fg
  p   one-line definition                mt-5 sm:mt-6 max-w-measure font-serif text-lead italic text-fg
  p   sub-line (one sentence)            mt-3 max-w-measure font-sans text-ui text-muted
  p.label  "Updated <time>"              mt-6, date from the PHILOSOPHY.md Log, en-US long form ("October 20, 2026")
  div.hero-slot[data-slot=comparison]    lg:mt-16 lg:border-t border-rule; the M3 comparison island mounts here
div.doc-grid                             mt-10 sm:mt-12 lg:mt-14
```

- The masthead "Freehold" is a `<p>`, not a heading: the page's `<h1>` is the document's own title ("The Philosophy (Working Document)"), rendered first inside `.prose`. One `h1` per page.
- No buttons, no call to action, no illustration, no background color in the hero.
- The M3 animated comparison sits inside `.hero-slot`, full wide-frame width, below the hairline, with its own `mt-10` and a fixed height reserved before hydration (no layout shift). It is the only animated element in the hero.

## Table of contents (`/` and `/standard`)

Shape in `src/pages/index.astro`. The page passes `wide` to `BaseLayout`.

- Grid from `lg`: `lg:grid lg:grid-cols-[var(--container-toc)_minmax(0,var(--container-measure))] lg:gap-x-16`. Left column `nav.toc` (`aria-label="Contents"`), right column the `article.prose`.
- Desktop TOC: the inner `div` is `sticky top-[var(--header-offset)]`, `font-sans text-caption`. A `.label` heading "Contents" in `text-fg` weight 600. An `<ol>` with `border-l border-rule`, items `pl-4` (depth 2) or `pl-7` (depth 3), links `text-muted` with no underline, hover `text-fg`. Only h2 and h3 appear. No scroll-spy highlight in v1 (it would need JavaScript).
- Below `lg`: the same entries render once more inside `<details class="toc-mobile ... lg:hidden">` with `<summary>Contents</summary>`, closed by default, placed above the article, between `border-y border-rule` hairlines, `font-sans text-ui`, depth 3 indented `pl-4`. The desktop `nav` is `hidden lg:block`, so only one copy is ever exposed to assistive tech.

## Marketplace cards (`/marketplace`)

The project calls for cards here, so this is the one page that gets them, and they stay quiet: an `<ul class="grid gap-4 sm:grid-cols-2">`, each card an `<li>` with `border border-rule rounded-[var(--radius-md)] p-5 sm:p-6`, no fill, no shadow, no hover lift (hover changes only the border to `border-muted` over `--motion-fast`). Inside, top to bottom: the name (`font-serif text-h3`, the whole name is the link, stretched over the card with an `after:absolute after:inset-0` on a `relative` card), the one line (`text-muted`, `mt-2`), and a meta row (`mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-caption text-muted`) holding `StatusBadge`, the stage word, and the pass count as "7 of 10 pass" (`tabular-nums`). The "List your software" section below the grid is ordinary `.prose`.

## Motion

Motion serves reading: it orients (page transitions) and reveals (content arriving). It never decorates, loops, or delays reading.

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 140ms | Color and underline changes on hover and focus. |
| `--motion-base` | 220ms | View transitions, `details` open, small state changes. |
| `--motion-slow` | 480ms | Reveal on scroll, the hero comparison's steps. Nothing is slower. |
| `--motion-distance` | 0.75rem | The largest allowed translate. |
| `--ease-out` (`ease-out` utility) | `cubic-bezier(0.22, 1, 0.36, 1)` | Everything entering or responding. |
| `--ease-in-out` (`ease-in-out` utility) | `cubic-bezier(0.65, 0, 0.35, 1)` | The comparison island's back-and-forth only. |

- **Allowed properties:** `opacity`, `transform` (translateY up to `--motion-distance`, no scale above 1.02, no rotation), `color`, `background-color`, `border-color`, `text-decoration-color`.
- **Never moves:** body text once read, the header, the footer, the nav, the wordmark (except its view-transition morph), the TOC, tables, and anything the reader is interacting with. No parallax, no scroll hijacking, no looping or pulsing, no bounce or elastic easing, no animated gradients, no staggering longer than 4 items (60ms apart).
- **Reveal on scroll (M3):** a block fades from `opacity: 0` and `translateY(var(--motion-distance))` to rest over `--motion-slow` with `--ease-out`, once, when 15% visible. Content must be visible without JavaScript: apply the hidden start state only from a class that the script adds, never in the static CSS.
- **View transitions:** `<ClientRouter />` with Astro's default fade on `<main>`. The header and footer use `transition:animate="none"` (chrome does not fade); the wordmark carries `transition:name="wordmark"` so it morphs between the narrow and wide frames. Do not add `slide` or custom page animations.
- **Reduced motion:** `global.css` sets every animation and transition to 0.01ms, removes delays, turns off smooth scrolling, and cancels all `::view-transition-*` animations under `prefers-reduced-motion: reduce`; Astro's router also skips its animations. Islands must additionally check `matchMedia('(prefers-reduced-motion: reduce)')` (or `@vueuse/motion`'s reduced-motion handling) and render the end state immediately. With reduced motion, nothing animates on load or on navigation.

## Focus and accessibility

- Every focusable element shows `outline: 2px solid var(--color-focus)` with a 3px offset on `:focus-visible`. Never remove it; if a parent clips it (overflow), give the child room with padding, as the header nav does.
- Body text is at least 17px everywhere. Captions are at least 14px.
- Links in reading text are underlined. Status is glyph plus word, never color alone.
- `lang="en"` on `<html>`; one `h1` per page; landmarks: header, `nav[aria-label]`, `main#main`, footer.

## Wordmark and favicon

- The mark is the F of the wordmark, cut as a slab F and set in a square plot with 6/32 rounded corners, like a seal pressed on a deed. Accent square, background-colored letter. `ui/Mark.astro` draws it with the live tokens, so it follows the scheme.
- `public/favicon.svg` is the same geometry with hard-coded hex and a `prefers-color-scheme: dark` block inside the SVG (sage square, loam letter). It reads at 16px: the stem and bars are at least 1.5px wide at that size.
- Do not recolor, outline, animate, or place the mark on a photo. Do not set "Freehold" in any other font.

## Do and do not

Do:

- Use the semantic tokens and the utilities named here.
- Let type size, weight, and space make the hierarchy.
- Keep reading text inside `max-w-measure`.
- Reuse `StatusBadge`, `PointStatus`, `Mark`, `.label`, `.prose`, `.frame`.
- Check both schemes at 375px and 1280px before you call UI done.

Do not:

- Add colors, fonts, shadows, gradients, blur, or rounded cards.
- Box reading text, zebra-stripe tables, or put icons next to headings.
- Load anything from another origin (fonts, scripts, images, analytics).
- Add a theme toggle, a hamburger menu, or JavaScript for layout.
- Type an em dash in anything you author, or the word for a political pamphlet that the README forbids.
