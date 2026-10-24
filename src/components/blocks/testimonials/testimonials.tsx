import { storyblokEditable } from "@storyblok/react/rsc";

import { Reveal } from "@/components/motion/reveal";
import { motionDisabled } from "@/lib/storyblok/editorial";
import {
  type TestimonialStoryblok,
  type TestimonialsStoryblok,
  resolveRefs,
} from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * testimonials — quiet typographic quotes, not cards.
 *
 * Hairline above each quote, serif body, small uppercase attribution. No borders,
 * fills or portraits: the brief's "no cards" rule applies, and a row of circular
 * headshots reads as a template, which is exactly the feel to avoid.
 *
 * The `portrait` field stays in the schema (removing it would destroy editor content)
 * but is deliberately not rendered here. §12 would also apply if it were: portraits
 * must be of adults, never children.
 */
export function Testimonials({ blok }: { blok: TestimonialsStoryblok }) {
  const testimonials = resolveRefs<TestimonialStoryblok>(blok.testimonials);
  if (!testimonials.length) return null;

  const off = motionDisabled(blok.motion);
  const single = blok.layout === "single";

  return (
    <section {...storyblokEditable(blok)} className="container-content py-20 sm:py-28">
      {blok.headline ? (
        <h2 className="text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase">
          {blok.headline}
        </h2>
      ) : null}

      <ul
        className={cn(
          "mt-10 grid gap-x-10 gap-y-12",
          single ? "max-w-3xl" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {testimonials.map((entry, index) => {
          const item = entry.content;
          const attribution = [item.name, item.role, item.organisation].filter(Boolean).join(" · ");

          return (
            <Reveal
              key={entry.uuid}
              as="li"
              delay={index * 0.07}
              disabled={off}
              className="border-t border-brand-line pt-6"
            >
              <figure>
                <blockquote
                  className={cn(
                    "font-heading leading-snug font-light text-pretty",
                    single ? "text-2xl sm:text-3xl" : "text-xl",
                  )}
                >
                  <p>{item.quote}</p>
                </blockquote>

                {attribution ? (
                  <figcaption className="mt-5 text-(length:--text-caption) tracking-[0.15em] text-brand-muted uppercase">
                    {attribution}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
