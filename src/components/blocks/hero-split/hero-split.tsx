import { storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";

import { PhotoImage } from "@/components/photo/photo-image";
import { Button } from "@/components/ui/button";
import { resolveLink } from "@/lib/storyblok/link";
import type { HeroSplitStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * hero_split (architecture.md §4, §13.5) — image + text.
 *
 * The kindergarten page opener: warm and reassuring rather than full-bleed dramatic.
 */
export function HeroSplit({
  blok,
  priority = false,
}: {
  blok: HeroSplitStoryblok;
  /** Set by the page renderer for the first block only (§8). */
  priority?: boolean;
}) {
  const href = resolveLink(blok.cta_link);
  const secondaryHref = resolveLink(blok.secondary_cta_link);
  const imageLeft = blok.image_side === "left";

  return (
    <section {...storyblokEditable(blok)} className="container-content py-12 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {blok.image?.filename ? (
          <PhotoImage
            src={blok.image.filename}
            // §12: describe the scene, never a child's name.
            alt={blok.image_alt ?? ""}
            focus={blok.image.focus}
            sizes="grid-3col"
            priority={priority}
            className={cn("aspect-4/5 w-full", imageLeft ? "lg:order-1" : "lg:order-2")}
            imageClassName="h-full w-full object-cover"
          />
        ) : null}

        <div className={cn(imageLeft ? "lg:order-2" : "lg:order-1")}>
          {blok.headline ? (
            <h1 className="font-heading text-4xl leading-tight text-balance sm:text-5xl">
              {blok.headline}
            </h1>
          ) : null}

          {blok.subline ? (
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
              {blok.subline}
            </p>
          ) : null}

          {(blok.cta_label && href) || (blok.secondary_cta_label && secondaryHref) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {blok.cta_label && href ? (
                <Button asChild size="lg" className="tap-target">
                  <Link href={href}>{blok.cta_label}</Link>
                </Button>
              ) : null}

              {blok.secondary_cta_label && secondaryHref ? (
                <Button asChild size="lg" variant="outline" className="tap-target">
                  <Link href={secondaryHref}>{blok.secondary_cta_label}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
