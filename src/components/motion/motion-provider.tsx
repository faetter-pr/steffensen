"use client";

import { MotionConfig } from "motion/react";

import { TRANSITION } from "@/lib/motion";

/**
 * Wraps the app in shared motion defaults.
 *
 * `reducedMotion="user"` makes Motion respect prefers-reduced-motion globally: transform
 * and layout animations are dropped, opacity is kept. That is the single most important
 * line for the brief's accessibility bar — every primitive inherits it rather than each
 * re-implementing the check.
 *
 * Layer 2: no Storyblok imports.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={TRANSITION.base}>
      {children}
    </MotionConfig>
  );
}
