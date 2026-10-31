import type { LightboxItem } from "@/components/photo/lightbox";
import type { AssetStoryblok, ImageItemStoryblok } from "@/lib/storyblok/types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toAsset(value: UnknownRecord): AssetStoryblok | null {
  if (typeof value.filename !== "string" || !value.filename) return null;

  return {
    id: typeof value.id === "number" ? value.id : null,
    alt: typeof value.alt === "string" ? value.alt : null,
    name: typeof value.name === "string" ? value.name : "",
    focus: typeof value.focus === "string" ? value.focus : null,
    source: typeof value.source === "string" ? value.source : null,
    title: typeof value.title === "string" ? value.title : null,
    filename: value.filename,
    copyright: typeof value.copyright === "string" ? value.copyright : null,
    fieldtype: "asset",
    meta_data: isRecord(value.meta_data) ? value.meta_data : null,
  };
}

/** Normalize either image_item bloks or bare Storyblok assets to image_item bloks. */
export function normalizeImageItems(images: unknown[]): ImageItemStoryblok[] {
  return images.flatMap((value): ImageItemStoryblok[] => {
    if (!isRecord(value)) return [];

    const rawAsset = isRecord(value.asset) ? value.asset : value;
    const asset = toAsset(rawAsset);
    if (!asset) return [];

    return [
      {
        _uid: typeof value._uid === "string" ? value._uid : String(asset.id ?? asset.filename),
        component: "image_item",
        asset,
        alt: typeof value.alt === "string" ? value.alt : asset.alt ?? "",
        ...(typeof value.caption === "string" ? { caption: value.caption } : {}),
        featured: typeof value.featured === "boolean" ? value.featured : false,
      },
    ];
  });
}

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
