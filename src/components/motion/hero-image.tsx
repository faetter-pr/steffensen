"use client";

import { motion, useReducedMotion } from "motion/react";

import { DURATION, EASE } from "@/lib/motion";

/**
 * Hero image settle: scale 1.06 → 1 over ~1.6s.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * TRANSFORM ONLY. The hero image is the LCP element, and animating its opacity would
 * delay the largest paint — the brief calls this out explicitly. The image is painted
 * fully opaque on the first frame and only scales.
 */
export function HeroImage({
  children,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (disabled || prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{ duration: DURATION.hero, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
