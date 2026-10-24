"use client";

import { MOTION_TAGS, type MotionTag } from "@/components/motion/motion-tags";
import { VIEWPORT, fadeUp, staggerParent } from "@/lib/motion";

/**
 * Parent/child variants for rows of frames.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Usage:
 *   <Stagger as="ul">
 *     <StaggerItem as="li">…</StaggerItem>
 *   </Stagger>
 */

export interface StaggerProps {
  children: React.ReactNode;
  as?: MotionTag;
  className?: string;
  /** Seconds between children. */
  stagger?: number;
  delay?: number;
  disabled?: boolean;
}

export function Stagger({
  children,
  as = "div",
  className,
  stagger = 0.08,
  delay = 0,
  disabled = false,
}: StaggerProps) {
  if (disabled) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = MOTION_TAGS[as];

  return (
    <Component
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  as?: MotionTag;
  className?: string;
  disabled?: boolean;
}

export function StaggerItem({
  children,
  as = "div",
  className,
  disabled = false,
}: StaggerItemProps) {
  if (disabled) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = MOTION_TAGS[as];

  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
