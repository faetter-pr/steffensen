import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { bundleSchema, validateComponents, writeComponentSources } from "./storyblok-schema.mjs";

export { validateComponents } from "./storyblok-schema.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const CLI = fileURLToPath(new URL("../node_modules/storyblok/dist/index.mjs", import.meta.url));
const FILES = ["components.json", "groups.json", "presets.json", "tags.json"];
const WRITABLE_KEYS = [
  "name",
  "display_name",
  "description",
  "schema",
  "is_root",
  "is_nestable",
  "component_group_uuid",
  "color",
  "icon",
  "preview_field",
  "preview_tmpl",
  "internal_tag_ids",
];

export function loadEnvironment(root = ROOT) {
  // Match the local-file precedence without requiring Next.js at CLI runtime.
  for (const filename of [".env.local", ".env"]) {
    const path = resolve(root, filename);
    if (existsSync(path)) process.loadEnvFile(path);
  }
}

export function readSettings(env, requireSpace = true) {
  const region = env.STORYBLOK_REGION || "eu";
  const space = env.STORYBLOK_SPACE_ID;
  if (!["eu", "us", "ap", "ca", "cn"].includes(region)) {
    throw new Error("STORYBLOK_REGION must be eu, us, ap, ca, or cn.");
  }
  if ((requireSpace || space !== undefined) && !/^[1-9]\d*$/.test(space ?? "")) {
    throw new Error("Set STORYBLOK_SPACE_ID to a positive integer in .env.local.");
  }
  return { space, region };
}

export function writableComponent(component) {
  return Object.fromEntries(
    WRITABLE_KEYS.filter((key) => Object.hasOwn(component, key)).map((key) => [
      key,
      component[key],
    ]),
  );
}

export function importSnapshot(canonical, remote) {
  validateComponents(canonical.components);
  validateComponents(remote.components);
  const remoteNames = new Set(remote.components.map((component) => component.name));
  const missing = canonical.components.filter((component) => !remoteNames.has(component.name));
  if (missing.length) {
    throw new Error(
      `Import would remove local components: ${missing.map((component) => component.name).join(", ")}. ` +
        "Resolve the mismatch explicitly before importing.",
    );
  }
  return { ...canonical, components: remote.components.map(writableComponent) };
}

export function preparePush(local, remote) {
  validateComponents(local);
  validateComponents(remote.components, true);
  const byName = new Map(remote.components.map((component) => [component.name, component]));
  const components = local.map((component) => ({
    ...byName.get(component.name),
    ...writableComponent(component),
    id: byName.get(component.name)?.id,
  }));
  const ids = new Set(components.map((component) => component.id).filter((id) => id !== undefined));
  return {
    components,
    groups: remote.groups,
    tags: remote.tags,
    // The CLI deletes remote presets that are missing from its local input.
    presets: remote.presets.filter((preset) => ids.has(preset.component_id)),
  };
}

export function compareComponents(local, remote) {
  validateComponents(local);
  validateComponents(remote, true);
  const byName = new Map(remote.map((component) => [component.name, component]));
  return local.flatMap((component) => {
    const before = byName.get(component.name);
    const desired = writableComponent(component);
    const changes = Object.keys(desired).flatMap((key) =>
      isDeepStrictEqual(before?.[key], desired[key])
        ? []
        : [{ field: key, before: before?.[key], after: desired[key] }],
    );
    return !before || changes.length
      ? [{ name: component.name, action: before ? "update" : "create", changes }]
      : [];
  });
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function runCli(args) {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd: ROOT, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Storyblok CLI failed (${result.signal ?? result.status}).`);
  }
}

function snapshotDirectory(base, space) {
  return resolve(ROOT, base, "components", space);
}

function readSnapshot(directory) {
  const snapshot = {};
  for (const filename of FILES) {
    const path = resolve(directory, filename);
    if (filename === "components.json" && !existsSync(path)) {
      throw new Error("No component snapshot found. Run npm run storyblok:pull first.");
    }
    const value = existsSync(path) ? readJson(path) : [];
    if (!Array.isArray(value)) throw new Error(`Expected an array in ${path}.`);
    snapshot[filename.replace(".json", "")] = value;
  }
  validateComponents(snapshot.components, true);
  return snapshot;
}

function pull(settings) {
  const base = ".storyblok/remote";
  const directory = snapshotDirectory(base, settings.space);
  mkdirSync(directory, { recursive: true });
  // The CLI omits empty metadata files; remove old ones so they cannot survive a new pull.
  for (const filename of [...FILES, ".complete"]) {
    const path = resolve(directory, filename);
    if (existsSync(path)) unlinkSync(path);
  }
  runCli([
    "components",
    "pull",
    "--space",
    settings.space,
    "--region",
    settings.region,
    "--path",
    base,
  ]);
  const snapshot = readSnapshot(directory);
  writeJson(resolve(directory, ".complete"), settings);
  return snapshot;
}

export function main(args = process.argv.slice(2)) {
  loadEnvironment();
  const [command, ...extra] = args;
  if (!["login", "pull", "import", "preview", "push"].includes(command)) {
    throw new Error("Expected login, pull, import, preview, or push.");
  }
  if (extra.length && command !== "login")
    throw new Error("Schema commands do not accept extra flags.");
  const settings = readSettings(process.env, command !== "login");
  if (command === "login") {
    runCli(["login", "--region", settings.region, ...extra]);
    return;
  }
  if (command === "pull") {
    pull(settings);
    console.log("Pulled schema into .storyblok/remote. The canonical schema has not changed.");
    return;
  }
  const canonical = bundleSchema(ROOT);
  validateComponents(canonical.components);
  if (command === "import") {
    const directory = snapshotDirectory(".storyblok/remote", settings.space);
    const complete = resolve(directory, ".complete");
    if (!existsSync(complete) || !isDeepStrictEqual(readJson(complete), settings)) {
      throw new Error(
        "No completed pull for this space and region. Run npm run storyblok:pull first.",
      );
    }
    const remote = readSnapshot(directory);
    const imported = importSnapshot(canonical, remote);
    writeComponentSources(ROOT, imported.components);
    bundleSchema(ROOT);
    console.log("Imported staged components. Regenerating types and documentation next.");
    return;
  }
  const remote = pull(settings);
  const changes = compareComponents(canonical.components, remote.components);
  console.log(JSON.stringify({ space: settings.space, changes }, null, 2));
  if (command === "preview") {
    console.log(
      "Read-only schema preview; no remote writes. Remote-only components and presets are retained. " +
        "Server normalization and CLI dependency operations are not simulated.",
    );
    return;
  }
  if (!changes.length) {
    console.log("No schema changes to push.");
    return;
  }
  const staged = preparePush(canonical.components, remote);
  const base = ".storyblok/push";
  const directory = snapshotDirectory(base, settings.space);
  mkdirSync(directory, { recursive: true });
  for (const filename of FILES) {
    writeJson(resolve(directory, filename), staged[filename.replace(".json", "")]);
  }
  runCli([
    "components",
    "push",
    "--space",
    settings.space,
    "--region",
    settings.region,
    "--path",
    base,
  ]);
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
