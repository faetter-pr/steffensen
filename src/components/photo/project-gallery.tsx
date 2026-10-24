"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { FilterBar, type FilterOption } from "@/components/photo/filter-bar";
import { ProjectCard, type ProjectCardData } from "@/components/photo/project-card";
import { cn } from "@/lib/utils";

/**
 * Filterable project grid (architecture.md §13.8).
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Filtering happens in the browser over an already-fetched list rather than by refetching.
 * For a portfolio of this size that is the right trade: switching segments is instant, and
 * the server still renders the full grid for crawlers and no-JS visitors. Revisit if the
 * project count ever grows into the hundreds.
 */

interface ProjectGalleryProps {
  projects: ProjectCardData[];
  showFilter?: boolean;
  filterOptions?: FilterOption[];
  layout?: "grid" | "wide";
}

const DEFAULT_FILTERS: FilterOption[] = [
  { label: "Alle", value: "all" },
  { label: "Børnehaver", value: "kindergartens" },
  { label: "Skoler", value: "schools" },
  { label: "Bryllupper", value: "weddings" },
  { label: "Andet", value: "other" },
];

export function ProjectGallery({
  projects,
  showFilter = false,
  filterOptions = DEFAULT_FILTERS,
  layout = "grid",
}: ProjectGalleryProps) {
  const searchParams = useSearchParams();
  const active = searchParams.get("segment") ?? "all";

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.segment === active)),
    [projects, active],
  );

  if (!projects.length) return null;

  return (
    <div>
      {showFilter ? (
        <div className="mb-10">
          <FilterBar options={filterOptions} />
        </div>
      ) : null}

      {visible.length ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-8",
            layout === "wide" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {visible.map((project) => (
            <li key={project.href}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-muted-foreground">Ingen projekter i denne kategori endnu.</p>
      )}
    </div>
  );
}
