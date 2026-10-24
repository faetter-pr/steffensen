"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { PARALLAX_STRENGTH } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Image taller than its frame, translated on scroll.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * The inner element is scaled up by the parallax strength so that translating it never
 * exposes an edge. Only `transform` is animated, so this stays off the layout path.
 *
 * useReducedMotion is checked explicitly here rather than relying on MotionConfig:
 * the scroll transform is driven by a MotionValue, which MotionConfig's reducedMotion
 * handling does not intercept.
 */

export interface ParallaxFrameProps {
  children: React.ReactNode;
  /** Fraction of frame height to travel. Brief suggests 6-10%. */
  strength?: number;
  className?: string;
  disabled?: boolean;
}

export function ParallaxFrame({
  children,
  strength = PARALLAX_STRENGTH,
  className,
  disabled = false,
}: ParallaxFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const percent = strength * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${percent / 2}%`, `${percent / 2}%`]);

  const off = disabled || prefersReduced;

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="h-full w-full will-change-transform"
        style={
          off
            ? undefined
            : {
                y,
                // Overscale so the translated edges never show.
                scale: 1 + strength,
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
