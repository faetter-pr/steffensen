import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  bundleSchema,
  componentSourcePath,
  readComponentSources,
  writeComponentSources,
} from "./storyblok-schema.mjs";
import {
  compareComponents,
  importSnapshot,
  preparePush,
  readSettings,
  validateComponents,
} from "./storyblok.mjs";

const hero = {
  name: "hero",
  is_root: false,
  is_nestable: true,
  schema: { title: { type: "text" } },
};
const emptyMetadata = { groups: [], presets: [], tags: [] };

test("settings require a valid space and region, except space is optional for login", () => {
  assert.deepEqual(readSettings({ STORYBLOK_SPACE_ID: "123" }), { space: "123", region: "eu" });
  assert.equal(readSettings({}, false).space, undefined);
  for (const space of [undefined, "", "0", "-1", "123/../other", "1.5"]) {
    assert.throws(() => readSettings({ STORYBLOK_SPACE_ID: space }), /positive integer/);
  }
  assert.throws(
    () => readSettings({ STORYBLOK_SPACE_ID: "123", STORYBLOK_REGION: "invalid" }),
    /STORYBLOK_REGION/,
  );
});

test("schema validation rejects empty, malformed and duplicate components", () => {
  for (const value of [undefined, {}, [], [null], [{ name: "hero", schema: [] }]]) {
    assert.throws(() => validateComponents(value));
  }
  assert.throws(() => validateComponents([hero, hero]), /Duplicate/);
  assert.throws(
    () => validateComponents([{ ...hero, schema: { title: {} } }]),
    /Invalid field hero.title/,
  );
  assert.deepEqual(validateComponents([], true), []);
});

test("component files live directly in the component folder and bundle without React files", (t) => {
  const { root } = sandbox(t);
  const component = { ...hero, name: "hero_fullbleed" };
  writeComponentSources(root, [component]);
  const folder = join(root, "src/components/blocks/hero-fullbleed");
  assert.equal(componentSourcePath(root, component.name), join(folder, "hero_fullbleed.json"));
  writeFileSync(join(folder, "hero-fullbleed.tsx"), "export function HeroFullbleed() {}");
  assert.deepEqual(readComponentSources(root), [component, hero]);
  assert.deepEqual(bundleSchema(root).components, [component, hero]);
  writeFileSync(join(folder, "mismatched.json"), JSON.stringify(component));
  assert.throws(() => readComponentSources(root), /Schema path does not match technical name/);
});

test("import preserves project notes and schema details, but excludes response metadata", () => {
  const canonical = { _comment: ["Keep these notes"], components: [hero] };
  const remote = {
    components: [{ ...hero, id: 42, created_at: "yesterday", display_name: "Hero" }],
  };
  const imported = importSnapshot(canonical, remote);
  assert.deepEqual(imported, {
    _comment: canonical._comment,
    components: [{ ...hero, display_name: "Hero" }],
  });
  assert.equal(canonical.components[0], hero);
  assert.throws(() => importSnapshot(canonical, { components: [] }), /non-empty/);
  assert.throws(
    () => importSnapshot(canonical, { components: [{ ...hero, name: "other" }] }),
    /would remove local components: hero/,
  );
});

test("push preparation uses fresh IDs and retains groups, tags and relevant presets", () => {
  const remote = {
    components: [
      { ...hero, id: 42, component_group_uuid: "group", internal_tag_ids: ["7"] },
      { ...hero, name: "remote_only", id: 99 },
    ],
    groups: [{ id: 1, uuid: "group", name: "Blocks" }],
    tags: [{ id: 7, name: "shared", object_type: "component" }],
    presets: [
      { id: 10, component_id: 42, name: "Default", preset: {} },
      { id: 11, component_id: 99, name: "Other", preset: {} },
    ],
  };
  const staged = preparePush([{ ...hero, id: 123 }], remote);
  assert.equal(staged.components.length, 1);
  assert.equal(staged.components[0].id, 42);
  assert.equal(staged.components[0].component_group_uuid, "group");
  assert.deepEqual(staged.components[0].internal_tag_ids, ["7"]);
  assert.deepEqual(staged.groups, remote.groups);
  assert.deepEqual(staged.tags, remote.tags);
  assert.deepEqual(staged.presets, [remote.presets[0]]);
  const newComponent = preparePush([hero], { ...emptyMetadata, components: [] });
  assert.deepEqual(JSON.parse(JSON.stringify(newComponent.components)), [hero]);
});

test("preview reports creates and exact schema changes, ignoring remote-only metadata", () => {
  assert.deepEqual(compareComponents([hero], [{ ...hero, id: 42, color: "red" }]), []);
  assert.equal(compareComponents([hero], [])[0].action, "create");
  const changed = { ...hero, schema: {} };
  const preview = compareComponents([changed], [hero, { ...hero, name: "remote_only" }]);
  assert.deepEqual(preview, [
    {
      name: "hero",
      action: "update",
      changes: [{ field: "schema", before: hero.schema, after: {} }],
    },
  ]);
});

