import { storyblokEditable } from "@storyblok/react/rsc";
import { Suspense } from "react";

import { ProjectGallery } from "@/components/photo/project-gallery";
import { fetchProjects } from "@/lib/storyblok/fetch";
import { toProjectCards } from "@/lib/storyblok/project";
import {
  type ProjectGridStoryblok,
  type ProjectStoryblok,
  resolveRefs,
} from "@/lib/storyblok/types";

/**
 * project_grid (architecture.md §4, §13.8) — "references, or all filtered by segment".
 *
 * Both modes are supported: if the blok carries resolved project references those win,
 * otherwise the full list is fetched and optionally narrowed by `segment`.
 *
 * <ProjectGallery> is a client component because the filter bar reads the URL; it is
 * wrapped in Suspense since useSearchParams opts the subtree into client-side rendering.
 */
export async function ProjectGrid({ blok }: { blok: ProjectGridStoryblok }) {
  const referenced = resolveRefs<ProjectStoryblok>(blok.projects);

  const entries = referenced.length
    ? referenced
    : await fetchProjects(blok.segment ? { segment: blok.segment } : {});

  const projects = toProjectCards(entries);
  if (!projects.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      {blok.headline ? (
        <h2 className="mb-10 max-w-2xl font-heading text-3xl leading-tight text-balance sm:text-4xl">
          {blok.headline}
        </h2>
      ) : null}

      <Suspense fallback={null}>
        <ProjectGallery
          projects={projects}
          showFilter={Boolean(blok.show_filter)}
          layout={blok.layout === "wide" ? "wide" : "grid"}
        />
      </Suspense>
    </section>
  );
}
