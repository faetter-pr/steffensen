"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

import { Lightbox, type LightboxItem } from "@/components/photo/lightbox";
import { PhotoImage } from "@/components/photo/photo-image";
import { VIEWPORT, fadeUp, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Clickable image grid / masonry that opens the lightbox.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Each tile carries a `layoutId` so the lightbox can run a shared-element transition
 * from the clicked thumbnail (brief item 7). The id is scoped with useId so two grids
 * on one page cannot collide.
 */

const COLUMN_CLASS: Record<string, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

const MASONRY_COLUMN_CLASS: Record<string, string> = {
  "2": "sm:columns-2",
  "3": "sm:columns-2 lg:columns-3",
  "4": "sm:columns-2 lg:columns-4",
};

const ASPECT_CLASS: Record<string, string> = {
  square: "aspect-square",
  portrait: "aspect-3/4",
  landscape: "aspect-4/3",
  original: "",
};

interface PhotoGridProps {
  items: LightboxItem[];
  variant?: "grid" | "masonry";
  columns?: string;
  /** Pre-resolved gap class, e.g. "gap-frame". */
  gapClassName?: string;
  aspect?: string;
  /**
   * A sizes preset name or raw sizes string, passed straight to <PhotoImage>.
   * Typed as string rather than importing SizesPreset, because that type lives in
   * lib/storyblok/ and layer 2 must not reach into the CMS layer (CLAUDE.md).
   */
  sizes?: string;
  /** The editorial design uses square corners everywhere. */
  rounded?: boolean;
  showCaptions?: boolean;
  disabled?: boolean;
}

export function PhotoGrid({
  items,
  variant = "grid",
  columns = "3",
  gapClassName = "gap-frame",
  aspect = "square",
  sizes,
  rounded = false,
  showCaptions = false,
  disabled = false,
}: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scope = useId();

  if (!items.length) return null;

  const isMasonry = variant === "masonry";
  const aspectClass = isMasonry ? "" : (ASPECT_CLASS[aspect] ?? ASPECT_CLASS.square);
  const layoutIdFor = (index: number) => `${scope}-photo-${index}`;

  const tiles = items.map((item, index) => (
    <motion.li
      key={`${item.src}-${index}`}
      layoutId={disabled ? undefined : layoutIdFor(index)}
      variants={disabled ? undefined : fadeUp}
      className={cn(isMasonry && "mb-[2px] break-inside-avoid")}
    >
      <button
        type="button"
        onClick={() => setOpenIndex(index)}
        aria-label={`Åbn billede: ${item.alt}`}
        className={cn(
          "group block w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring",
          rounded && "rounded-md",
        )}
      >
        <PhotoImage
          src={item.src}
          alt={item.alt}
          focus={item.focus}
          sizes={sizes ?? (isMasonry ? "masonry" : "third")}
          className={cn("h-full w-full", aspectClass)}
          imageClassName={cn(
            "h-full w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.03]",
            aspectClass && "object-cover",
          )}
        />
      </button>

      {showCaptions && item.caption ? (
        <p className="mt-2 text-(length:--text-caption) text-brand-muted">{item.caption}</p>
      ) : null}
    </motion.li>
  ));

  const listClass = cn(
    isMasonry
      ? ["columns-1", MASONRY_COLUMN_CLASS[columns] ?? MASONRY_COLUMN_CLASS["3"]]
      : ["grid grid-cols-1", COLUMN_CLASS[columns] ?? COLUMN_CLASS["3"]],
    gapClassName,
  );

  return (
    <>
      {disabled ? (
        <ul className={listClass}>{tiles}</ul>
      ) : (
        <motion.ul
          className={listClass}
          variants={staggerParent(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {tiles}
        </motion.ul>
      )}

      <Lightbox
        items={items}
        openIndex={openIndex}
        onOpenChange={setOpenIndex}
        layoutIdFor={disabled ? undefined : layoutIdFor}
      />
    </>
  );
}
