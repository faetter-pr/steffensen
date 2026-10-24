import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";

import type { PageStoryblok } from "@/lib/storyblok/types";

/**
 * `page` content type (architecture.md §3) — Home, About, Contact, Privacy.
 *
 * Renders `body` via <StoryblokServerComponent>, which resolves each blok through the
 * registry in lib/storyblok/client.ts.
 */

export function Page({ blok }: { blok: PageStoryblok }) {
  return (
    <main {...storyblokEditable(blok)}>
      {(blok.body ?? []).map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </main>
  );
}
