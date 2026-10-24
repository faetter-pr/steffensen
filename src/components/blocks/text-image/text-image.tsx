import { StoryblokServerRichText, storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";

import { PhotoImage } from "@/components/photo/photo-image";
import { Button } from "@/components/ui/button";
import { resolveLink } from "@/lib/storyblok/link";
import type { TextImageStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/** text_image (architecture.md §4) — image + rich text, left or right. */
export function TextImage({ blok }: { blok: TextImageStoryblok }) {
  const href = resolveLink(blok.cta_link);
  const imageRight = blok.image_side === "right";

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {blok.image?.filename ? (
          <PhotoImage
            src={blok.image.filename}
            alt={blok.image_alt ?? ""}
            focus={blok.image.focus}
            sizes="grid-3col"
            className={cn("aspect-4/5 w-full", imageRight && "lg:order-2")}
            imageClassName="h-full w-full object-cover"
          />
        ) : null}

        <div className={cn(imageRight && "lg:order-1")}>
          {blok.headline ? (
            <h2 className="font-heading text-3xl leading-tight text-balance sm:text-4xl">
              {blok.headline}
            </h2>
          ) : null}

          {blok.text ? (
            <div className="prose-a:text-brand-accent-ink mt-5 leading-relaxed text-pretty">
              <StoryblokServerRichText document={blok.text} />
            </div>
          ) : null}

          {blok.cta_label && href ? (
            <Button asChild className="tap-target mt-7">
              <Link href={href}>{blok.cta_label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
