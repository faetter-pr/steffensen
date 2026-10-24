import { storyblokEditable } from "@storyblok/react/rsc";

import { MaskReveal } from "@/components/motion/mask-reveal";
import { ParallaxFrame } from "@/components/motion/parallax-frame";
import { PhotoImage } from "@/components/photo/photo-image";
import { aspectClass, maxHeightClass, motionDisabled } from "@/lib/storyblok/editorial";
import { QUALITY } from "@/lib/storyblok/image-loader";
import type { ImageFullStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * image_full — editorial brief, page recipe #3.
 *
 * One large image, tiny caption bottom-left at 11px. MaskReveal on entry with a subtle
 * ParallaxFrame inside (brief item 4).
 *
 * Field is `width`, not `layout`: the brief names it `layout` but also says spec names
 * win, and architecture.md §4 calls it `width`.
 */

const WIDTH_CLASS: Record<string, string> = {
  contained: "container-content max-w-4xl",
  wide: "container-content",
  full: "w-full",
};

export function ImageFull({ blok }: { blok: ImageFullStoryblok }) {
  if (!blok.image?.filename) return null;

  const off = motionDisabled(blok.motion);
  const width = blok.width || "full";
  const isFull = width === "full";
  const aspect = aspectClass(blok.aspect);
  const maxHeight = maxHeightClass(blok.max_height);

  return (
    <section {...storyblokEditable(blok)} className={cn(isFull ? "" : "py-10 sm:py-14")}>
      <figure className={WIDTH_CLASS[width] ?? WIDTH_CLASS.full}>
        <MaskReveal disabled={off}>
          <ParallaxFrame disabled={off} className={cn(aspect, maxHeight)}>
            <PhotoImage
              src={blok.image.filename}
              alt={blok.image_alt ?? ""}
              focus={blok.image.focus}
              sizes={isFull ? "full-bleed" : "half"}
              quality={isFull ? QUALITY.large : QUALITY.default}
              fill={Boolean(aspect || maxHeight)}
              className="h-full w-full"
              imageClassName={cn("w-full", aspect || maxHeight ? "h-full object-cover" : "h-auto")}
            />
          </ParallaxFrame>
        </MaskReveal>

        {blok.caption ? (
          <figcaption
            className={cn(
              "mt-2 text-(length:--text-caption) text-brand-muted",
              isFull && "px-5 sm:px-8",
            )}
          >
            {blok.caption}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
