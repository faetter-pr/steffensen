"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { PhotoImage } from "@/components/photo/photo-image";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * One panel of the segment chooser.
 *
 * Layer 2: plain props, no Storyblok imports — the block unwraps the blok and the
 * `editable` attributes are passed through as a plain object.
 *
 * Hover (desktop only, brief item 3): image scales to ~1.04 over 0.8s and the arrow
 * nudges up-right. Sibling dimming is done in CSS with group-hover on the parent list
 * rather than in JS, so it costs nothing and cannot desync.
 *
 * Scale and translate only — never width/height/top/left.
 */

const OVERLAY: Record<string, string> = {
  none: "opacity-0",
  light: "opacity-15",
  medium: "opacity-30",
  strong: "opacity-50",
};

export interface SegmentPanelProps {
  href: string;
  label: string;
  src: string;
  alt: string;
  focus?: string | null;
  segment?: string;
  overlayStrength?: string;
  textTone?: string;
  /** storyblokEditable() output, spread onto the element. */
  editable?: Record<string, unknown>;
  disabled?: boolean;
}

export function SegmentPanel({
  href,
  label,
  src,
  alt,
  focus,
  segment,
  overlayStrength,
  textTone,
  editable,
  disabled = false,
}: SegmentPanelProps) {
  const dark = textTone === "dark";
  const overlay = OVERLAY[overlayStrength || "medium"] ?? OVERLAY.medium;

  const content = (
    <Link
      href={href}
      data-segment={segment}
      className="group/panel relative block h-[55svh] overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring md:h-[60svh]"
    >
      {/*
        The image is scaled on hover, not the panel, so neighbouring panels never move.
        motion-safe: the transition is dropped entirely under reduced motion.
      */}
      <div className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/panel:scale-[1.04]">
        <PhotoImage
          src={src}
          alt={alt}
          focus={focus}
          // Panels crop hard, so the focus point matters more here than anywhere.
          sizes="third"
          fill
          className="h-full w-full"
          imageClassName="object-cover"
        />
      </div>

      <div className={cn("absolute inset-0 bg-black", overlay)} aria-hidden="true" />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-2/3",
          dark ? "image-scrim-light" : "image-scrim",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7",
          dark ? "text-brand-ink" : "text-brand-on-image",
        )}
      >
        <span className="font-heading text-(length:--text-label) leading-tight font-light">
          {label}
        </span>

        <ArrowUpRight
          className="size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover/panel:translate-x-1 motion-safe:group-hover/panel:-translate-y-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );

  if (disabled) {
    return <li {...editable}>{content}</li>;
  }

  return (
    <motion.li {...editable} variants={fadeUp}>
      {content}
    </motion.li>
  );
}
