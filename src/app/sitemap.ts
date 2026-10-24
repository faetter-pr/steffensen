import type { MetadataRoute } from "next";

import { SITE_URL, slugToPath } from "@/lib/seo";
import { fetchRoutableSlugs } from "@/lib/storyblok/fetch";

/**
 * Sitemap (architecture.md §11).
 *
 * §12: client galleries must never appear here. fetchRoutableSlugs already excludes the
 * content-only folders, and /gallery is not a Storyblok-routed story, so it cannot leak in.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchRoutableSlugs();

  if (!slugs.length) {
    return [{ url: SITE_URL, changeFrequency: "monthly", priority: 1 }];
  }

  return slugs
    .filter((slug) => !slug.startsWith("gallery"))
    .map((slug) => {
      const path = slugToPath(slug);
      return {
        url: `${SITE_URL}${path === "/" ? "" : path}`,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.7,
      };
    });
}
