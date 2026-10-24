import type { ISbStoryData } from "@storyblok/react/rsc";

import type { ProjectCardData } from "@/components/photo/project-card";
import { slugToPath } from "@/lib/seo";
import type { ProjectStoryblok } from "@/lib/storyblok/types";

/**
 * Project story → ProjectCard props (the Layer 3 → Layer 2 step from §5).
 *
 * Shared by project_grid and featured_projects.
 */
export function toProjectCard(entry: ISbStoryData<ProjectStoryblok>): ProjectCardData | null {
  const content = entry.content;
  const coverSrc = content.cover?.filename;
  if (!coverSrc) return null;

  return {
    href: slugToPath(entry.full_slug),
    title: content.title || entry.name,
    coverSrc,
    // §12: describe the scene, never a child's name.
    coverAlt: content.cover_alt ?? "",
    coverFocus: content.cover?.focus,
    year: content.year,
    location: content.location,
    segment: content.segment || undefined,
  };
}

export function toProjectCards(entries: ISbStoryData<ProjectStoryblok>[]): ProjectCardData[] {
  return entries.map(toProjectCard).filter((card): card is ProjectCardData => card !== null);
}
