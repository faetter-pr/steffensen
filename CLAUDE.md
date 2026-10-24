# Project rules

## Context

Photography portfolio for a small business. Clients: kindergartens, schools, weddings.

- **docs/architecture.md** — technical spec (content model, blocks, layers, folders,
  image strategy, privacy). Follow it.
- **docs/agent-prompt-editorial-portfolio.md** — the visual brief. It **overrides
  architecture.md §13** entirely. The design is editorial and image-led: "the images are
  the page". Component, block and field names still come from architecture.md.
- **docs/storyblok-schema.md** — generated CMS build guide. Do not hand-edit.

## Stack

Next.js (App Router), TypeScript (strict), Tailwind, shadcn/ui, Radix,
Storyblok via @storyblok/react/rsc, Motion (`motion`, imported from `motion/react`).

## Hard rules

- Server components by default; "use client" only for interaction and motion wrappers.
- All images go through <PhotoImage>. Never use raw <img> or next/image directly in blocks.
- Layers 1-2 (ui/, photo/, layout/, forms/, motion/) must not import from Storyblok.
- Block component filenames and registry keys match the Storyblok technical name.
- No `any`. Types come from the generated Storyblok types.
- Never publish children's names in alt text, captions, or filenames.
- Verify Storyblok / Next / shadcn / Motion APIs against current docs; don't guess.
- No cards, drop shadows, boxed callouts, icon grids or rounded boxes. Separation is
  2px gaps and whitespace. `--radius` is 0 and should stay 0.
- Animate `transform`, `opacity` and `clip-path` only — never width/height/top/left.
  Never fade the hero or a full-bleed frame from `opacity: 0` (it costs LCP).

## Workflow

- Propose a short plan before writing code. Wait for my approval on anything non-trivial.
- Work in small steps; each step should run (`npm run build`, `npm run lint`).
- Don't add dependencies without asking.
- If the spec is ambiguous, ask instead of assuming.

---

# Setup notes

Everything below was decided while scaffolding. It records decisions, not new rules.

## Toolchain

**Use Node 24.** `.nvmrc` pins `v24.21.0`; run `nvm use` before anything else.
Your nvm default is v20.11.0, which is too old for the shadcn CLI (needs >=20.18.1)
and for eslint's `eslint-visitor-keys` (needs ^20.19.0). Next itself only needs >=20.9.

Pinned versions, verified against the npm registry at setup time:

| Package             | Version | Note                                                                                                                          |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| next                | 16.4.2  |                                                                                                                               |
| react / react-dom   | 19.3.0  |                                                                                                                               |
| tailwindcss         | 4.x     | CSS-first — there is no `tailwind.config.js`                                                                                  |
| @storyblok/react    | 7.3.1   | **stay on 7.x**; 8.0.0 is `rc` only and rewrites the API around `@storyblok/api-client`                                       |
| @hookform/resolvers | 5.9.2   | **not 6.x** — 6.0.0 wants `effect@^4` as an optional peer and conflicts with the `effect@^3` that `@typeschema/main` pulls in |

## Decisions that close open questions in architecture.md §15

- **§15.1 Language: Danish only.** Single locale, no i18n routing. `<html lang="da">`.

## Corrections to architecture.md

- **§6 `lib/storyblok/provider.tsx` is obsolete.** `@storyblok/react@7` exports
  `StoryblokStory` and `StoryblokLiveEditing` from `@storyblok/react/rsc`, which handle the
  Visual Editor bridge. Don't hand-roll a provider.
- **§7 is correct as written.** `storyblokInit` really does return `() => StoryblokClient`
  in 7.3.1, so `export const getStoryblokApi = storyblokInit({...})` is right.
- **§13.2 accent fails contrast.** Terracotta `#C86B4A` on `#FAF7F2` is ~3.6:1, below the
  4.5:1 that §13.10 requires. `--brand-accent` is for large text, borders, icons and button
  fills (white on terracotta passes). Use `--brand-accent-ink` for normal-size text and
  inline links on the page background. Same split exists for the sage and dusty-rose segments.

## Which hard rules are machine-enforced

`eslint.config.mjs` enforces four of them, so violations fail `npm run lint`:

| Rule                        | Mechanism                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------ |
| No raw `<img>`              | `no-restricted-syntax` on `JSXOpeningElement[name.name='img']`                       |
| No `next/image` in blocks   | `no-restricted-imports` scoped to `components/blocks/`, `components/pages/`          |
| Layers 1-2 are CMS-agnostic | `no-restricted-imports` banning `@storyblok/*` in `components/{photo,layout,forms}/` |
| No `any`                    | `@typescript-eslint/no-explicit-any: error`                                          |

`src/components/ui/**` is lint-ignored — it is vendored shadcn output.

**One documented exception to the layer rule:** `components/photo/photo-image.tsx` may import
`@/lib/storyblok/image-loader`. §8 requires PhotoImage to drive the Storyblok Image Service and
§6 puts those helpers under `lib/storyblok/`, so the rule as literally written is unsatisfiable.
The exception is narrow: that one file, that one pure URL-building module, never the SDK, and
PhotoImage still takes plain props rather than bloks. Nothing else in layers 1-2 gets this.

