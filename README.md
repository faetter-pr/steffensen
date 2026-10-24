# Steffensen Foto

Photography portfolio for kindergartens, schools and weddings.
Next.js App Router · TypeScript · Tailwind v4 · shadcn/ui (Radix) · Storyblok.

- **Full specification:** [docs/architecture.md](docs/architecture.md)
- **Working rules and setup decisions:** [CLAUDE.md](CLAUDE.md)

## Getting started

Requires **Node 24** — `.nvmrc` pins it, and the shadcn CLI and ESLint both need
newer than the Node 20.11 that may be your nvm default.

```bash
nvm use
npm install
npm run dev
```

The app runs without a Storyblok connection. `/` renders a setup notice instead of
content until `STORYBLOK_TOKEN` is set — see [.env.example](.env.example).

## Design sandbox

**[localhost:3000/preview](http://localhost:3000/preview)** renders blocks from
[src/mock/fixtures.json](src/mock/fixtures.json) with no CMS connection, so components can
be designed and reviewed before Storyblok exists. Dev only — it 404s in production.

Fixture images use `placeholder://WIDTHxHEIGHT`, which renders as a coloured box at that
aspect ratio. No image files needed. See [CLAUDE.md](CLAUDE.md) for how to add a block.

The sandbox uses a separate route-group layout with fallback navigation and no
global-settings fetch. It stays usable even when a configured CMS token is invalid.
Normal application routes never import the fixture data.

## Live Storyblok content

The React blocks serve both data sources. Normal URLs fetch Storyblok stories;
`/preview` and `/preview/<technical_name>` render local fixtures (development only).
The Storyblok `component` name selects a renderer from
[`src/lib/storyblok/client.ts`](src/lib/storyblok/client.ts), and page renderers pass
each entry in `body` to that registry. There is no fixture fallback on live pages.

### Connect the space and create content

1. Push the schemas using the [CLI workflow](#storyblok-cli).
2. Set `STORYBLOK_TOKEN` to a **Preview Content Delivery API token** from your
   space's access-token settings and set the matching `STORYBLOK_REGION` in
   `.env.local` (or your existing `.env`). This is separate from CLI authentication.
3. Create a root-level story with slug **`home`**, using content type **`page`**.
   Add blocks to its **`body`** field, populate their fields, and publish it.
   The app maps `/` to `home`; a schema upload alone creates no stories.
4. Optionally create a `settings` folder and a **`global`** story inside it using
   **`global_settings`**. Fill in site name, navigation and contact details, then
   publish it. The live site reads `settings/global`; otherwise it uses fallback
   navigation. This story is not a public page.
5. Create other public stories using `page`, `segment_page` or `project`, then
   publish them. Their full slugs map to application URLs, e.g. `weddings` maps
   to `/weddings`. Content-only stories belong under `packages/`,
   `testimonials/` and `settings/`.
6. Restart `npm run dev` after changing environment values.

Normal visits request **published** content, even when using a Preview token.
An unpublished `home` story therefore gives a 404 rather than mock content.
An invalid token or CMS outage surfaces an error instead of silently showing fixtures.

Live fetches resolve `package_cards.packages`, `testimonials.testimonials`,
`featured_projects.projects` and `project_grid.projects`, so selected story references
arrive as objects rather than UUIDs. The Visual Editor bridge uses the same reference
configuration. Linked story URLs are also resolved.

### Preview unpublished CMS content

This is separate from the fixture sandbox:

1. Set `STORYBLOK_PREVIEW_SECRET` to a random secret and restart the dev server.
2. Open `/api/draft?secret=<your-secret>&slug=home` on the running app to enable
   draft mode and redirect to that story. For other stories, use their full slug.
   Subsequent requests in that browser session use uncached draft content.
3. For Storyblok's Visual Editor, configure its preview URL to enter through
   `/api/draft?secret=<your-secret>&slug=` with the current story slug appended.
   Use an HTTPS development origin trusted by your browser or a deployed preview
   environment, and point `NEXT_PUBLIC_SITE_URL` at the appropriate site origin.

Treat the preview secret as a credential; do not commit it or share preview URLs.
The fixture `/preview` pages remain development-only and do not enable draft mode.

### Refresh published content

Set `STORYBLOK_WEBHOOK_SECRET` and configure published/unpublished story events to
POST to `https://<your-site>/api/revalidate?secret=<your-secret>`.
All story fetches carry a shared content tag so publishing a referenced package,
testimonial or project also invalidates pages that embed it. Revalidation uses
Next.js's `max` profile (stale-while-revalidate), so a request may receive stale
content while the next version is refreshed.

## Scripts

| Script                           | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| `npm run dev`                    | Dev server                                               |
| `npm run build`                  | Production build (must pass with no Storyblok token)     |
| `npm run lint`                   | ESLint, including the enforced architecture rules        |
| `npm run typecheck`              | `tsc --noEmit`                                           |
| `npm run format`                 | Prettier, with Tailwind class sorting                    |
| `npm run schema:bundle`          | Per-block JSON → combined Storyblok schema               |
| `npm run generate:types`         | Local Storyblok schema → TypeScript and schema docs      |
| `npm run storyblok:login`        | Authenticate the project-local CLI                       |
| `npm run storyblok:pull`         | Stage remote components without overwriting local schema |
| `npm run storyblok:import`       | Import staged components and regenerate types/docs       |
| `npm run storyblok:push:dry-run` | Read-only comparison with the remote schema              |
| `npm run storyblok:push`         | Explicitly push the local component schema               |
| `npm run test:storyblok`         | CLI workflow tests (no credentials or network)           |

## Storyblok CLI

The CLI is a pinned development dependency; no global install is needed. Run all
commands with Node 24 (`nvm use`). It is not used by the app or production build.

### Configure and authenticate

Add these values to `.env.local`:

```dotenv
STORYBLOK_SPACE_ID=123456
STORYBLOK_REGION=eu
```

Replace the example ID with your space ID from Storyblok Space Settings.
The npm commands load `.env.local`, then `.env`, without overriding existing shell
variables. These local values also feed `storyblok.config.mjs`.

```bash
npm run storyblok:login
```

Follow the CLI prompts to authenticate with a **personal access token**. This is a
Management API credential, not the Content Delivery API `STORYBLOK_TOKEN` used by
the website. Let the CLI store authentication locally; never commit credentials or
put them in the configuration file.

### First upload or local schema changes

Edit schemas in `src/components/blocks/<block>/<technical_name>.json`.
These files are the source of truth. `storyblok-components.json` is their generated
bundle, used by type generation and converted into the arrays expected by CLI v4.
The wrapper uses separate remote and push staging directories.

```bash
npm run generate:types
npm run storyblok:push:dry-run
# Review the reported field changes and confirm the target space ID.
npm run storyblok:push
```

The preview pulls fresh remote data and prints creates/updates, including before
and after values. It makes **no remote writes**. CLI v4.25.0 has no native component
push dry-run, so this is a schema comparison, not a simulation of server
normalization or every CLI dependency operation.

Push pulls fresh metadata before staging the local components, retaining existing
groups, tags and presets for those components. Remote-only components are not
deleted. Schema updates can still remove fields or change field types: review the
preview and take a space backup before potentially destructive changes. There is
no automatic push during development, installation, generation or builds.

### Changes made in Storyblok

```bash
npm run storyblok:pull
# Review .storyblok/remote/components/<space-id>/components.json.
npm run storyblok:import
npm run typecheck
```

Pull never overwrites the per-block source files. Import explicitly updates those
files, preserves project notes, excludes response-only component metadata,
and regenerates TypeScript and this project's schema guide. Empty, malformed,
duplicate, or incomplete component snapshots are rejected; an import that would
remove local components requires resolving that mismatch manually first.

Review changes to the per-block JSON, `storyblok-components.json`,
`src/lib/storyblok/generated.d.ts` and `docs/storyblok-schema.md` together.
Generated files should not be edited by
hand. The existing `storyblok-generate-ts` generator and type adapter are unchanged.

All CLI staging files, logs and reports under `.storyblok/` are ignored by Git,
ESLint and Prettier. Story content, assets, migrations and CI deployment are outside
this workflow. Authenticated pull/preview checks require a real space; the local
tests do not.

## Layout

```
src/
├─ app/                  routes, API handlers, sitemap/robots
├─ components/
│  ├─ ui/                layer 1 — shadcn primitives (lint-ignored, vendored)
│  ├─ photo/             layer 2 — PhotoImage; all imagery goes through it
│  ├─ layout/            layer 2 — header, footer, mobile nav
│  ├─ blocks/            layer 3 — one folder per Storyblok component
│  │  └─ hero-fullbleed/
│  │     ├─ hero-fullbleed.tsx
│  │     └─ hero_fullbleed.json
│  └─ pages/             layer 3 — content-type renderers
├─ lib/storyblok/        client + registry, fetch, image service, types
└─ styles/globals.css    design tokens (§13.2)
```

Dependencies flow downward only: layers 1–2 never import from Storyblok. ESLint enforces
this — see [CLAUDE.md](CLAUDE.md) for which rules are machine-checked and the one
documented exception.

All 39 Storyblok schemas have a folder under `blocks/`. The 24 standalone block
renderers have their React file alongside the JSON; nested-only schemas and content types have
JSON-only folders. Content-type React renderers remain in `components/pages/`.
Folder and React filenames use kebab-case; JSON filenames and registry keys use
the exact Storyblok technical name.

To add a block, add its JSON schema in that structure, add its React component
alongside it, register the component in `src/lib/storyblok/client.ts`, add preview
fixtures, then run `npm run generate:types`. `npm run docs:schema` also rebuilds
the combined schema before generating the guide.

The CLI reads generated arrays from `.storyblok/push/`, not these source folders,
so colocating React and JSON files does not change the push workflow.

## Status

Build phase 1 (foundation) of the seven in architecture.md §14. Phases 2–7 — the block
library, gallery experience, business layer, privacy/delivery and polish — are not started.
