import { storyblokEditable } from "@storyblok/react/rsc";

import { PhotoGrid } from "@/components/photo/photo-grid";
import type { GalleryMasonryStoryblok } from "@/lib/storyblok/types";
import { normalizeImageItems, toLightboxItems } from "@/lib/storyblok/image-item";

/** gallery_masonry (architecture.md §4, §13.4 "selected work"). */
export function GalleryMasonry({ blok }: { blok: GalleryMasonryStoryblok }) {
  const items = toLightboxItems(normalizeImageItems(blok.images ?? []));
  if (!items.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      {blok.headline ? (
        <h2 className="mb-8 max-w-2xl font-heading text-3xl leading-tight text-balance sm:text-4xl">
          {blok.headline}
        </h2>
      ) : null}

      <PhotoGrid items={items} variant="masonry" columns={blok.columns || "3"} />
    </section>
  );
}
