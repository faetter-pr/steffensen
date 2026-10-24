import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";

import type { SegmentPageStoryblok } from "@/lib/storyblok/types";

/**
 * `segment_page` content type (architecture.md §3) — one landing page per audience.
 *
 * The data-segment attribute swaps the accent colour per §13.2; the CSS lives in
 * styles/globals.css.
 */

export function SegmentPage({ blok }: { blok: SegmentPageStoryblok }) {
  return (
    <main {...storyblokEditable(blok)} data-segment={blok.segment}>
      {(blok.body ?? []).map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </main>
  );
}
