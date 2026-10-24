import { motion } from "motion/react";

/**
 * Stable motion components for the element types the primitives support.
 *
 * These MUST be created once at module scope. Calling `motion.create(tag)` inside a
 * render produces a brand-new component type on every render, which React treats as a
 * different component — remounting it and resetting its state (and its animation).
 *
 * `motion.div` and friends are already memoised proxies, so indexing this map is free.
 */
export const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  figure: motion.figure,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

export type MotionTag = keyof typeof MOTION_TAGS;
