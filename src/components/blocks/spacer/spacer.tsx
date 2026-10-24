import { storyblokEditable } from "@storyblok/react/rsc";

import type { SpacerStoryblok } from "@/lib/storyblok/types";

/** spacer (architecture.md §4) — deliberate vertical breathing room. */

const SIZE_CLASS: Record<string, string> = {
  small: "h-8 sm:h-12",
  medium: "h-16 sm:h-24",
  large: "h-28 sm:h-40",
};

export function Spacer({ blok }: { blok: SpacerStoryblok }) {
  const size = SIZE_CLASS[blok.size || "medium"] ?? SIZE_CLASS.medium;
  return <div {...storyblokEditable(blok)} className={size} aria-hidden="true" />;
}
