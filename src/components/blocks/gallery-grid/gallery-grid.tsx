import { storyblokEditable } from "@storyblok/react/rsc";

import { PhotoGrid } from "@/components/photo/photo-grid";
import { gapClass, motionDisabled } from "@/lib/storyblok/editorial";
import { toLightboxItems } from "@/lib/storyblok/image-item";
import type { GalleryGridStoryblok, ImageItemStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * gallery_grid — editorial brief, page recipe #6.
 *
 * `strip-3`: three equal frames in a row, 2px apart, no captions. `edge-to-edge` drops
 * the container; `contained` keeps the max width. Clicking opens the lightbox.
 */
export function GalleryGrid({ blok }: { blok: GalleryGridStoryblok }) {
  const items = toLightboxItems((blok.images ?? []) as ImageItemStoryblok[]);
  if (!items.length) return null;

  const off = motionDisabled(blok.motion);
  const variant = blok.variant || "contained";
  const strip = variant === "strip-3";
  const contained = variant === "contained";

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(contained ? "container-content py-14 sm:py-20" : "")}
    >
      {blok.headline ? (
        <h2
          className={cn(
            "mb-6 text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase",
            !contained && "px-5 pt-16 sm:px-8",
          )}
        >
          {blok.headline}
        </h2>
      ) : null}

      <PhotoGrid
        items={strip ? items.slice(0, 3) : items}
        variant="grid"
        columns={strip ? "3" : blok.columns || "3"}
        gapClassName={gapClass(blok.gap)}
        aspect={strip ? "square" : blok.aspect || "square"}
        sizes={strip ? "third" : "grid-3col"}
        rounded={false}
        showCaptions={false}
        disabled={off}
      />
    </section>
  );
}
