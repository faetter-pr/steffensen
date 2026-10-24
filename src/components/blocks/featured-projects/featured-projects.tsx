import { storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";

import { ProjectCard } from "@/components/photo/project-card";
import { Button } from "@/components/ui/button";
import { resolveLink } from "@/lib/storyblok/link";
import { toProjectCards } from "@/lib/storyblok/project";
import {
  type FeaturedProjectsStoryblok,
  type ProjectStoryblok,
  resolveRefs,
} from "@/lib/storyblok/types";

/**
 * featured_projects (architecture.md §4) — a curated 3-6, e.g. on the weddings page.
 *
 * Like package_cards, `projects` is a reference field that only yields entries when the
 * fetch passes resolve_relations (§7).
 */
export function FeaturedProjects({ blok }: { blok: FeaturedProjectsStoryblok }) {
  const projects = toProjectCards(resolveRefs<ProjectStoryblok>(blok.projects));
  if (!projects.length) return null;

  const href = resolveLink(blok.cta_link);

  return (
    <section {...storyblokEditable(blok)} className="container-content py-16 sm:py-24">
      {blok.headline ? (
        <h2 className="max-w-2xl font-heading text-3xl leading-tight text-balance sm:text-4xl">
          {blok.headline}
        </h2>
      ) : null}

      {blok.intro ? (
        <p className="mt-4 max-w-xl text-pretty text-muted-foreground">{blok.intro}</p>
      ) : null}

      <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.href}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      {blok.cta_label && href ? (
        <div className="mt-10">
          <Button asChild variant="outline" className="tap-target">
            <Link href={href}>{blok.cta_label}</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
