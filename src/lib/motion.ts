import type { Transition, Variants } from "motion/react";

/**
 * Shared motion tokens (docs/agent-prompt-editorial-portfolio.md → Motion).
 *
 * Nothing in a component hard-codes a duration or easing — it comes from here, so the
 * whole site can be re-timed in one place.
 *
 * Design intent: "Motion is slow and quiet. It reveals images; it never decorates."
 */

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 1.1,
  /** Hero image scale settle — longer than `slow` on purpose. */
  hero: 1.6,
} as const;

/** One custom ease-out used everywhere. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE },
  base: { duration: DURATION.base, ease: EASE },
  slow: { duration: DURATION.slow, ease: EASE },
} satisfies Record<string, Transition>;

/**
 * Shared viewport config. `once: true` — the brief is explicit that nothing animates
 * more than the first time a section is seen.
 */
export const VIEWPORT = { once: true, margin: "-10%" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION.base },
};

/**
 * Clip-path reveal for large frames. Animating clip-path (not width/height) keeps this
 * off the layout path, so it cannot cause shift.
 */
export const maskUp: Variants = {
  hidden: { clipPath: "inset(8% 0 0 0)" },
  visible: { clipPath: "inset(0% 0 0 0)", transition: TRANSITION.slow },
};

/** Headline lines rising out of a mask. */
export const lineUp: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: TRANSITION.slow },
};

/** Parent that staggers its children. */
export function staggerParent(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Default parallax strength as a fraction of frame height (brief: 6-10%). */
export const PARALLAX_STRENGTH = 0.08;
