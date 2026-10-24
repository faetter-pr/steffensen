import { globSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateComponents(components, allowEmpty = false) {
  if (!Array.isArray(components) || (!allowEmpty && components.length === 0)) {
    throw new Error("Expected a non-empty components array.");
  }
  const names = new Set();
  for (const component of components) {
    if (
      !isRecord(component) ||
      typeof component.name !== "string" ||
      !/^[a-z][a-z0-9_]*$/.test(component.name) ||
      !isRecord(component.schema)
    ) {
      throw new Error("Every component needs a technical name and a schema object.");
    }
    if (names.has(component.name)) throw new Error(`Duplicate component: ${component.name}`);
    names.add(component.name);
    for (const [key, field] of Object.entries(component.schema)) {
      if (!isRecord(field) || typeof field.type !== "string" || !field.type) {
        throw new Error(`Invalid field ${component.name}.${key}: expected a field type.`);
      }
    }
  }
  return components;
}

export function componentSourcePath(root, name) {
  return resolve(root, "src/components/blocks", name.replaceAll("_", "-"), `${name}.json`);
}

export function readComponentSources(root = ROOT) {
  const paths = globSync("src/components/blocks/*/*.json", { cwd: root }).sort();
  const components = paths.map((path) => {
    const absolute = resolve(root, path);
    const component = JSON.parse(readFileSync(absolute, "utf8"));
    validateComponents([component]);
    if (absolute !== componentSourcePath(root, component.name)) {
      throw new Error(`Schema path does not match technical name: ${path}`);
    }
    return component;
  });
  return validateComponents(components);
}

export function writeComponentSources(root, components) {
  validateComponents(components);
  for (const component of components) {
    const path = componentSourcePath(root, component.name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(component, null, 2)}\n`);
  }
}

export function bundleSchema(root = ROOT) {
  const path = resolve(root, "storyblok-components.json");
  const metadata = JSON.parse(readFileSync(path, "utf8"));
  const bundled = { ...metadata, components: readComponentSources(root) };
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(bundled, null, 2)}\n`);
  renameSync(temporary, path);
  return bundled;
}

if (import.meta.main) {
  try {
    const bundled = bundleSchema();
    console.log(
      `Bundled ${bundled.components.length} component schemas into storyblok-components.json.`,
    );
  } catch (error) {
    console.error(`Schema bundling failed: ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  }
}
