import {
  StoryblokServerComponent,
  StoryblokServerRichText,
  storyblokEditable,
} from "@storyblok/react/rsc";

import type { ProjectStoryblok } from "@/lib/storyblok/types";

/**
 * `project` content type (architecture.md §3) — a shoot or series.
 *
 * NOTE: §13.8 also asks for a "Next project" link at the bottom. That needs the sibling
 * list, which belongs with portfolio filtering in phase 3.
 */

export function ProjectPage({ blok }: { blok: ProjectStoryblok }) {
  const meta = [blok.year, blok.location].filter(Boolean).join(" · ");

  return (
    <main {...storyblokEditable(blok)} data-segment={blok.segment}>
      <header className="container-content pt-16 pb-10 sm:pt-24">
        {blok.title ? (
          <h1 className="max-w-3xl font-heading text-4xl leading-tight text-balance sm:text-5xl">
            {blok.title}
          </h1>
        ) : null}

        {meta ? <p className="mt-4 text-sm text-muted-foreground">{meta}</p> : null}

        {blok.intro ? (
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty">
            <StoryblokServerRichText document={blok.intro} />
          </div>
        ) : null}
      </header>

      {(blok.body ?? []).map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </main>
  );
}
