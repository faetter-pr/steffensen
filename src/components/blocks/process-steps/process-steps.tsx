import { storyblokEditable } from "@storyblok/react/rsc";

import { ProcessLine } from "@/components/motion/process-line";
import { Reveal } from "@/components/motion/reveal";
import { motionDisabled } from "@/lib/storyblok/editorial";
import type { ProcessStepStoryblok, ProcessStepsStoryblok } from "@/lib/storyblok/types";

/**
 * process_steps — editorial brief, page recipe #7.
 *
 * `line` (default): one thin horizontal line of words separated by short hairlines,
 * 11px, muted. Explicitly NOT numbered cards — the brief calls that out by name.
 * `numbered` keeps the older stepped layout for pages that genuinely need detail.
 *
 * Brief item 9: the hairlines draw in (scaleX from 0, origin left) as the section
 * enters view.
 */
export function ProcessSteps({ blok }: { blok: ProcessStepsStoryblok }) {
  const steps = (blok.steps ?? []) as ProcessStepStoryblok[];
  if (!steps.length) return null;

  const off = motionDisabled(blok.motion);

  if (blok.variant === "numbered") {
    return (
      <section {...storyblokEditable(blok)} className="container-content py-16 sm:py-24">
        {blok.headline ? (
          <h2 className="mb-10 text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase">
            {blok.headline}
          </h2>
        ) : null}

        <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal
              key={step._uid}
              as="li"
              delay={index * 0.06}
              disabled={off}
              className="border-t border-brand-line pt-5"
            >
              <span
                className="text-(length:--text-caption) tracking-[0.2em] text-brand-muted"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light">{step.title}</h3>
              {step.description ? (
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{step.description}</p>
              ) : null}
            </Reveal>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      <ProcessLine words={steps.map((step) => step.title)} disabled={off} />
    </section>
  );
}
