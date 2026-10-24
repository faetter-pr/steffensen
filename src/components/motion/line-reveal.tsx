"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

import { DURATION, EASE, VIEWPORT } from "@/lib/motion";

/**
 * Headline split into lines, each masked and sliding up with a stagger.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Lines are passed in explicitly rather than measured, because measuring wrapped text
 * requires a layout pass and would either flash unstyled text or shift. The editor
 * controls the break by writing the headline as separate lines.
 *
 * Each line keeps its own `overflow-hidden` wrapper — that is the mask.
 */

export interface LineRevealProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Per-line delay, seconds. */
  stagger?: number;
  delay?: number;
  disabled?: boolean;
}

export function LineReveal({
  lines,
  as: Component = "h1",
  className,
  stagger = 0.09,
  delay = 0,
  disabled = false,
}: LineRevealProps) {
  if (disabled) {
    return (
      <Component className={className}>
        {lines.map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={VIEWPORT}
            transition={{
              duration: DURATION.slow,
              ease: EASE,
              delay: delay + index * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
