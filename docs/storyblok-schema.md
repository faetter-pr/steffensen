# Storyblok schema

> **Generated file — do not edit.**
> Source: per-block JSON files in [`src/components/blocks/`](../src/components/blocks/),
> bundled into [`storyblok-components.json`](../storyblok-components.json).
> Regenerate with `npm run docs:schema`.

A build guide for creating these components in the Storyblok GUI. Component names and
field keys must match **exactly** — the React registry in `src/lib/storyblok/client.ts`
and the generated types both key off them.

## Faster alternative

Use the project-local Storyblok CLI. Set `STORYBLOK_SPACE_ID` and `STORYBLOK_REGION`
in `.env.local`, then authenticate with a personal access token (not `STORYBLOK_TOKEN`).
See [README.md](../README.md#storyblok-cli) for the complete workflow.

```bash
npm run storyblok:login
npm run storyblok:push:dry-run
npm run storyblok:push
```

Pull remote changes into staging, review them, then explicitly import and regenerate:

```bash
npm run storyblok:pull
# Review .storyblok/remote/components/<space-id>/components.json first.
npm run storyblok:import
```

Pull never overwrites the per-block JSON sources. Import preserves project notes and refuses
to remove local components. The preview is a read-only schema comparison, not a native
CLI dry-run. Push preserves existing presets, groups and tags.

## Setup order

Storyblok will not let a block reference a component that does not exist yet, so
create them in this order:

1. **Nestable blocks** below (they are referenced by the page-level ones)
2. **Page-level blocks**
3. **Content types**
4. Create the folders from architecture.md §3: `/portfolio/`, `/packages/`,
   `/testimonials/`, `/settings/`
5. Set each folder's default content type, and mark `/packages/` and `/testimonials/`
   as content-only (they are excluded from routing and the sitemap)

## Editor guardrails (architecture.md §10)

- Alt text is required on every image field. Field descriptions say so; keep them.
- Add help text on anything involving children's photos:
  _"Only upload images with documented consent."_
- Restrict allowed blocks per field using the `allows:` column below.
- Set preview URLs per content type so the Visual Editor resolves.

## Nestable blocks (33)

Insertable inside other blocks. Several are nested-only — they are never added at
page level, only inside their parent.

### `contact_form`

**Contact form** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `heading` | Text | — |
| `intro` | Textarea | — |
| `segments` | Multi-Options | values: `kindergartens`, `schools`, `weddings`, `other` |
| `success_message` | Textarea | — |

### `cta_banner`

**CTA banner** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | **required** |
| `text` | Textarea | — |
| `cta_label` | Text | — |
| `cta_link` | Link | — |
| `background` | Single-Option | values: `soft`, `accent`, `ink`<br>default `soft` |
| `variant` | Single-Option | values: `minimal`, `filled`<br>default `minimal` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `faq_item`

**FAQ item** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `question` | Text | **required** |
| `answer` | Richtext | **required** |

### `faq`

**FAQ** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `items` | Blocks | allows: `faq_item` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `featured_projects`

**Featured projects** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `intro` | Textarea | — |
| `projects` | Multi-Options | source: `internal_stories`<br>folder: `portfolio/` |
| `cta_label` | Text | — |
| `cta_link` | Link | — |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `gallery_access`

**Gallery access** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `heading` | Text | — |
| `instructions` | Textarea | — |
| `button_label` | Text | — |

### `gallery_carousel`

**Gallery (carousel)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `images` | Blocks | allows: `image_item` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `gallery_grid`

**Gallery (grid)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `images` | Blocks | allows: `image_item` |
| `columns` | Single-Option | values: `2`, `3`, `4`<br>default `3` |
| `gap` | Single-Option | values: `none`, `frame`, `loose`<br>default `frame` |
| `aspect` | Single-Option | values: `square`, `portrait`, `landscape`, `original`<br>default `square` |
| `variant` | Single-Option | values: `contained`, `edge-to-edge`, `strip-3`<br>default `contained` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `gallery_masonry`

**Gallery (masonry)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `images` | Blocks | allows: `image_item` |
| `columns` | Single-Option | values: `2`, `3`, `4`<br>default `3` |
| `gap` | Single-Option | values: `none`, `frame`, `loose`<br>default `frame` |
| `edge_to_edge` | Boolean | — |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `hero_fullbleed`

**Hero (full-bleed)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `image` | Asset | **required**<br>filetypes: images |
| `image_alt` | Text | **required**<br>Describe the scene. Never a child's name. |
| `headline` | Text | — |
| `subline` | Textarea | — |
| `cta_label` | Text | — |
| `cta_link` | Link | — |
| `overlay_strength` | Single-Option | values: `none`, `light`, `medium`, `strong`<br>default `medium`<br>Darkens the photo behind text. Bright photos may still fail contrast — check the result. |
| `text_tone` | Single-Option | values: `light`, `dark`<br>default `light`<br>Light text suits dark photos; dark text suits pale ones. |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `hero_split`

**Hero (split)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `image` | Asset | **required**<br>filetypes: images |
| `image_alt` | Text | **required** |
| `headline` | Text | — |
| `subline` | Textarea | — |
| `cta_label` | Text | — |
| `cta_link` | Link | — |
| `secondary_cta_label` | Text | — |
| `secondary_cta_link` | Link | — |
| `image_side` | Single-Option | values: `right`, `left`<br>default `right` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `image_full`

**Image (full)** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `image` | Asset | **required**<br>filetypes: images |
| `image_alt` | Text | **required** |
| `caption` | Text | — |
| `width` | Single-Option | values: `contained`, `wide`, `full`<br>default `full` |
| `aspect` | Single-Option | values: `auto`, `3-2`, `16-9`, `4-5`<br>default `auto` |
| `max_height` | Single-Option | values: `none`, `70svh`, `90svh`<br>default `none` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `image_item`

**Image** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `asset` | Asset | **required**<br>filetypes: images<br>Only upload images with documented consent. |
| `alt` | Text | **required**<br>Describe the activity or scene. Never a child's name. |
| `caption` | Text | — |
| `featured` | Boolean | — |
| `aspect` | Single-Option | values: `auto`, `3-2`, `16-9`, `4-5`<br>default `auto` |

### `image_pair`

**Image pair** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `images` | Blocks | allows: `image_item`<br>max 2 |
| `caption` | Text | — |
| `variant` | Single-Option | values: `equal`, `asymmetric`, `asymmetric-mirrored`<br>default `equal` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `included_item`

**Included item** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `text` | Text | **required** |

### `logo_strip`

**Logo strip** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `logos` | Blocks | allows: `image_item`<br>Only add logos you have written permission to display. |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `nav_link`

**Nav link** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `label` | Text | **required** |
| `link` | Link | **required** |

### `package_cards`

**Package cards** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `intro` | Textarea | — |
| `packages` | Multi-Options | source: `internal_stories`<br>folder: `packages/` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `process_step`

**Process step** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | **required** |
| `description` | Textarea | — |

### `process_steps`

**Process steps** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `steps` | Blocks | allows: `process_step` |
| `variant` | Single-Option | values: `line`, `numbered`<br>default `line` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `project_grid`

**Project grid** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `segment` | Single-Option | values: ``, `kindergartens`, `schools`, `weddings`, `other` |
| `projects` | Multi-Options | source: `internal_stories`<br>folder: `portfolio/`<br>Leave empty to show all projects, optionally filtered by segment. |
| `show_filter` | Boolean | — |
| `layout` | Single-Option | values: `grid`, `wide`<br>default `grid` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `quote`

**Quote** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `text` | Textarea | **required** |
| `attribution` | Text | — |
| `variant` | Single-Option | values: `plain`, `over-image`<br>default `plain` |
| `image` | Asset | filetypes: images<br>Only used by the 'Over image' variant. |
| `image_alt` | Text | — |
| `overlay_strength` | Single-Option | values: `none`, `light`, `medium`, `strong`<br>default `medium`<br>Darkens the photo behind text. Bright photos may still fail contrast — check the result. |
| `text_tone` | Single-Option | values: `light`, `dark`<br>default `light`<br>Light text suits dark photos; dark text suits pale ones. |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `rich_text`

**Rich text** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `text` | Richtext | — |
| `width` | Single-Option | values: `contained`, `wide`<br>default `contained` |

### `segment_card`

**Segment card** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `label` | Text | **required** |
| `image` | Asset | **required**<br>filetypes: images |
| `image_alt` | Text | **required** |
| `link` | Link | **required** |
| `segment` | Single-Option | values: `kindergartens`, `schools`, `weddings`, `other` |
| `overlay_strength` | Single-Option | values: `none`, `light`, `medium`, `strong`<br>default `medium`<br>Darkens the photo behind text. Bright photos may still fail contrast — check the result. |
| `text_tone` | Single-Option | values: `light`, `dark`<br>default `light`<br>Light text suits dark photos; dark text suits pale ones. |

### `segment_chooser`

**Segment chooser** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `items` | Blocks | allows: `segment_card` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `seo`

**SEO** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | — |
| `description` | Textarea | — |
| `og_image` | Text | — |
| `og_title` | Text | — |
| `og_description` | Textarea | — |
| `twitter_image` | Text | — |
| `twitter_title` | Text | — |
| `twitter_description` | Textarea | — |

### `spacer`

**Spacer** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `size` | Single-Option | values: `small`, `medium`, `large`<br>default `medium` |

### `stat_item`

**Stat** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `value` | Text | **required** |
| `label` | Text | **required** |

### `stats`

**Stats** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `items` | Blocks | allows: `stat_item` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `testimonials`

**Testimonials** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `headline` | Text | — |
| `testimonials` | Multi-Options | source: `internal_stories`<br>folder: `testimonials/` |
| `layout` | Single-Option | values: `grid`, `single`<br>default `grid` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `text_image`

**Text + image** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `image` | Asset | **required**<br>filetypes: images |
| `image_alt` | Text | **required** |
| `headline` | Text | — |
| `text` | Richtext | — |
| `cta_label` | Text | — |
| `cta_link` | Link | — |
| `image_side` | Single-Option | values: `left`, `right`<br>default `left` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `trust_bar`

**Trust bar** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `items` | Blocks | allows: `trust_item` |
| `motion` | Single-Option | values: `default`, `none`<br>default `default`<br>Switch animation off for this block. |

### `trust_item`

**Trust item** · Nestable block

| Field | Type | Notes |
| --- | --- | --- |
| `text` | Text | **required** |
| `icon` | Single-Option | values: `check`, `shield`, `clock`, `camera`, `heart`, `users`<br>default `check` |

## Content types (6)

### `global_settings`

**Global settings** · Content type (not routed)

| Field | Type | Notes |
| --- | --- | --- |
| `site_name` | Text | — |
| `logo` | Asset | filetypes: images |
| `header_nav` | Blocks | allows: `nav_link` |
| `footer_nav` | Blocks | allows: `nav_link` |
| `socials` | Blocks | allows: `nav_link` |
| `default_seo` | Blocks | allows: `seo`<br>max 1 |
| `contact_email` | Text | — |
| `phone` | Text | — |
| `service_area` | Text | — |
| `privacy_blurb` | Textarea | — |

### `package`

**Package** · Content type (not routed)

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | **required** |
| `segment` | Single-Option | values: `kindergartens`, `schools`, `weddings`, `other` |
| `description` | Textarea | — |
| `price_from` | Text | — |
| `price_unit` | Single-Option | values: `per_child`, `per_class`, `flat` |
| `included` | Blocks | allows: `included_item` |
| `highlight` | Boolean | — |
| `cta_label` | Text | — |
| `cta_link` | Link | — |

### `page`

**Page** · Content type

| Field | Type | Notes |
| --- | --- | --- |
| `body` | Blocks | — |
| `seo` | Blocks | allows: `seo`<br>max 1 |

### `project`

**Project** · Content type

| Field | Type | Notes |
| --- | --- | --- |
| `title` | Text | **required** |
| `segment` | Single-Option | values: `kindergartens`, `schools`, `weddings`, `other` |
| `cover` | Asset | **required**<br>filetypes: images |
| `cover_alt` | Text | **required** |
| `year` | Text | — |
| `location` | Text | — |
| `intro` | Richtext | — |
| `body` | Blocks | — |
| `seo` | Blocks | allows: `seo`<br>max 1 |

### `segment_page`

**Segment page** · Content type

| Field | Type | Notes |
| --- | --- | --- |
| `segment` | Single-Option | **required**<br>values: `kindergartens`, `schools`, `weddings`, `other` |
| `body` | Blocks | — |
| `seo` | Blocks | allows: `seo`<br>max 1 |

### `testimonial`

**Testimonial** · Content type (not routed)

| Field | Type | Notes |
| --- | --- | --- |
| `quote` | Textarea | **required** |
| `name` | Text | — |
| `role` | Text | — |
| `organisation` | Text | — |
| `segment` | Single-Option | values: `kindergartens`, `schools`, `weddings`, `other` |
| `portrait` | Asset | filetypes: images |
| `portrait_alt` | Text | — |

## Field-name notes

- `image_full.width` — the editorial brief calls this `layout`; architecture.md §4
  calls it `width` and spec names win.
- `motion` — present on every full-width block so an editor can switch animation off
  for one block without touching the rest of the page.
- `overlay_strength` maps to fixed opacities: none 0, light 0.15, medium 0.3,
  strong 0.5. Bright photographs can still fail 4.5:1 contrast behind light text —
  check each one.
- Reference fields (`packages`, `testimonials`, `projects`) return uuid strings unless
  the fetch passes `resolve_relations`. The blocks render nothing if unresolved.
