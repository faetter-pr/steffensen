import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadModule(path, imports) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  runInNewContext(compiled.outputText, {
    exports,
    console,
    process,
    URL,
    require(name) {
      assert(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
      return imports[name];
    },
  });
  return exports;
}

const relations = loadModule("src/lib/storyblok/relations.ts", {});

function createFetch({ draft = false, configured = true, get = async () => ({ data: {} }) } = {}) {
  const calls = [];
  const api = loadModule("src/lib/storyblok/fetch.ts", {
    "@/lib/storyblok/client": {
      isStoryblokConfigured: configured,
      getStoryblokApi: () => ({
        get: async (...args) => {
          calls.push(args);
          return get(...args);
        },
      }),
    },
    "@/lib/storyblok/relations": relations,
    "next/headers": { draftMode: async () => ({ isEnabled: draft }) },
  });
  return { api, calls };
}

test("relation configuration covers every internal-story reference in the schema", () => {
  const expected = globSync("src/components/blocks/*/*.json").flatMap((path) => {
    const component = JSON.parse(readFileSync(path, "utf8"));
    return Object.entries(component.schema)
      .filter(([, field]) => field.source === "internal_stories")
      .map(([key]) => `${component.name}.${key}`);
  });
  assert.deepEqual([...relations.STORY_RELATIONS].sort(), expected.sort());
});

test("live story requests resolve relations and links and return the CMS story", async () => {
  const story = { content: { component: "page", body: [{ component: "hero_fullbleed" }] } };
  const { api, calls } = createFetch({ get: async () => ({ data: { story } }) });
  assert.equal(await api.fetchStory(""), story);
  const [endpoint, params, options] = calls[0];
  assert.equal(endpoint, "cdn/stories/home");
  assert.equal(params.version, "published");
  assert.equal(params.resolve_links, "url");
  assert.equal(params.resolve_relations, relations.STORY_RELATIONS.join(","));
  assert.deepEqual([...options.next.tags], ["content", "story:home"]);
});

test("draft requests bypass cache, while global settings keep their cache tag", async () => {
  const { api, calls } = createFetch({ draft: true });
  await api.fetchStory("/weddings/", { params: { version: "published" } });
  assert.equal(calls[0][0], "cdn/stories/weddings");
  assert.equal(calls[0][1].version, "draft");
  assert.equal(calls[0][2].cache, "no-store");
  assert.equal(calls[0][2].next, undefined);
  const published = createFetch();
  await published.api.fetchGlobal();
  assert.equal(published.calls[0][0], "cdn/stories/settings/global");
  assert.deepEqual([...published.calls[0][2].next.tags], ["content", "global"]);
});

test("missing configuration makes no requests; missing stories return null; API errors surface", async () => {
  const absent = createFetch({ configured: false });
  assert.equal(await absent.api.fetchStory("home"), null);
  assert.equal((await absent.api.fetchProjects()).length, 0);
  assert.equal((await absent.api.fetchRoutableSlugs()).length, 0);
  assert.equal(absent.calls.length, 0);
  const missing = createFetch({
    get: async () => {
      throw { status: 404 };
    },
  });
  assert.equal(await missing.api.fetchStory("missing"), null);
  const failure = new Error("CMS unavailable");
  const broken = createFetch({
    get: async () => {
      throw failure;
    },
  });
  await assert.rejects(broken.api.fetchStory("home"), (error) => error === failure);
});

test("publishing a referenced story invalidates pages containing resolved references", async () => {
  const { api } = createFetch();
  const invalidated = [];
  const route = loadModule("src/app/api/revalidate/route.ts", {
    "next/cache": { revalidateTag: (...args) => invalidated.push(args) },
    "next/server": {
      NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) },
    },
    "@/lib/storyblok/fetch": { CACHE_TAGS: api.CACHE_TAGS },
  });
  const previous = process.env.STORYBLOK_WEBHOOK_SECRET;
  process.env.STORYBLOK_WEBHOOK_SECRET = "test-only-secret";
  try {
    const response = await route.POST(
      new Request("https://example.test/api/revalidate?secret=test-only-secret", {
        method: "POST",
        body: JSON.stringify({ full_slug: "packages/example" }),
      }),
    );
    assert.equal(response.status, 200);
    assert(invalidated.some(([tag, profile]) => tag === "content" && profile === "max"));
    assert(invalidated.some(([tag]) => tag === "story:packages/example"));
  } finally {
    if (previous === undefined) delete process.env.STORYBLOK_WEBHOOK_SECRET;
    else process.env.STORYBLOK_WEBHOOK_SECRET = previous;
  }
});
