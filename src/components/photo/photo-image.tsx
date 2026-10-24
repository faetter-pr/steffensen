import Image from "next/image";

import {
  SIZES_PRESETS,
  type SizesPreset,
  buildBlurUrl,
  focusToObjectPosition,
  isPlaceholderAsset,
  isStoryblokAsset,
  isSvgAsset,
  parseAssetDimensions,
  parsePlaceholderDimensions,
} from "@/lib/storyblok/image-loader";
import { cn } from "@/lib/utils";

/**
 * The single image wrapper (architecture.md §8). Every image on the site renders
 * through this — raw <img> and direct next/image are lint errors (see CLAUDE.md).
 *
 * This is a layer-2 component: it takes plain props and knows nothing about
 * Storyblok bloks. Layer-3 blocks unwrap the asset field and pass values in.
 */

export interface PhotoImageProps {
  /** Storyblok asset URL (asset.filename). */
  src: string;
  /**
   * Required. Describe the scene or activity.
   * Never a child's name — architecture.md §12.
   */
  alt: string;
  /** Named preset from §8, or a raw sizes string. */
  sizes?: SizesPreset | (string & {});
  /** Storyblok focus field, e.g. "408x290:488x370". Becomes object-position. */
  focus?: string | null;
  /** Fill the parent (which must be positioned) instead of using intrinsic size. */
  fill?: boolean;
  /** Only the first hero image on a page should set this (§8). */
  priority?: boolean;
  className?: string;
  /** Applied to the <Image> itself; use for object-fit/rounding. */
  imageClassName?: string;
  /** Overrides the dimensions parsed from the asset URL. */
  width?: number;
  height?: number;
  quality?: number;
}

const FALLBACK_DIMENSIONS = { width: 1200, height: 800 };

export function PhotoImage({
  src,
  alt,
  sizes = "grid-3col",
  focus,
  fill = false,
  priority = false,
  className,
  imageClassName,
  width,
  height,
  quality = 80,
}: PhotoImageProps) {
  if (!src) return null;

  // Design-sandbox placeholder: a coloured box at the right aspect ratio, no request.
  // role="img" + aria-label keeps the alt text meaningful, so a11y review still works
  // on fixture content.
  if (isPlaceholderAsset(src)) {
    const ratio = parsePlaceholderDimensions(src);
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("placeholder-image", fill && "absolute inset-0 h-full w-full", className)}
        style={fill ? undefined : { aspectRatio: `${ratio.width} / ${ratio.height}` }}
      />
    );
  }

  const resolvedSizes = sizes in SIZES_PRESETS ? SIZES_PRESETS[sizes as SizesPreset] : sizes;

  const objectPosition = focusToObjectPosition(focus, src);
  const blurDataURL = buildBlurUrl(src);

  // SVGs (logos) must not go through the resizing service.
  const unoptimized = !isStoryblokAsset(src) || isSvgAsset(src);

  // `alt` is passed explicitly at each <Image> below rather than via this spread, so
  // jsx-a11y can statically see it. It is a required prop, so it is always present.
  const shared = {
    src,
    sizes: resolvedSizes,
    quality,
    priority,
    unoptimized,
    className: cn("object-cover", imageClassName),
    ...(objectPosition ? { style: { objectPosition } } : {}),
    ...(blurDataURL && !unoptimized ? { placeholder: "blur" as const, blurDataURL } : {}),
  };

  if (fill) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        <Image {...shared} alt={alt} fill />
      </span>
    );
  }

  const parsed = parseAssetDimensions(src);
  const finalWidth = width ?? parsed?.width ?? FALLBACK_DIMENSIONS.width;
  const finalHeight = height ?? parsed?.height ?? FALLBACK_DIMENSIONS.height;

  return (
    <span className={cn("block overflow-hidden", className)}>
      <Image {...shared} alt={alt} width={finalWidth} height={finalHeight} />
    </span>
  );
}