The remaining hard rules (server-by-default, registry keys matching technical names, no
children's names in alt text) are not mechanically checkable; they stay review-level.

## Storyblok types

There is no Storyblok space yet, so the schema is hand-written in
`storyblok-components.json` instead of pulled. Two files, two jobs:

| File                               | Role                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `storyblok-components.json`        | The schema. Hand-edited. Also the file to `push-components` into the space later.              |
| `src/lib/storyblok/generated.d.ts` | `npm run generate:types` output. **Never hand-edit** — lint-ignored, overwritten on every run. |
| `src/lib/storyblok/types.ts`       | Thin adapter over the generated file. The only Storyblok type surface app code imports.        |

When the real space exists: `storyblok pull-components --space ID` over
`storyblok-components.json`, `npm run generate:types`, then fix whatever breaks in
`types.ts`. Nothing else should need touching.

**Adapting generated types: intersect, never `Omit`.** The generator emits a
`[k: string]: unknown` index signature on every blok, and `Omit<T, K>` over such a type
collapses to `{}`, silently discarding every named property. `types.ts` documents the four
patches it applies (`_editable`, multilink `story`, richtext, `seo` arrays).

Until `STORYBLOK_TOKEN` is set, `fetchStory`/`fetchGlobal`/`fetchProjects` return `null`,
`generateStaticParams` returns `[]`, and pages render a "not configured" notice.
`npm run build` is expected to pass in that state — keep it that way.

## Motion

`motion@14.6.0` — the package formerly called framer-motion, which is now an alias
published at the same version. Import from `motion/react`.

Blocks stay **server components**. Motion lives in small client wrappers in
`src/components/motion/`, all of which are layer 2 (no Storyblok imports):

| Wrapper | Use |
|---|---|
| `Reveal` | fade + lift into view, once |
| `MaskReveal` | clip-path inset reveal for large frames |
| `LineReveal` | headline lines rising out of a mask |
| `ParallaxFrame` | scroll-driven translate inside a frame |
| `Stagger` / `StaggerItem` | rows of frames |
| `HeroImage` | hero scale 1.06→1, transform only |
| `SegmentPanel` | chooser panel with hover scale |
| `ProcessLine` | hairlines drawing in |
| `MotionProvider` | `<MotionConfig reducedMotion="user">` in the root layout |

Tokens live in `src/lib/motion.ts` — never hard-code a duration or easing.
`--ease-gentle` in globals.css matches `EASE` so CSS and Motion feel like one system.

`storyblokEditable(blok)` goes on the outer server-rendered element and the motion
wrapper sits **inside** it, so Visual Editor click-to-edit keeps working.

Every block reads its `motion` field via `motionDisabled()` and passes the result to
its wrappers' `disabled` prop, so an editor can silence one block.

**Gotcha, already hit once:** a plain function exported from a `"use client"` module
cannot be *called* from a server component — only rendered or passed as a prop. That is
why `toLines()` lives in `src/lib/text.ts` and not next to `LineReveal`. This fails at
runtime, not at build: `generateStaticParams` returns `[]` for /preview in production,
so `npm run build` does **not** exercise those routes. Check /preview in `npm run dev`.

## Design sandbox (/preview)

`/preview` renders blocks from `src/mock/fixtures.json` with no Storyblok connection, so
components can be built and reviewed before the space exists. **Dev only** — both routes
`notFound()` when `NODE_ENV === "production"`.

Adding a block:

1. Add its schema to `storyblok-components.json`, then `npm run generate:types`
2. Build `src/components/blocks/<technical-name>.tsx` and register it in `client.ts`
3. Add fixtures under `blocks.<technical_name>` in `src/mock/fixtures.json`

It then appears at `/preview` automatically. Give each block a few variants — the
sandbox stacks them, and a `segment` on a variant wraps it in `data-segment` so the §13.2
accent shift is visible.

Images in fixtures use `placeholder://WIDTHxHEIGHT`. `<PhotoImage>` renders those as a
coloured box (`.placeholder-image` in globals.css) at that aspect ratio — no image files,
no network, no layout shift. It is not test-only scaffolding; use it for any block whose
photography is not chosen yet.

## Known state

- `npm audit` reports 10 dev-only advisories (the `braces`/`micromatch` chain under
  `eslint-config-next`, and `esbuild`/`tsup` under `storyblok-generate-ts`). None reach the
  runtime bundle. `npm audit fix --force` downgrades `eslint-config-next` — don't run it.
- `shadcn add form` is a no-op: the `radix-nova` registry has no `form` component. The
  contact form (phase 4) will need a hand-written RHF wrapper. `react-hook-form`, `zod` and
  `@hookform/resolvers` are already installed.
- Build phases 2-7 in architecture.md §14 are not started. Only phase 1 (foundation) exists.
