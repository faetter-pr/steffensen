import type { LightboxItem } from "@/components/photo/lightbox";
import type { ImageItemStoryblok } from "@/lib/storyblok/types";

/**
 * Unwrap `image_item` bloks into the plain props layer-2 components take.
 *
 * This is the Layer 3 → Layer 2 translation step from architecture.md §5, pulled into
 * one place because every gallery block needs it.
 *
 * Images with no asset are dropped rather than rendered empty — an editor mid-edit
 * should not produce a broken tile.
 */
export function toLightboxItems(images: ImageItemStoryblok[]): LightboxItem[] {
  return images
    .filter((image) => Boolean(image.asset?.filename))
    .map((image) => ({
      src: image.asset.filename,
      // §12: alt describes the activity. Required in Storyblok, defensive here.
      alt: image.alt ?? "",
      caption: image.caption,
      focus: image.asset.focus,
    }));
}
