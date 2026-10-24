"use client";

import { motion } from "motion/react";

import { DURATION, EASE, VIEWPORT } from "@/lib/motion";

/**
 * Clip-path inset reveal for large frames.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Uses clip-path rather than opacity or height: the image is painted at full opacity
 * from the first frame, which matters because these wrap the biggest images on the page
 * and opacity-fading them would damage LCP (brief: "Never let hero or full-bleed frames
 * start at opacity: 0").
 */

export interface MaskRevealProps {
  children: React.ReactNode;
  /** Starting inset, as a percentage of height. */
  from?: number;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function MaskReveal({
  children,
  from = 8,
  delay = 0,
  className,
  disabled = false,
}: MaskRevealProps) {
  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: `inset(${from}% 0 0 0)` }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
