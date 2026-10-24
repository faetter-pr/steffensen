import { storyblokEditable } from "@storyblok/react/rsc";

import { PhotoCarousel } from "@/components/photo/photo-carousel";
import type { GalleryCarouselStoryblok, ImageItemStoryblok } from "@/lib/storyblok/types";
import { toLightboxItems } from "@/lib/storyblok/image-item";

/** gallery_carousel (architecture.md §4). CSS scroll-snap; see photo-carousel.tsx. */
export function GalleryCarousel({ blok }: { blok: GalleryCarouselStoryblok }) {
  const items = toLightboxItems((blok.images ?? []) as ImageItemStoryblok[]);
  if (!items.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      {blok.headline ? (
        <h2 className="mb-8 max-w-2xl font-heading text-3xl leading-tight text-balance sm:text-4xl">
          {blok.headline}
        </h2>
      ) : null}

      <PhotoCarousel items={items} />
    </section>
  );
}
