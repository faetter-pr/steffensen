import { StoryblokStory } from "@storyblok/react/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NotConfigured } from "@/components/pages/not-configured";
import { buildMetadata, slugToPath } from "@/lib/seo";
import { isStoryblokConfigured } from "@/lib/storyblok/client";
import { fetchGlobal, fetchRoutableSlugs, fetchStory } from "@/lib/storyblok/fetch";
import { STORY_RELATIONS } from "@/lib/storyblok/relations";
import { type RoutableStoryblok, firstSeo, isProject } from "@/lib/storyblok/types";

/**
 * Catch-all route (architecture.md §9).
 *
 * <StoryblokStory> renders the story through the registry in lib/storyblok/client.ts and
 * wires up the Visual Editor bridge, so no hand-rolled provider is needed (see CLAUDE.md).
 */

function slugFromParams(slug: string[] | undefined): string {
  return slug?.join("/") ?? "";
}

export async function generateStaticParams() {
  // Returns [] until STORYBLOK_TOKEN is set, so the build stays green with no space.
  const slugs = await fetchRoutableSlugs();

  return slugs.map((slug) => ({
    slug: slug === "home" ? [] : slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps<"/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params;
  const path = slugFromParams(slug);

  const [story, globalStory] = await Promise.all([
    fetchStory<RoutableStoryblok>(path),
    fetchGlobal(),
  ]);

  if (!story) return {};

  // `project` carries a cover and a title; `page` and `segment_page` do not.
  const content = story.content;
  const project = isProject(content) ? content : undefined;

  return buildMetadata({
    seo: firstSeo(content.seo),
    fallbackTitle: project?.title || story.name,
    coverUrl: project?.cover?.filename,
    path: slugToPath(story.full_slug),
    global: globalStory?.content ?? null,
  });
}

export default async function CatchAllPage({ params }: PageProps<"/[[...slug]]">) {
  const { slug } = await params;
  const path = slugFromParams(slug);

  // Before a Storyblok space exists there is nothing to render. Show a setup notice on
  // the front page rather than a 404 wall, so `npm run dev` is useful on a fresh clone.
  if (!isStoryblokConfigured) {
    if (path === "") return <NotConfigured />;
    notFound();
  }

  const story = await fetchStory<RoutableStoryblok>(path);
  if (!story) notFound();

  return (
    <StoryblokStory
      story={story}
      bridgeOptions={{ resolveRelations: STORY_RELATIONS, resolveLinks: "url" }}
    />
  );
}