function sandbox(t) {
  const root = mkdtempSync(join(tmpdir(), "steffensenfoto-storyblok-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  mkdirSync(join(root, "node_modules/storyblok/dist"), { recursive: true });
  copyFileSync(new URL("./storyblok.mjs", import.meta.url), join(root, "scripts/storyblok.mjs"));
  copyFileSync(
    new URL("./storyblok-schema.mjs", import.meta.url),
    join(root, "scripts/storyblok-schema.mjs"),
  );
  writeComponentSources(root, [hero]);
  writeFileSync(
    join(root, "storyblok-components.json"),
    JSON.stringify({ _comment: ["Keep"], components: [hero] }),
  );
  writeFileSync(
    join(root, "node_modules/storyblok/dist/index.mjs"),
    `
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const args = process.argv.slice(2);
appendFileSync("calls.jsonl", JSON.stringify(args) + "\\n");
if (process.env.TEST_CLI_FAIL) process.exit(2);
if (args[1] === "pull" && !process.env.TEST_NO_SNAPSHOT) {
  const value = (flag) => args[args.indexOf(flag) + 1];
  const directory = resolve(value("--path"), "components", value("--space"));
  mkdirSync(directory, { recursive: true });
  const components = JSON.parse(readFileSync("remote.json", "utf8"));
  writeFileSync(resolve(directory, "components.json"), JSON.stringify(components));
}
`,
  );
  writeFileSync(join(root, "remote.json"), JSON.stringify([hero]));
  const env = { ...process.env };
  for (const key of [
    "STORYBLOK_SPACE_ID",
    "STORYBLOK_REGION",
    "TEST_CLI_FAIL",
    "TEST_NO_SNAPSHOT",
  ]) {
    delete env[key];
  }
  const run = (command, overrides = {}) =>
    spawnSync(process.execPath, ["scripts/storyblok.mjs", command], {
      cwd: root,
      env: { ...env, ...overrides },
      encoding: "utf8",
    });
  return { root, run };
}

test("pull loads .env.local ahead of .env and never changes the canonical schema", (t) => {
  const { root, run } = sandbox(t);
  writeFileSync(join(root, ".env.local"), "STORYBLOK_SPACE_ID=123\nSTORYBLOK_REGION=us\n");
  writeFileSync(join(root, ".env"), "STORYBLOK_SPACE_ID=999\nSTORYBLOK_REGION=eu\n");
  const before = readFileSync(join(root, "storyblok-components.json"), "utf8");
  const result = run("pull");
  assert.equal(result.status, 0, result.stderr);
  const calls = readFileSync(join(root, "calls.jsonl"), "utf8");
  assert.match(calls, /"123","--region","us"/);
  assert.equal(readFileSync(join(root, "storyblok-components.json"), "utf8"), before);
  assert.equal(run("pull", { STORYBLOK_SPACE_ID: "456" }).status, 0);
  assert.match(readFileSync(join(root, "calls.jsonl"), "utf8"), /"456","--region","us"/);
});

test("preview never pushes; push writes array files and leaves remote-only components out", (t) => {
  const { root, run } = sandbox(t);
  writeFileSync(join(root, "remote.json"), "[]");
  const env = { STORYBLOK_SPACE_ID: "123" };
  assert.equal(run("preview", env).status, 0);
  assert.doesNotMatch(readFileSync(join(root, "calls.jsonl"), "utf8"), /"push"/);
  const result = run("push", env);
  assert.equal(result.status, 0, result.stderr);
  const staged = join(root, ".storyblok/push/components/123");
  assert.deepEqual(JSON.parse(readFileSync(join(staged, "components.json"), "utf8")), [hero]);
  for (const filename of ["groups.json", "presets.json", "tags.json"]) {
    assert.deepEqual(JSON.parse(readFileSync(join(staged, filename), "utf8")), []);
  }
  assert.match(readFileSync(join(root, "calls.jsonl"), "utf8"), /"components","push"/);
});

test("failed pulls and missing snapshots are errors, not success-shaped stale imports", (t) => {
  const { root, run } = sandbox(t);
  const env = { STORYBLOK_SPACE_ID: "123" };
  assert.equal(run("pull", env).status, 0);
  const failed = run("pull", { ...env, TEST_CLI_FAIL: "1" });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /CLI failed/);
  assert.equal(run("import", env).status, 1);
  const missing = run("pull", { ...env, TEST_NO_SNAPSHOT: "1" });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /No component snapshot/);
  assert.equal(run("push", { STORYBLOK_SPACE_ID: "../wrong" }).status, 1);
  assert.doesNotMatch(readFileSync(join(root, "calls.jsonl"), "utf8"), /"push"/);
});

test("per-block JSON is the source for deterministic bundles and explicit imports", (t) => {
  const { root, run } = sandbox(t);
  const before = bundleSchema(root);
  assert.deepEqual(before.components, [hero]);
  assert.deepEqual(before._comment, ["Keep"]);
  const changed = { ...hero, display_name: "Changed remotely", id: 42 };
  writeFileSync(join(root, "remote.json"), JSON.stringify([changed]));
  const env = { STORYBLOK_SPACE_ID: "123" };
  assert.equal(run("pull", env).status, 0);
  assert.deepEqual(readComponentSources(root), [hero]);
  const result = run("import", env);
  assert.equal(result.status, 0, result.stderr);
  const imported = { ...hero, display_name: "Changed remotely" };
  assert.deepEqual(readComponentSources(root), [imported]);
  assert.deepEqual(bundleSchema(root), { _comment: ["Keep"], components: [imported] });
  writeFileSync(componentSourcePath(root, "hero"), JSON.stringify({ ...hero, name: "../escape" }));
  assert.throws(() => readComponentSources(root), /technical name/);
});
