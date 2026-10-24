# Agent prompt: editorial photography portfolio

**How to use this file**

1. Put `photography-portfolio-architecture.md` in the repo as `docs/architecture.md`.
2. Put this file in the repo as `docs/agent-brief.md`.
3. Paste **Part A** (the brief) as the first message, or save it as `CLAUDE.md` / `AGENTS.md` / Cursor rules so the agent reads it every session.
4. Then paste **one phase prompt from Part C at a time**. Review and commit between phases.

Use an agentic coding tool that can read the repo and run the build (Claude Code, Cursor, etc.), not a plain chat window.

---

# PART A: The brief (paste first)

## Role

You are a senior front-end engineer building a photography portfolio for a small business. Clients are kindergartens, schools and weddings. You write production-quality TypeScript and care about image performance, accessibility and a calm, art-directed feel.

## Source of truth

- `docs/architecture.md` is the technical spec (content model, block inventory, layers, folder structure, image strategy, privacy rules). Follow it.
- This brief **overrides the visual design** in section 13 of that spec. The design is now **editorial and image-led** (described below). Component names, block names and the Storyblok mapping stay exactly as in the spec.

## Stack

Next.js (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui + Radix, Storyblok via `@storyblok/react/rsc`, and Motion (the library formerly called Framer Motion).

## Design intent

**"The images are the page."** The site should feel like a gallery wall or a printed photo book, not a marketing template.

- Photographs are large, usually edge to edge, and carry the layout.
- Text is minimal: a few words, set in a serif, laid over or beside images. No section headings for the sake of structure.
- No cards, drop shadows, boxed callouts or icon grids. Separation comes from 2px gaps between frames and from whitespace.
- Rhythm comes from varying scale: full-bleed frame, then a tight row, then an asymmetric composition, then a full-bleed frame again.
- Motion is slow and quiet. It reveals images; it never decorates.

### Tokens

| Token        | Value     | Use                     |
| ------------ | --------- | ----------------------- |
| `--bg`       | `#FAF7F2` | Page background         |
| `--ink`      | `#2B2723` | Text, dark sections     |
| `--muted`    | `#7A7168` | Captions, process line  |
| `--line`     | `#E7E0D6` | Hairlines (rare)        |
| `--accent`   | `#C86B4A` | Links, underline, focus |
| `--sage`     | `#8A9A83` | Kindergarten accent     |
| `--rose`     | `#C79F9A` | Wedding accent          |
| `--on-image` | `#FFFFFF` | Text laid over photos   |

Set `data-segment="kindergartens | schools | weddings"` on the page wrapper to swap `--accent` per segment.

**Type:** serif for all display and caption text (Fraunces or Cormorant Garamond via `next/font`), light weight; sans (Inter or DM Sans) for nav, captions and form UI. Hero headline 40px mobile to 96px desktop (`clamp`). Labels over images 19-28px serif. Captions 11-12px sans.

**Spacing:** frames are separated by `2px` (`gap-[2px]`). Sections otherwise have no padding between them except around the closing call to action.

### Page recipe (home), top to bottom

Build the homepage from existing Storyblok blocks. Do not create new components for the page itself; configure blocks.

1. **`hero_fullbleed`**: image fills `min-h-[85svh]` (cap around 900px on very tall screens). Transparent nav overlaid on top (white text). Headline bottom-left, large serif, two lines. No buttons. A small "Scroll" cue bottom-right. Image uses `priority`.
2. **`segment_chooser`**: three full-height panels in one row, `gap-[2px]`, about `60svh` tall on desktop. Each panel is a full-bleed image with one serif label bottom-left plus an `arrow-up-right` icon. No description text. On mobile: stack as three full-width frames (about `55svh`) or a horizontal scroll-snap row; choose stack.
3. **`image_full`** (variant `full-bleed`): one large image, tiny caption bottom-left, 11-12px.
4. **`image_pair`** (variant `asymmetric`): left frame about 5/8 width and tall; right column about 3/8 containing a short frame stacked on a taller frame, aligned to the bottom. Mobile: single column.
5. **`quote`** (variant `over-image`): full-bleed image, centered italic serif quote, small attribution beneath. Text tone and overlay strength are editor fields.
6. **`gallery_grid`** (variant `strip-3`): three equal frames in a row, `gap-[2px]`, no captions.
7. **`process_steps`** (variant `line`): one thin horizontal line of 4 words separated by short hairlines. 11px, muted. Not numbered cards.
8. **`cta_banner`** (variant `minimal`): one serif sentence and one underlined text link with an arrow. No button fill.

Segment pages (`/kindergartens`, `/schools`, `/weddings`) follow the same language: hero, large editorial frames, packages and FAQ presented as quietly as possible (typographic lists, hairlines, no cards).

## Block field additions required for this design

Add these to the Storyblok schema and mirror them in the generated types (document them in `docs/storyblok-schema.md`):

- `hero_fullbleed`, `segment_chooser` items, `quote`: `overlay_strength` (single-option: none / light / medium / strong), `text_tone` (light / dark), `focal_point` is read from the asset's focus field.
- `image_full`: `layout` (contained / wide / full-bleed), `caption` (short text), `aspect` (auto / 3:2 / 16:9 / 4:5), `max_height` (single-option: none / 70svh / 90svh).
- `image_pair`: `variant` (equal / asymmetric / asymmetric-mirrored), image `aspect` per item.
- `gallery_grid`: `variant` (contained / edge-to-edge / strip-3), `gap` (none / 2px / 8px).
- `gallery_masonry`: `gap`, `edge_to_edge` (boolean).
- `process_steps`: `variant` (line / numbered).
- `cta_banner`: `variant` (minimal / filled).
- Every block that can sit full-width: `motion` (single-option: default / none) so editors can switch animation off for a block.

Rendering rules for overlays: use a solid black layer at the opacity mapped from `overlay_strength` (none 0, light 0.15, medium 0.3, strong 0.5), plus an optional subtle bottom scrim behind text. Text over images must stay readable; verify at least 4.5:1 for the strongest-contrast case, and note the limitation to editors in the field description.

## Image rules (critical for this design)

Frames are huge, so image delivery decides whether the site feels premium or sluggish.

- Every image goes through `<PhotoImage>` (spec section 8). No raw `<img>`.
- Add `sizes` presets: `hero` and `full-bleed` = `100vw`; `half` = `(min-width: 768px) 50vw, 100vw`; `third` = `(min-width: 768px) 33vw, 100vw`; `asym-large` and `asym-small` matching their column fractions.
- Request quality 85 for hero and full-bleed frames, 75-80 for small frames.
- `priority` only on the first hero image. Everything else lazy.
- Always reserve space (aspect ratio from asset dimensions) to prevent layout shift.
- Use the focus point for `object-position` on every cropped frame, including `segment_chooser` panels (they crop heavily).
- Blur placeholder on every frame.
- Never let hero or full-bleed frames start at `opacity: 0` (it hurts LCP). Animate with `transform` only on the hero image.

## Motion (Motion library)

Use Motion sparingly and consistently. Package note: the library is now published as `motion`, imported from `"motion/react"` (the older `framer-motion` package still works). In server components use `"motion/react-client"` or wrap in a client component. **Verify against current docs before installing.**

### Architecture for motion

Keep blocks as **server components**. Put motion in small client wrappers in `src/components/motion/` (Layer 2, no Storyblok imports):

- `Reveal`: fades and lifts children into view once (`whileInView`, `viewport={{ once: true, margin: "-10%" }}`). Props: `delay`, `y`, `as`.
- `MaskReveal`: clip-path inset reveal for large images (e.g. `inset(8% 0 0 0)` to `inset(0)`).
- `LineReveal`: headline split into lines, each masked and sliding up with stagger.
- `ParallaxFrame`: image taller than its frame, translated on scroll with `useScroll` + `useTransform`. Props: `strength` (default small, 6-10%).
- `Stagger`: parent/child variants for rows of frames.
- `MotionProvider`: wraps the app in `<MotionConfig reducedMotion="user">` with the shared transition defaults.
- `src/lib/motion.ts`: shared tokens, so nothing is hard-coded in components:
  - durations: `fast 0.25`, `base 0.6`, `slow 1.1`
  - easing: one custom ease-out, e.g. `[0.22, 1, 0.36, 1]`
  - variants: `fadeUp`, `fadeIn`, `maskUp`

In blocks, put `storyblokEditable(blok)` on the outer server-rendered element and place the motion wrapper **inside** it, so the Visual Editor click-to-edit outlines keep working.

### Where to use it

1. **Hero:** image eases from scale `1.06` to `1` over about 1.6s (transform only). Headline lines rise out of a mask with a small stagger. Nav and "Scroll" cue fade in after the headline. Optional gentle parallax on scroll.
2. **Header:** transparent over the hero, fades to a solid `--bg` background after scrolling past it. Optionally hides on scroll down and returns on scroll up. Mobile `Sheet` links stagger in when opened.
3. **Segment chooser panels:** staggered entrance on first view. On hover (desktop): image scales to about 1.04 over 0.8s, the arrow nudges up-right, sibling panels dim slightly. Optional: the hovered panel grows via `flex-grow`/`layout` animation (desktop only, behind a `hover: hover` check).
4. **Full-bleed and large frames:** `MaskReveal` on entry, with a subtle `ParallaxFrame` inside the frame.
5. **Asymmetric pair:** the two columns get slightly different parallax strengths, which creates depth with zero extra UI.
6. **Quote over image:** quote fades up as a unit; if there are several quotes, crossfade with `AnimatePresence mode="wait"`.
7. **Lightbox:** shared-element transition with `layoutId` from the clicked thumbnail into the lightbox image; `AnimatePresence` for open/close; `drag="x"` swipe between images on touch; fade the backdrop.
8. **Portfolio filter:** `layout` prop on project cards so they reflow smoothly when the category changes, with `AnimatePresence mode="popLayout"` for items leaving.
9. **Process line:** the hairlines between steps draw in as the section enters view (scaleX from 0, origin left).
10. **CTA link:** underline draws from left on hover.
11. **Optional, last:** route transitions. App Router + `AnimatePresence` is fiddly; prefer a simple fade via a template file or the View Transitions API. Do not build this until everything else is done.

### Where NOT to use it

- Radix components with built-in states (Accordion, Dialog, Sheet) keep their CSS-driven animations unless there's a clear gain.
- No animation on body text, forms, pricing or FAQ content.
- No continuous or looping motion. No autoplay carousels. No scroll-jacking or snap-controlled scroll.
- Don't animate `width`, `height`, `top` or `left`. Use `transform`, `opacity`, `clip-path`.
- Don't animate more than the first view of each section (`once: true`).

### Motion quality bar

- `prefers-reduced-motion`: all wrappers degrade to no movement (opacity-only at most).
- Per-block `motion: none` switch honored.
- No layout shift introduced by animation; no hydration warnings.
- Lighthouse performance on the home page stays above 90 on mobile; LCP is the hero image.
- Scroll stays smooth on a mid-range phone (test with CPU throttling).

## Hard rules

- Server components by default; `"use client"` only for interaction and motion wrappers.
- Layers 1-2 (`ui/`, `photo/`, `layout/`, `motion/`) never import from Storyblok.
- Registry keys and filenames match Storyblok technical names.
- No `any`. Types come from the generated Storyblok types.
- No children's names in alt text, captions or filenames.
- No new dependencies without asking (Motion is pre-approved).
- Verify Storyblok, Next, shadcn and Motion APIs against current docs; don't guess.
- If something here conflicts with `docs/architecture.md`, stop and ask.

## Working agreement

- Start every phase with a short plan (max 8 lines). Wait for approval if the phase touches schema, routing or dependencies.
- Keep each step runnable: `npm run build` and `npm run lint` pass before you report done.
- After each phase, report: files changed, decisions made, anything uncertain.
- Use placeholder images (neutral coloured frames) until real assets exist, and use realistic aspect ratios so layout is accurate.

---

# PART B: Content to seed (for the first run)

Create seed content in code (or a script) so the design can be judged without the CMS fully filled:

- Home: hero headline "Moments that feel like you." Segment labels: Kindergartens, Schools, Weddings. CTA sentence: "Let's make something real." Link: "Send an inquiry".
- Process words: Inquiry, Plan, Photo day, Gallery.
- One placeholder quote and attribution.
- Replace all of it with Storyblok content once the registry is connected.

---

# PART C: Phase prompts (paste one at a time)

## Phase 1: Foundation and design system

> Read `docs/architecture.md` and `docs/agent-brief.md`. Plan first (max 8 lines), then implement.
>
> Scaffold the Next.js App Router project with TypeScript strict, Tailwind and shadcn/ui. Implement the design tokens as CSS variables and Tailwind theme values, `next/font` for the serif and sans, the `data-segment` accent switching, and the base layout shell (`SiteHeader` transparent-over-hero variant, `SiteFooter` minimal, `MobileNav` using `Sheet`). Add `src/lib/motion.ts` and `MotionProvider` with `reducedMotion="user"`. No Storyblok yet.
>
> **Acceptance:** build and lint pass; a test page shows tokens, fonts, header over a placeholder full-bleed frame; reduced-motion respected.

## Phase 2: Storyblok connection and PhotoImage

> Implement the Storyblok client and component registry, catch-all route, draft mode and the Visual Editor bridge, exactly as in the spec. Then implement `PhotoImage` with the custom loader, dimension parsing, focus-point `object-position`, blur placeholder and the `sizes` presets listed in the brief (including `full-bleed`, `half`, `third`, `asym-large`, `asym-small`).
>
> **Acceptance:** a draft story renders in the Visual Editor with click-to-edit; unit tests for URL parsing and focus-point conversion; no raw `<img>` anywhere.

## Phase 3: Motion primitives

> Build `Reveal`, `MaskReveal`, `LineReveal`, `ParallaxFrame` and `Stagger` in `src/components/motion/`, using the tokens in `src/lib/motion.ts`. Each is a small client component with typed props and a `disabled` prop wired to the per-block `motion: none` field. Build a `/dev/motion` page showing each primitive on placeholder frames, with a reduced-motion toggle note.
>
> **Acceptance:** no layout shift; transform/opacity/clip-path only; reduced-motion verified; build and lint pass.

## Phase 4: Home page blocks (editorial set)

> Implement these blocks as server components wrapping the motion primitives, with the variants and fields from the brief: `hero_fullbleed`, `segment_chooser`, `image_full`, `image_pair`, `quote`, `gallery_grid`, `process_steps`, `cta_banner`. Keep `storyblokEditable` on the outer element. Add the new fields to the Storyblok schema docs and regenerated types. Assemble the home page from seed content.
>
> **Acceptance:** home page matches the page recipe at 390px, 768px and 1440px; hero image is the LCP and starts with no opacity animation; 2px gaps between frames; overlay strength and text tone fields work; Lighthouse mobile performance above 90.

## Phase 5: Segment pages and project pages

> Implement `segment_page` and `project` renderers, `package_cards` and `testimonials` as quiet typographic blocks (hairlines, no cards), `faq` using Radix Accordion with CSS animation, and `trust_bar` as a single line of short statements. Wire `data-segment` accents per page. Resolve referenced `package` and `testimonial` entries.
>
> **Acceptance:** all three segment pages render from seed content in the same visual language; build, lint and type checks pass.

## Phase 6: Lightbox and portfolio filtering

> Implement the lightbox (`Dialog` + Motion `layoutId` shared-element transition, `AnimatePresence`, swipe with `drag="x"`, keyboard navigation, focus trap, loads the large image variant only when opened) and the `/portfolio` filter bar (`ToggleGroup`, URL-synced) with `layout` animations on the project grid.
>
> **Acceptance:** fully keyboard-operable; focus returns to the trigger on close; reduced-motion falls back to simple fades; no layout jumps.

## Phase 7: Business layer, SEO, polish

> Implement the segment-aware contact form (server action, validation with zod, honeypot, Resend), JSON-LD and metadata, sitemap, revalidation webhook, and the privacy page. Then run an accessibility pass (contrast of text over images, focus styles, alt text rules) and a performance pass (image sizes, LCP, JS payload of motion wrappers).
>
> **Acceptance:** Lighthouse mobile: performance above 90, accessibility above 95; no console errors; report of any contrast risks with specific blocks and fields.

---

# PART D: Review checklist (for you)

- Any raw `<img>` or direct `next/image` in a block?
- `"use client"` on anything that doesn't need it? Blocks should be server components.
- Hero image animating opacity (LCP risk)?
- Motion on text-heavy content or forms?
- Animating width/height/top/left instead of transforms?
- Text over images readable on the brightest and darkest photos?
- 2px gaps consistent; no stray cards, shadows or rounded boxes sneaking in?
- Reduced-motion tested?
- Storyblok imports leaking into `ui/`, `photo/`, `layout/`, `motion/`?
