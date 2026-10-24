/**
 * Shared mappings for the editorial design
 * (docs/agent-prompt-editorial-portfolio.md).
 *
 * These translate Storyblok option values into classes/values. Keeping them here means
 * "medium overlay" means the same thing in every block.
 */

/** Overlay opacities, exactly as the brief specifies. */
export const OVERLAY_OPACITY: Record<string, string> = {
  none: "opacity-0",
  light: "opacity-15",
  medium: "opacity-30",
  strong: "opacity-50",
};

const OVERLAY_DEFAULT = "opacity-30";

export function overlayClass(strength: string | undefined): string {
  return OVERLAY_OPACITY[strength || "medium"] ?? OVERLAY_DEFAULT;
}

/**
 * Text colour for content laid over a photo.
 *
 * Returns the scrim class too: overlay alone cannot guarantee 4.5:1 across unpredictable
 * photography, so text always gets a gradient behind it as well.
 */
export function toneClasses(tone: string | undefined): { text: string; scrim: string } {
  return tone === "dark"
    ? { text: "text-brand-ink", scrim: "image-scrim-light" }
    : { text: "text-brand-on-image", scrim: "image-scrim" };
}

/** Aspect-ratio classes for the `aspect` option. */
export const ASPECT_CLASS: Record<string, string> = {
  auto: "",
  "3-2": "aspect-3/2",
  "16-9": "aspect-video",
  "4-5": "aspect-4/5",
};

export function aspectClass(aspect: string | undefined): string {
  return ASPECT_CLASS[aspect || "auto"] ?? "";
}

/** Max-height classes for image_full. */
export const MAX_HEIGHT_CLASS: Record<string, string> = {
  none: "",
  "70svh": "max-h-[70svh]",
  "90svh": "max-h-[90svh]",
};

export function maxHeightClass(value: string | undefined): string {
  return MAX_HEIGHT_CLASS[value || "none"] ?? "";
}

/** Gap classes. `frame` is the 2px default of this design. */
export const GAP_CLASS: Record<string, string> = {
  none: "gap-0",
  frame: "gap-frame",
  loose: "gap-2",
};

const GAP_DEFAULT = "gap-frame";

export function gapClass(gap: string | undefined): string {
  return GAP_CLASS[gap || "frame"] ?? GAP_DEFAULT;
}

/**
 * The per-block `motion: none` switch.
 *
 * Every block reads this and passes the result to its motion wrappers' `disabled` prop,
 * so an editor can silence one noisy block without affecting the rest of the page.
 */
export function motionDisabled(value: string | undefined): boolean {
  return value === "none";
}
