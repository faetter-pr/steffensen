/**
 * Storyblok Image Service helpers (architecture.md §8).
 *
 * Asset URLs look like:
 *   https://a.storyblok.com/f/{space}/{W}x{H}/{hash}/{name}.jpg
 *
 * Appending `/m/` enables the service and converts to WebP where supported;
 * `/m/{w}x{h}/` resizes; filters chain as `/filters:a(1):b(2)`.
 *
 * This module is CMS-aware but has no React/Next component imports, so it is safe
 * for <PhotoImage> (layer 2) to consume via plain props — see CLAUDE.md layer rules.
 */

/**
 * Sizes presets (§8, extended by the editorial brief → Image rules).
 *
 * Frames in this design are huge, so `sizes` is what decides whether the site feels
 * premium or sluggish — a wrong preset silently ships a 2x-too-large file.
 */
export const SIZES_PRESETS = {
  hero: "100vw",
  "full-bleed": "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 768px) 33vw, 100vw",
  /** image_pair asymmetric: left column is 5/8. */
  "asym-large": "(min-width: 768px) 62vw, 100vw",
  /** image_pair asymmetric: right column is 3/8. */
  "asym-small": "(min-width: 768px) 38vw, 100vw",
  "grid-3col": "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  masonry: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  thumb: "(min-width: 640px) 160px, 33vw",
  "portrait-card": "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
} as const;

export type SizesPreset = keyof typeof SIZES_PRESETS;

/**
 * Quality per frame size (brief: 85 for hero/full-bleed, 75-80 for small frames).
 * Large frames show compression artefacts that small ones hide.
 */
export const QUALITY = {
  large: 85,
  default: 80,
  small: 75,
} as const;

const STORYBLOK_HOSTS = ["a.storyblok.com", "a-us.storyblok.com", "a-ap.storyblok.com"];

/**
 * Placeholder assets for the design sandbox (/preview).
 *
 * Written as `placeholder://1600x1067` in fixtures. <PhotoImage> renders these as a
 * coloured box at the right aspect ratio instead of fetching anything, so designs can be
 * reviewed with no image files, no network and no layout shift.
 *
 * The scheme is deliberately not a real URL — it can never collide with a Storyblok
 * asset, and anything left over after real content lands is obvious.
 */
const PLACEHOLDER_SCHEME = "placeholder://";

export function isPlaceholderAsset(url: string | undefined | null): url is string {
  return typeof url === "string" && url.startsWith(PLACEHOLDER_SCHEME);
}

/** `placeholder://1600x1067` → { width: 1600, height: 1067 }. Defaults to 3:2. */
export function parsePlaceholderDimensions(url: string): { width: number; height: number } {
  const spec = url.slice(PLACEHOLDER_SCHEME.length);
  const match = /^(\d+)x(\d+)$/.exec(spec);
  if (!match) return { width: 3, height: 2 };

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return { width: 3, height: 2 };

  return { width, height };
}

export function isStoryblokAsset(url: string | undefined | null): url is string {
  if (!url) return false;
  return STORYBLOK_HOSTS.some((host) => url.includes(host));
}

/**
 * Pull the intrinsic dimensions out of the asset URL so <Image> can reserve space
 * and avoid layout shift without a network round-trip (§8).
 *
 * Returns null for SVGs and for anything that isn't a Storyblok asset URL.
 */
export function parseAssetDimensions(url: string): { width: number; height: number } | null {
  const match = /\/f\/\d+\/(\d+)x(\d+)\//.exec(url);
  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}

export function isSvgAsset(url: string): boolean {
  return url.split("?")[0]?.toLowerCase().endsWith(".svg") ?? false;
}

/**
 * Convert Storyblok's focus field ("left-top:right-bottom", e.g. "408x290:488x370")
 * into a CSS object-position percentage (§8).
 */
export function focusToObjectPosition(
  focus: string | null | undefined,
  assetUrl: string,
): string | undefined {
  if (!focus) return undefined;

  const match = /^(\d+)x(\d+):(\d+)x(\d+)$/.exec(focus.trim());
  if (!match) return undefined;

  const dimensions = parseAssetDimensions(assetUrl);
  if (!dimensions) return undefined;

  const x1 = Number(match[1]);
  const y1 = Number(match[2]);
  const x2 = Number(match[3]);
  const y2 = Number(match[4]);

  // Centre of the focus rectangle, as a percentage of the original image.
  const cx = ((x1 + x2) / 2 / dimensions.width) * 100;
  const cy = ((y1 + y2) / 2 / dimensions.height) * 100;

  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  return `${clamp(cx)}% ${clamp(cy)}%`;
}

interface BuildUrlOptions {
  width: number;
  height?: number;
  quality?: number;
  /** Storyblok focus string; enables smart cropping when height is also set. */
  focus?: string | null;
  blur?: number;
}

/**
 * Build a Storyblok Image Service URL. Exported for the blur placeholder and the
 * lightbox's large variant; the Next loader below is the usual entry point.
 */
export function buildStoryblokImageUrl(src: string, options: BuildUrlOptions): string {
  if (!isStoryblokAsset(src) || isSvgAsset(src)) return src;

  // Guard against double-processing an already-transformed URL.
  const base = src.split("/m/")[0] ?? src;

  const { width, height = 0, quality = 80, focus, blur } = options;

  const filters: string[] = [`quality(${quality})`];
  if (blur) filters.push(`blur(${blur})`);
  // focal() only has an effect when the service is actually cropping (w AND h).
  if (focus && height > 0) filters.push(`focal(${focus})`);

  return `${base}/m/${width}x${height}/filters:${filters.join(":")}`;
}

/**
 * Custom next/image loader (§8). Wired up in next.config.ts.
 *
 * Next requests a width from its deviceSizes/imageSizes list; Storyblok does the
 * resizing, so Next never touches the bytes.
 */
export default function storyblokImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return buildStoryblokImageUrl(src, { width, quality: quality ?? 80 });
}

/** Tiny blurred variant used as blurDataURL (§8). */
export function buildBlurUrl(src: string): string | undefined {
  if (!isStoryblokAsset(src) || isSvgAsset(src)) return undefined;
  return buildStoryblokImageUrl(src, { width: 32, quality: 10, blur: 2 });
}
