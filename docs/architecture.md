# Photography Portfolio: Architecture & Design Plan

**Stack:** Next.js (App Router) · TypeScript · Storyblok (`@storyblok/react`, RSC entry) · Tailwind CSS · shadcn/ui · Radix
**Primary clientele:** kindergartens, schools, weddings, and similar (events, families, associations)

> Storyblok SDK details change often. Verify API names against the current docs before implementing.

---

## Table of contents

1. [Guiding principles](#1-guiding-principles)
2. [Audience and what they need](#2-audience-and-what-they-need)
3. [Sitemap and content model](#3-sitemap-and-content-model)
4. [Block inventory](#4-block-inventory)
5. [Component architecture](#5-component-architecture)
6. [Folder structure](#6-folder-structure)
7. [Mapping components to Storyblok](#7-mapping-components-to-storyblok)
8. [Image strategy](#8-image-strategy)
9. [Routing, data fetching, caching](#9-routing-data-fetching-caching)
10. [Editor experience checklist](#10-editor-experience-checklist)
11. [Business features](#11-business-features)
12. [Privacy and child-safety considerations](#12-privacy-and-child-safety-considerations)
13. [Design draft](#13-design-draft)
14. [Build phases](#14-build-phases)
15. [Open questions](#15-open-questions)

---

## 1. Guiding principles

1. **Images are the product.** Quiet UI, neutral palette, generous whitespace, minimal chrome.
2. **Storyblok is the single source of truth.** Pages are assembled from blocks; every block is a React component.
3. **Server components by default.** Client components only for interaction (lightbox, filters, mobile nav, forms, gallery login).
4. **Editors get guardrails.** Restricted block whitelists, required alt text, sensible defaults.
5. **Each audience gets its own front door.** A wedding couple and a kindergarten director are looking for different things; give each a dedicated landing page and tone.
6. **Trust before beauty for institutions.** Schools and kindergartens need to see professionalism, safety, and process, not only nice pictures.

---

## 2. Audience and what they need

| Segment                                               | Decision maker                      | What they look for                                                                           | What the site must show                                                          |
| ----------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Kindergartens**                                     | Director / pedagogical lead         | Calm, child-friendly approach; minimal disruption; GDPR compliance; fair institution pricing | Natural, warm child photography; clear process; consent handling; parent gallery |
| **Schools**                                           | Principal / office / parent council | Efficient class and portrait days; reliable delivery; pricing per pupil; fundraising options | Class-photo samples, logistics, timeline, packages, references                   |
| **Weddings**                                          | The couple (often with family)      | Style, emotional fit, trust, availability                                                    | Full-story galleries, testimonials, packages, easy inquiry with date             |
| **Other** (events, families, associations, portraits) | Varies                              | Quick overview, price, contact                                                               | Short "other work" page with an inquiry form                                     |

**Implication:** the site needs three strong segment landing pages plus a shared portfolio, about, and contact.

---

## 3. Sitemap and content model

```
/                         Home (segment chooser + best work)
/kindergartens            Segment landing page
/schools                  Segment landing page
/weddings                 Segment landing page
/other-work               Events, families, associations (lighter page)
/portfolio                All work, filterable by segment
/portfolio/[project]      Project / series detail
/about                    About me
/pricing                  Overview of packages (links to segment pages)
/contact                  Inquiry form (segment-aware)
/gallery                  Client/parent gallery access (PIN or link)
/journal  (later)         Behind-the-scenes posts
/privacy                  Privacy and photo-consent information
```

### Storyblok content types

| Content type      | Purpose                                      | Key fields                                                                                                                           |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `page`            | Generic page (Home, About, Contact, Privacy) | `body` (blocks), `seo`                                                                                                               |
| `segment_page`    | Landing page per audience                    | `segment` (option), `hero`, `intro`, `body` (blocks), `packages` (refs), `seo`                                                       |
| `project`         | A shoot or series                            | `title`, `segment` (option), `cover`, `year`, `location`, `intro`, `body` (blocks), `seo`                                            |
| `package`         | A service package                            | `title`, `segment`, `price_from`, `price_unit` (per child / per class / flat), `included[]`, `highlight` flag, `cta`                 |
| `testimonial`     | Reusable quote                               | `quote`, `name`, `role`, `organisation`, `segment`, `portrait`                                                                       |
| `post` (later)    | Journal entry                                | `title`, `date`, `cover`, `body`, `seo`                                                                                              |
| `global_settings` | Site-wide config (single)                    | `site_name`, `logo`, `header_nav`, `footer_nav`, `socials`, `default_seo`, `contact_email`, `phone`, `service_area`, `privacy_blurb` |

Using `package` and `testimonial` as **reusable content types** (rather than nested blocks) lets you reference the same package or quote on several pages and update it in one place.

### Storyblok folder structure

```
/                     → home (page)
/kindergartens        → segment_page
/schools              → segment_page
/weddings             → segment_page
/other-work           → segment_page
/portfolio/           → folder, default type: project
/packages/            → folder (content-only; not routed), type: package
/testimonials/        → folder (content-only), type: testimonial
/journal/             → folder, default type: post
/about, /pricing, /contact, /gallery, /privacy
/settings/global      → global_settings
```

---

## 4. Block inventory

**Hero / intro**

- `hero_fullbleed`: image, headline, subline, CTA, overlay strength, focal point
- `hero_split`: image + text (About, segment pages)
- `segment_chooser`: 3-4 large image cards linking to segment pages (homepage)

**Gallery**

- `gallery_grid`: `images[]`, columns, gap, aspect mode
- `gallery_masonry`: `images[]`, columns
- `gallery_carousel`: `images[]`, autoplay toggle
- `project_grid`: references or "all, filtered by segment", layout variant
- `featured_projects`: curated 3-6 projects

**Editorial**

- `image_full`: image, caption, width (contained / wide / full-bleed)
- `image_pair`: diptych
- `text_image`: image + rich text, left/right

**Business / trust**

- `package_cards`: references to `package` entries, optional comparison layout
- `process_steps`: numbered steps (e.g. Inquiry → Planning → Photo day → Gallery → Delivery)
- `trust_bar`: icons + short statements (GDPR-compliant, consent forms provided, enhanced background check if applicable, fast delivery)
- `testimonials`: references to `testimonial` entries, carousel or grid
- `logo_strip`: institutions already worked with (only with permission)
- `faq`: `faq_item[]` (Radix Accordion)
- `cta_banner`: headline, button, background
- `stats`: e.g. "120+ classes photographed", "48h preview gallery"

**Forms and access**

- `contact_form`: heading, intro, `segments[]`, success message
- `gallery_access`: heading, instructions, input for gallery code (see section 12)

**Content / utility**

- `rich_text`, `quote`, `spacer`

**Nested-only** (not insertable at page level): `image_item` (`asset`, `alt`, `caption`, `featured`), `faq_item`, `nav_link`, `included_item`

### Which blocks each segment page uses

| Segment page  | Typical block order                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Kindergartens | `hero_split` → `trust_bar` → `gallery_masonry` → `process_steps` → `package_cards` → `testimonials` → `faq` → `cta_banner`                     |
| Schools       | `hero_fullbleed` → `stats` → `process_steps` → `gallery_grid` (class/portrait samples) → `package_cards` → `logo_strip` → `faq` → `cta_banner` |
| Weddings      | `hero_fullbleed` → `quote` → `image_pair` / `image_full` (editorial) → `featured_projects` → `package_cards` → `testimonials` → `contact_form` |

---

## 5. Component architecture

```
┌─────────────────────────────────────────┐
│ Layer 3: Storyblok blocks (sections)    │  mapped 1:1 to CMS components
│ HeroFullbleed, PackageCards, …          │
├─────────────────────────────────────────┤
│ Layer 2: Composite / feature components │  reusable, CMS-agnostic
│ PhotoImage, Lightbox, FilterBar,        │
│ SiteHeader, SiteFooter, ContactFormUI   │
├─────────────────────────────────────────┤
│ Layer 1: UI primitives (shadcn/Radix)   │
│ Button, Dialog, Accordion, Tabs, Input  │
└─────────────────────────────────────────┘
```

**Rule:** dependencies flow downward only. Layer 3 translates Storyblok data into props; Layers 1-2 know nothing about Storyblok.

### Radix / shadcn usage

| Need                        | Component                                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Lightbox                    | `Dialog` with full-screen content and keyboard nav                                                                    |
| Mobile menu                 | `Sheet`                                                                                                               |
| Desktop nav                 | Plain links (or `NavigationMenu` if dropdowns are added)                                                              |
| Segment / category filter   | `ToggleGroup` or `Tabs`                                                                                               |
| FAQ                         | `Accordion`                                                                                                           |
| Forms                       | `Form` + `Input`, `Textarea`, `Select`, `RadioGroup`, `Calendar`/`Popover` for date, `Button` (react-hook-form + zod) |
| Package comparison (mobile) | `Tabs`                                                                                                                |
| Gallery access              | `InputOTP` (shadcn) or `Input`                                                                                        |

---

## 6. Folder structure

```
src/
├─ app/
│  ├─ layout.tsx                  # fonts, metadata, motion provider
│  ├─ (site)/
│  │  ├─ layout.tsx               # CMS global settings, header/footer
│  │  ├─ [[...slug]]/page.tsx      # catch-all → fetch story by slug
│  │  └─ gallery/[code]/page.tsx   # protected client gallery (see §12)
│  ├─ (sandbox)/
│  │  ├─ layout.tsx               # fallback header/footer, no CMS fetch
│  │  └─ preview/                 # fixture index and [block] previews
│  ├─ api/
│  │  ├─ draft/route.ts           # Next draft mode for Storyblok preview
│  │  └─ revalidate/route.ts      # Storyblok webhook → revalidateTag
│  ├─ actions/contact.ts          # server action: validate, send mail
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ not-found.tsx
│
├─ components/
│  ├─ ui/                         # shadcn primitives
│  ├─ blocks/                     # LAYER 3, one folder per Storyblok component
│  │  └─ hero-fullbleed/
│  │     ├─ hero-fullbleed.tsx
│  │     └─ hero_fullbleed.json
│  │  ├─ hero-fullbleed.tsx
│  │  ├─ hero-split.tsx
│  │  ├─ segment-chooser.tsx
│  │  ├─ gallery-masonry.tsx
│  │  ├─ package-cards.tsx
│  │  ├─ process-steps.tsx
│  │  ├─ trust-bar.tsx
│  │  ├─ testimonials.tsx
│  │  ├─ faq.tsx
│  │  ├─ contact-form.tsx
│  │  └─ …
│  ├─ pages/                      # page-level content types
│  │  ├─ page.tsx
│  │  ├─ segment-page.tsx
│  │  └─ project-page.tsx
│  ├─ photo/                      # LAYER 2, imagery
│  │  ├─ photo-image.tsx
│  │  ├─ lightbox.tsx             # client
│  │  ├─ masonry.tsx
│  │  └─ filter-bar.tsx           # client
│  ├─ layout/
│  │  ├─ site-header.tsx
│  │  ├─ site-footer.tsx
│  │  └─ mobile-nav.tsx           # client
│  └─ forms/
│     └─ contact-form-ui.tsx      # client
│
├─ lib/
│  ├─ storyblok/
│  │  ├─ client.ts                # init + component registry
│  │  ├─ fetch.ts                 # typed fetchStory, fetchProjects, fetchGlobal
│  │  ├─ image-loader.ts          # custom next/image loader
│  │  ├─ provider.tsx             # client provider for Visual Editor bridge
│  │  └─ types.ts                 # generated from the Storyblok schema
│  ├─ seo.ts                      # metadata + JSON-LD helpers
│  ├─ gallery-auth.ts             # code validation / signed cookie (see §12)
│  └─ utils.ts
│
└─ styles/globals.css             # Tailwind layers, CSS variables / tokens
```

---

## 7. Mapping components to Storyblok

**Registry** (`lib/storyblok/client.ts`). The key must match the Storyblok technical name.

```ts
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import { HeroFullbleed } from "@/components/blocks/hero-fullbleed/hero-fullbleed";
import { PackageCards } from "@/components/blocks/package-cards/package-cards";
import { SegmentPage } from "@/components/pages/segment-page";
// …

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_TOKEN,
  use: [apiPlugin],
  components: {
    hero_fullbleed: HeroFullbleed,
    package_cards: PackageCards,
    // …
    page: Page,
    segment_page: SegmentPage,
    project: ProjectPage,
  },
});
```

**Block pattern** (repeated for every block):

```tsx
import { storyblokEditable } from "@storyblok/react/rsc";

export function GalleryMasonry({ blok }: { blok: GalleryMasonryStoryblok }) {
  return (
    <section {...storyblokEditable(blok)}>
      <Masonry columns={blok.columns}>
        {blok.images.map((img) => (
          <PhotoImage key={img._uid} asset={img.asset} alt={img.alt} />
        ))}
      </Masonry>
    </section>
  );
}
```

**Page renderers** render `body` via `<StoryblokServerComponent blok={b} />`. `segment_page` also resolves referenced `package` and `testimonial` entries (use `resolve_relations` in the fetch).

**Types:** generate with `storyblok-generate-ts` so schema drift is caught at build time.

Component schemas are edited in `components/blocks/<block>/<technical_name>.json`.
Standalone block renderers live directly alongside them; nested-only schemas and
content types use JSON-only folders, with page renderers remaining in `components/pages/`.
`npm run generate:types` bundles those sources into `storyblok-components.json`,
generates types, and updates the schema guide. The combined JSON is generated, not
hand-edited. See README's Storyblok CLI workflow for staged pulls and explicit pushes.

---

## 8. Image strategy

One wrapper, `PhotoImage`, used by every block.

- **Custom loader** using Storyblok's Image Service (`/m/{w}x0/filters:quality(80)`), so Storyblok resizes and Next requests widths.
- **Dimensions from the URL:** parse width/height from the asset URL to avoid layout shift.
- **Focal point:** apply Storyblok's focus field as `object-position`.
- **Blur placeholder:** tiny blurred `blurDataURL` via the image service.
- **`sizes` presets:** `hero`, `grid-3col`, `masonry`, `thumb`, `portrait-card`.
- **`priority`:** only on the first hero image.
- **Alt text:** required on `image_item`. For children's photos, describe the activity, never names.
- **Lightbox:** loads the large variant only on open.

---

## 9. Routing, data fetching, caching

- **Catch-all** `[[...slug]]` fetches `cdn/stories/{slug}` and renders the returned content type.
- **`generateStaticParams`** pre-renders all routed stories via `cdn/links` (exclude `/packages/` and `/testimonials/` folders).
- **Revalidation:** tag fetches (`story:{slug}`, `global`, `projects`, plus `content` on story requests); publish webhook hits `/api/revalidate`. The shared content tag refreshes pages containing referenced entries.
- **Preview:** `version: "draft"` + Next draft mode in the Visual Editor, `"published"` otherwise.
- **Visual Editor bridge:** `StoryblokStory` from `@storyblok/react/rsc`, with the same resolved reference fields as server fetches.
- **References:** resolve `package_cards.packages`, `testimonials.testimonials`, `featured_projects.projects` and `project_grid.projects`; resolve multilinks to URLs.
- **Global settings** fetched in `(site)/layout.tsx`, not the shared root layout.
- **Fixture sandbox:** `/preview` lives in the `(sandbox)` route group and uses fallback navigation without fetching CMS settings. Both groups share the CMS-agnostic `SiteFrame`. The groups do not change public URL paths.

---

## 10. Editor experience checklist

- Restrict allowed blocks per field (e.g. `project.body` excludes `contact_form`).
- Descriptions and defaults on every block.
- Block presets (e.g. "Masonry, 3 columns, 4 images").
- `single-option` fields for layout variants.
- Required: alt text, cover image, SEO title/description.
- Content-type templates so a new `project` or `segment_page` starts pre-structured.
- Preview URLs configured per content type.
- Field-level help text for anything involving children's photos ("Only upload images with documented consent").

---

## 11. Business features

- **SEO:** `generateMetadata` per story, Open Graph from cover, JSON-LD (`LocalBusiness`, `ImageGallery`, `Service`), sitemap. Local SEO matters: target phrases like "kindergarten photographer [city]", "school photography [region]", "wedding photographer [city]".
- **Segment-aware inquiry form:** the first question is "What is this for?" (kindergarten / school / wedding / other), which reveals the relevant fields:
  - Institution: name, number of children/classes, preferred period, contact person
  - Wedding: date, venue, guest count, hours of coverage
  - Delivery: server action → email (Resend) + honeypot or Turnstile.
- **Downloadable info PDF** for institutions (price sheet, process, consent template), linked from segment pages.
- **Analytics:** Plausible or similar, cookie-free.
- **Performance budget:** LCP under 2.5 s on gallery pages.

---

## 12. Privacy and child-safety considerations

Working with kindergartens and schools means handling photos of children, which raises legal and trust requirements. Confirm the specifics for your country with a legal advisor or your data protection authority.

- **Consent:** institutions usually collect parental consent. Provide a consent-form template and make your process clear on the segment pages.
- **No public identification:** never show children's names alongside images; keep alt text and captions anonymous.
- **Public portfolio:** only publish images with documented consent that covers portfolio use (separate from consent for the photo day itself).
- **Parent / client galleries:** not part of the public CMS content.
  - Use a separate private store for delivery (hosted gallery service, or private storage with signed URLs).
  - If built in-house: gallery code → server-side validation → signed, expiring cookie; `noindex`, `Cache-Control: private`, no sitemap entry.
  - Do not put private galleries in Storyblok's public CDN.
- **Retention:** define how long galleries stay online and when originals are deleted; state it on the privacy page.
- **Data processing:** if you hold personal data for institutions, you likely need a data processing agreement template.
- **Privacy page:** plain-language, linked in the footer and on the contact form.

---

## 13. Design draft

### 13.1 Concept

**"Warm, honest, light."** The work should feel natural and unposed. The site is airy and quiet, with warmth that works for both a pre-school and a wedding without being childish or overly formal.

### 13.2 Design tokens

| Token           | Value (starting point)      | Use                         |
| --------------- | --------------------------- | --------------------------- |
| `--bg`          | `#FAF7F2` (warm off-white)  | Page background             |
| `--surface`     | `#FFFFFF`                   | Cards, form                 |
| `--ink`         | `#2B2723` (warm near-black) | Text                        |
| `--muted`       | `#7A7168`                   | Secondary text              |
| `--accent`      | `#C86B4A` (terracotta)      | Buttons, links, highlights  |
| `--accent-soft` | `#F1DDD2`                   | Tags, subtle fills          |
| `--sage`        | `#8A9A83`                   | Kindergarten / calm accents |
| `--line`        | `#E7E0D6`                   | Dividers                    |

Segment accents can subtly shift the page: **sage** for kindergartens, **terracotta** for schools, **dusty rose / champagne** for weddings. Implement as a `data-segment` attribute on the page wrapper that swaps the `--accent` variable.

**Typography**

- Headings: a soft serif (e.g. _Fraunces_, _Cormorant Garamond_, or _Playfair Display_), light weight, large.
- Body/UI: a clean sans (e.g. _Inter_ or _DM Sans_).
- Scale: 56-72 px hero, 36 px section headings, 18 px body on desktop.

**Shape and motion**

- Radii: 12-16 px on cards and buttons (friendly, not sharp).
- Images: mostly square-cornered or very slightly rounded; consistency matters.
- Motion: gentle fades and 200-300 ms transitions only. Respect `prefers-reduced-motion`.

**Layout**

- 12-column grid, max width ~1280 px, galleries may break out to full width.
- Mobile first (parents browse on phones); tap targets at least 44 px.

### 13.3 Global layout

**Header:** logo (left) · Kindergartens · Schools · Weddings · Portfolio · About · **[Get in touch]** (button). Sticky and transparent over hero images, solid after scroll. Mobile uses a `Sheet`.

**Footer:** short intro, segment links, contact details, social, privacy link, service area, copyright.

### 13.4 Home page wireframe

```
┌──────────────────────────────────────────────────────────┐
│ LOGO        Kindergartens Schools Weddings  About  [Contact]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│                 FULL-BLEED HERO IMAGE                    │
│        "Moments that feel like you."                     │
│   Photography for kindergartens, schools & weddings      │
│            [See my work]   [Get in touch]                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  WHO ARE YOU PHOTOGRAPHED FOR?                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │ Kindergarten│ │  Schools   │ │  Weddings  │            │
│  │   [image]   │ │  [image]   │ │  [image]   │            │
│  │  Learn more→│ │ Learn more→│ │ Learn more→│            │
│  └────────────┘ └────────────┘ └────────────┘            │
├──────────────────────────────────────────────────────────┤
│  SELECTED WORK  (masonry, 6-9 images, opens lightbox)    │
│                         [View full portfolio →]          │
├──────────────────────────────────────────────────────────┤
│  HOW IT WORKS   ① Inquiry ② Plan ③ Photo day ④ Gallery   │
├──────────────────────────────────────────────────────────┤
│  "Testimonial quote…"  Name, Role, Organisation          │
├──────────────────────────────────────────────────────────┤
│  ABOUT TEASER   [portrait]  Short story + [Meet me →]    │
├──────────────────────────────────────────────────────────┤
│  CTA BANNER: "Planning a photo day or a wedding?"        │
│                    [Send an inquiry]                     │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                  │
└──────────────────────────────────────────────────────────┘
```

### 13.5 Kindergarten page wireframe

Tone: warm, reassuring, playful but professional.

```
HERO SPLIT   [text left]                [photo right: child mid-play]
  "Natural photos of children, taken on their terms."
  Short subline · [Request a photo day] · [Download info sheet]

TRUST BAR    ✓ Consent forms provided  ✓ Calm, child-led approach
             ✓ GDPR-conscious process  ✓ Gallery for parents in 48h

GALLERY      Masonry of candid moments (play, portraits, groups)

PROCESS      ① Talk  ② Consent & plan  ③ Photo day  ④ Parent gallery  ⑤ Delivery

PACKAGES     [Basic]   [Standard ★]   [Extended]
             per child / per group, "from X kr."

TESTIMONIAL  Director quote + institution name

FAQ          "How do you handle children who don't want to be photographed?"
             "What about consent?" "How long does delivery take?"

CTA          [Request a photo day]
```

### 13.6 School page wireframe

Tone: efficient, organised, reliable.

```
HERO         Class group photo, "School photography without the stress."
STATS        120+ classes · 48h preview · One school day
PROCESS      Timeline with logistics (setup, schedule per class, delivery)
SAMPLES      Grid: class photo, portrait, siblings, graduation
PACKAGES     Per pupil / per class; optional fundraising share for parent council
LOGO STRIP   Schools worked with
FAQ          Re-takes, absent pupils, ordering, payment
CTA          [Book a school day]
```

### 13.7 Wedding page wireframe

Tone: romantic, editorial, spacious.

```
HERO         Full-bleed couple image, large serif headline
QUOTE        Short personal statement
EDITORIAL    Alternating image_full / image_pair / text_image
FEATURED     3 weddings as cards → project pages (full story galleries)
PACKAGES     Coverage options (half day / full day / weekend) + add-ons
TESTIMONIALS Couples with a photo
FORM         Inquiry with date, venue, guest count
```

### 13.8 Portfolio page

- Filter bar: **All · Kindergartens · Schools · Weddings · Other** (ToggleGroup, URL-synced via query param).
- Project grid with cover, title, small meta (year, location).
- Project detail: title/intro, then block body (galleries, editorial); "Next project" link at the bottom.

### 13.9 Contact page

- Left: short friendly text, response-time promise, direct email/phone, service area.
- Right: segment-aware form (see §11). After submit: clear confirmation and what happens next.

### 13.10 Accessibility

- Contrast of at least 4.5:1 for text (check terracotta on off-white).
- Full keyboard support in lightbox, filter bar, forms (Radix gives most of this).
- Visible focus rings; descriptive alt text; `prefers-reduced-motion` respected.

---

## 14. Build phases

1. **Foundation:** Next, Tailwind, shadcn, Storyblok connection, bridge, `PhotoImage` + loader, layout, global settings, design tokens.
2. **Core pages:** `page`, `segment_page`, `project` types; hero, rich text, image blocks, `gallery_grid`, `project_grid`, `segment_chooser`.
3. **Gallery experience:** masonry, lightbox, portfolio filtering.
4. **Business layer:** `package`, `testimonial`, `process_steps`, `trust_bar`, `faq`, `cta_banner`, segment-aware contact form.
5. **Privacy and delivery:** privacy page, consent info, decide parent-gallery approach (§12).
6. **Polish:** SEO + JSON-LD, local SEO, revalidation webhook, accessibility audit, performance tuning.
7. **Optional:** journal, newsletter, proofing/ordering for school photos.

---

## 15. Open questions

1. Country/language of the site (single language, or multilingual via Storyblok field-level translation)?
2. Parent galleries: build in-house, or use a dedicated gallery/delivery service?
3. Do you want online ordering/payment for school photos, or inquiry-only?
4. Do you have enough consented portfolio images per segment to launch with?
5. Brand name, logo, and preferred tone (more playful vs. more editorial)?
6. Hosting target (Vercel, other) and the email provider for inquiries.
