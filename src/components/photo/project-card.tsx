import Link from "next/link";

import { PhotoImage } from "@/components/photo/photo-image";

/**
 * Project card (architecture.md §13.8 — cover, title, small meta).
 *
 * Layer 2: plain props, no Storyblok imports. Used by both project_grid and
 * featured_projects so the portfolio reads consistently.
 */

export interface ProjectCardData {
  href: string;
  title: string;
  coverSrc: string;
  coverAlt: string;
  coverFocus?: string | null;
  year?: string;
  location?: string;
  /** Drives the filter bar; plain string so this stays CMS-agnostic. */
  segment?: string;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const meta = [project.year, project.location].filter(Boolean).join(" · ");

  return (
    <Link
      href={project.href}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <PhotoImage
        src={project.coverSrc}
        alt={project.coverAlt}
        focus={project.coverFocus}
        sizes="grid-3col"
        className="aspect-4/5 w-full overflow-hidden rounded-lg"
        imageClassName="h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-gentle)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      <h3 className="mt-4 font-heading text-lg">{project.title}</h3>
      {meta ? <p className="mt-1 text-sm text-muted-foreground">{meta}</p> : null}
    </Link>
  );
}
