"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

import { DURATION, EASE, VIEWPORT } from "@/lib/motion";

/**
 * A single line of words separated by hairlines that draw in on entry
 * (brief item 9: scaleX from 0, origin left).
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * scaleX is a transform, so the hairlines cannot cause layout shift as they draw.
 */
export function ProcessLine({ words, disabled = false }: { words: string[]; disabled?: boolean }) {
  const visible = words.filter(Boolean);
  if (!visible.length) return null;

  return (
    <ol className="flex flex-wrap items-center gap-x-4 gap-y-3 text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase">
      {visible.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <li>{word}</li>

          {index < visible.length - 1 ? (
            <li aria-hidden="true" className="w-8 sm:w-12">
              {disabled ? (
                <span className="hairline block" />
              ) : (
                <motion.span
                  className="hairline block origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: DURATION.base,
                    ease: EASE,
                    delay: 0.1 + index * 0.12,
                  }}
                />
              )}
            </li>
          ) : null}
        </Fragment>
      ))}
    </ol>
  );
}
