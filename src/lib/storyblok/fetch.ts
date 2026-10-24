import type { ISbStoriesParams, ISbStoryData } from "@storyblok/react/rsc";
import { draftMode } from "next/headers";

import { getStoryblokApi, isStoryblokConfigured } from "@/lib/storyblok/client";
import { STORY_RELATIONS } from "@/lib/storyblok/relations";
import type {
  GlobalSettingsStoryblok,
  ProjectStoryblok,
  RoutableStoryblok,
} from "@/lib/storyblok/types";

/**
 * Typed data access for Storyblok (architecture.md §9).
 *
 * Every function returns null/[] rather than throwing when STORYBLOK_TOKEN is absent,
 * so the project builds and runs before the space exists. See CLAUDE.md.
 *
 * Cache tags go in the third argument (`fetchOptions`), which storyblok-js-client passes
 * straight through to fetch() — that is where Next reads `next: { tags }`.
 */

export const CACHE_TAGS = {
  global: "global",
  content: "content",
  projects: "projects",
  story: (slug: string) => `story:${slug}`,
} as const;

let warnedMissingToken = false;

function warnOnce(): void {
  if (warnedMissingToken) return;
  warnedMissingToken = true;
  console.warn(
    "[storyblok] STORYBLOK_TOKEN is not set — content fetches are disabled. " +
      "Copy .env.example to .env.local and fill it in.",
  );
}

/** Draft mode is only on inside the Visual Editor, via /api/draft. */
async function resolveVersion(): Promise<"draft" | "published"> {
  const { isEnabled } = await draftMode();
  return isEnabled ? "draft" : "published";
}

/** Draft content must never be cached; published content is cached under its tags. */
function cacheOptions(version: "draft" | "published", tags: string[]): RequestInit {
  return version === "draft" ? { cache: "no-store" } : { next: { tags } };
}

interface FetchOptions {
  /** Extra params merged into the request (resolve_relations, etc). */
  params?: ISbStoriesParams;
  /** Cache tags for revalidateTag (§9). */
  tags?: string[];
}

/**
 * Fetch a single story by slug.
 *
 * @param slug Storyblok full slug, without a leading slash. "" resolves to the home story.
 */
export async function fetchStory<T = RoutableStoryblok>(
  slug: string,
  options: FetchOptions = {},
): Promise<ISbStoryData<T> | null> {
  if (!isStoryblokConfigured) {
    warnOnce();
    return null;
  }

  const normalised = slug.replace(/^\/+|\/+$/g, "") || "home";
  const version = await resolveVersion();

  try {
    const response = await getStoryblokApi().get(
      `cdn/stories/${normalised}`,
      {
        resolve_relations: STORY_RELATIONS.join(","),
        resolve_links: "url",
        ...options.params,
        version,
      },
      cacheOptions(version, [
        CACHE_TAGS.content,
        ...(options.tags ?? [CACHE_TAGS.story(normalised)]),
      ]),
    );

    return (response.data.story as ISbStoryData<T>) ?? null;
  } catch (error) {
    // A 404 is a legitimate "no such page", not a failure worth crashing the render.
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** Site-wide settings, fetched once in the root layout (§9). */
export async function fetchGlobal(): Promise<ISbStoryData<GlobalSettingsStoryblok> | null> {
  return fetchStory<GlobalSettingsStoryblok>("settings/global", {
    tags: [CACHE_TAGS.global],
  });
}

/** All projects, newest first. Used by the portfolio grid (phase 3). */
export async function fetchProjects(
  options: { segment?: string; perPage?: number } = {},
): Promise<ISbStoryData<ProjectStoryblok>[]> {
  if (!isStoryblokConfigured) {
    warnOnce();
    return [];
  }

  const version = await resolveVersion();

  try {
    const response = await getStoryblokApi().get(
      "cdn/stories",
      {
        version,
        starts_with: "portfolio/",
        is_startpage: false,
        per_page: options.perPage ?? 100,
        sort_by: "content.year:desc",
        ...(options.segment ? { filter_query: { segment: { in: options.segment } } } : {}),
      },
      cacheOptions(version, [CACHE_TAGS.projects]),
    );

    return (response.data.stories as ISbStoryData<ProjectStoryblok>[]) ?? [];
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}

/**
 * Every routed slug, for generateStaticParams (§9).
 * Excludes the content-only folders, which have no pages of their own.
 */
const UNROUTED_PREFIXES = ["packages/", "testimonials/", "settings/"];

export async function fetchRoutableSlugs(): Promise<string[]> {
  if (!isStoryblokConfigured) {
    warnOnce();
    return [];
  }

  try {
    const response = await getStoryblokApi().get(
      "cdn/links",
      { version: "published", per_page: 1000 },
      { next: { tags: [CACHE_TAGS.projects, CACHE_TAGS.global] } },
    );

    const links = Object.values(response.data.links ?? {}) as Array<{
      slug?: string;
      is_folder?: boolean;
    }>;

    return links
      .filter(
        (link): link is { slug: string; is_folder?: boolean } =>
          !link.is_folder && typeof link.slug === "string",
      )
      .map((link) => link.slug)
      .filter((slug) => !UNROUTED_PREFIXES.some((prefix) => slug.startsWith(prefix)));
  } catch (error) {
    // Never let a links failure break the build — fall back to on-demand rendering.
    console.error("[storyblok] Failed to fetch routable slugs; using on-demand rendering.", error);
    return [];
  }
}

function isNotFound(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status?: number }).status === 404;
  }
  return false;
}
