"use client";

import { EASE, VIEWPORT } from "@/lib/motion";
import { MOTION_TAGS, type MotionTag } from "@/components/motion/motion-tags";

/**
 * Fades and lifts children into view, once.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * `disabled` is wired to the per-block `motion: none` field so editors can switch
 * animation off for a single block — it renders a plain element with no motion
 * wrapper at all, rather than animating to a no-op.
 */

export interface RevealProps {
  children: React.ReactNode;
  /** Seconds. */
  delay?: number;
  /** Pixels to travel. */
  y?: number;
  as?: MotionTag;
  className?: string;
  disabled?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
  disabled = false,
}: RevealProps) {
  if (disabled) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = MOTION_TAGS[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}
