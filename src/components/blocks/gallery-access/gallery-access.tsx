import { storyblokEditable } from "@storyblok/react/rsc";

import { GalleryAccessUI } from "@/components/forms/gallery-access-ui";
import type { GalleryAccessStoryblok } from "@/lib/storyblok/types";

/**
 * gallery_access (architecture.md §4, §12).
 *
 * UI only. Code validation is NOT implemented — §15.2 (in-house vs. hosted delivery
 * service) is still open, and for photos of children that decision carries real
 * liability. See lib/gallery-auth.ts for what an in-house build would have to satisfy.
 */
export function GalleryAccess({ blok }: { blok: GalleryAccessStoryblok }) {
  return (
    <section {...storyblokEditable(blok)} className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        {blok.heading ? (
          <h2 className="font-heading text-3xl leading-tight text-balance">{blok.heading}</h2>
        ) : null}

        {blok.instructions ? (
          <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">
            {blok.instructions}
          </p>
        ) : null}

        <div className="mt-8">
          <GalleryAccessUI buttonLabel={blok.button_label || "Åbn galleri"} />
        </div>
      </div>
    </section>
  );
}
