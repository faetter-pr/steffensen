#!/usr/bin/env node
/**
 * Generates docs/storyblok-schema.md from storyblok-components.json.
 *
 * The doc is a build guide for creating these components by hand in the Storyblok GUI.
 * It is GENERATED so it cannot drift from the schema the app actually types against —
 * re-run `npm run docs:schema` after editing the per-block JSON sources.
 */

import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "storyblok-components.json";
const TARGET = "docs/storyblok-schema.md";

/** Storyblok's own field-type names, as they appear in the GUI "Type" dropdown. */
const FIELD_TYPE_LABEL = {
  text: "Text",
  textarea: "Textarea",
  richtext: "Richtext",
  markdown: "Markdown",
  number: "Number",
  datetime: "Date/Time",
  boolean: "Boolean",
  option: "Single-Option",
  options: "Multi-Options",
  asset: "Asset",
  multiasset: "Multi-Assets",
  multilink: "Link",
  bloks: "Blocks",
  table: "Table",
  section: "Group",
  custom: "Plugin",
};

const json = JSON.parse(readFileSync(SOURCE, "utf8"));
const components = json.components ?? [];

const nestable = components.filter((c) => c.is_nestable && !c.is_root);
const roots = components.filter((c) => c.is_root);

function describeField(key, field) {
  const type = FIELD_TYPE_LABEL[field.type] ?? field.type;
  const bits = [];

  if (field.required) bits.push("**required**");

  if (field.options?.length) {
    const values = field.options.map((o) => `\`${o.value}\``).join(", ");
    bits.push(`values: ${values}`);
  }
  if (field.default_value !== undefined && field.default_value !== "") {
    bits.push(`default \`${field.default_value}\``);
  }
  if (field.component_whitelist?.length) {
    bits.push(`allows: ${field.component_whitelist.map((c) => `\`${c}\``).join(", ")}`);
  }
  if (field.maximum) bits.push(`max ${field.maximum}`);
  if (field.filetypes?.length) bits.push(`filetypes: ${field.filetypes.join(", ")}`);
  if (field.source) bits.push(`source: \`${field.source}\``);
  if (field.folder_slug) bits.push(`folder: \`${field.folder_slug}\``);
  if (field.description) bits.push(field.description);

  return `| \`${key}\` | ${type} | ${bits.join("<br>") || "—"} |`;
}

function renderComponent(component) {
  const entries = Object.entries(component.schema ?? {}).sort(
    (a, b) => (a[1].pos ?? 0) - (b[1].pos ?? 0),
  );

  const kind = component.is_root
    ? component.name === "global_settings" ||
      component.name === "package" ||
      component.name === "testimonial"
      ? "Content type (not routed)"
      : "Content type"
    : "Nestable block";

  return [
    `### \`${component.name}\``,
    "",
    `**${component.display_name ?? component.name}** · ${kind}`,
    "",
    "| Field | Type | Notes |",
    "| --- | --- | --- |",
    ...entries.map(([key, field]) => describeField(key, field)),
    "",
  ].join("\n");
}

const out = [
  "# Storyblok schema",
  "",
  "> **Generated file — do not edit.**",
  "> Source: per-block JSON files in [`src/components/blocks/`](../src/components/blocks/),",
  "> bundled into [`storyblok-components.json`](../storyblok-components.json).",
  "> Regenerate with `npm run docs:schema`.",
  "",
  "A build guide for creating these components in the Storyblok GUI. Component names and",
  "field keys must match **exactly** — the React registry in `src/lib/storyblok/client.ts`",
  "and the generated types both key off them.",
  "",
  "## Faster alternative",
  "",
  "Use the project-local Storyblok CLI. Set `STORYBLOK_SPACE_ID` and `STORYBLOK_REGION`",
  "in `.env.local`, then authenticate with a personal access token (not `STORYBLOK_TOKEN`).",
  "See [README.md](../README.md#storyblok-cli) for the complete workflow.",
  "",
  "```bash",
  "npm run storyblok:login",
  "npm run storyblok:push:dry-run",
  "npm run storyblok:push",
  "```",
  "",
  "Pull remote changes into staging, review them, then explicitly import and regenerate:",
  "",
  "```bash",
  "npm run storyblok:pull",
  "# Review .storyblok/remote/components/<space-id>/components.json first.",
  "npm run storyblok:import",
  "```",
  "",
  "Pull never overwrites the per-block JSON sources. Import preserves project notes and refuses",
  "to remove local components. The preview is a read-only schema comparison, not a native",
  "CLI dry-run. Push preserves existing presets, groups and tags.",
  "",
  "## Setup order",
  "",
  "Storyblok will not let a block reference a component that does not exist yet, so",
  "create them in this order:",
  "",
  "1. **Nestable blocks** below (they are referenced by the page-level ones)",
  "2. **Page-level blocks**",
  "3. **Content types**",
  "4. Create the folders from architecture.md §3: `/portfolio/`, `/packages/`,",
  "   `/testimonials/`, `/settings/`",
  "5. Set each folder's default content type, and mark `/packages/` and `/testimonials/`",
  "   as content-only (they are excluded from routing and the sitemap)",
  "",
  "## Editor guardrails (architecture.md §10)",
  "",
  "- Alt text is required on every image field. Field descriptions say so; keep them.",
  "- Add help text on anything involving children's photos:",
  '  _"Only upload images with documented consent."_',
  "- Restrict allowed blocks per field using the `allows:` column below.",
  "- Set preview URLs per content type so the Visual Editor resolves.",
  "",
  `## Nestable blocks (${nestable.length})`,
  "",
  "Insertable inside other blocks. Several are nested-only — they are never added at",
  "page level, only inside their parent.",
  "",
  ...nestable.map(renderComponent),
  `## Content types (${roots.length})`,
  "",
  ...roots.map(renderComponent),
  "## Field-name notes",
  "",
  "- `image_full.width` — the editorial brief calls this `layout`; architecture.md §4",
  "  calls it `width` and spec names win.",
  "- `motion` — present on every full-width block so an editor can switch animation off",
  "  for one block without touching the rest of the page.",
  "- `overlay_strength` maps to fixed opacities: none 0, light 0.15, medium 0.3,",
  "  strong 0.5. Bright photographs can still fail 4.5:1 contrast behind light text —",
  "  check each one.",
  "- Reference fields (`packages`, `testimonials`, `projects`) return uuid strings unless",
  "  the fetch passes `resolve_relations`. The blocks render nothing if unresolved.",
  "",
].join("\n");

writeFileSync(TARGET, out);
console.log(
  `Wrote ${TARGET} — ${components.length} components (${nestable.length} nestable, ${roots.length} content types)`,
);
