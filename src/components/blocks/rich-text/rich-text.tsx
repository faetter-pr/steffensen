import { StoryblokServerRichText, storyblokEditable } from "@storyblok/react/rsc";

import type { RichTextStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * rich_text (architecture.md §4).
 *
 * Layer 3. Filename and registry key both match the Storyblok technical name.
 */

export function RichText({ blok }: { blok: RichTextStoryblok }) {
  if (!blok.text) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-12 sm:py-16">
      <div
        className={cn(
          "prose-headings:font-heading prose-headings:font-light",
          "prose-a:text-brand-accent-ink prose-a:underline-offset-4",
          "text-base leading-relaxed sm:text-lg",
          blok.width === "wide" ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        <StoryblokServerRichText document={blok.text} />
      </div>
    </section>
  );
}
