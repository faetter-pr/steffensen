import { storyblokEditable } from "@storyblok/react/rsc";

import { Reveal } from "@/components/motion/reveal";
import { PhotoImage } from "@/components/photo/photo-image";
import { motionDisabled, overlayClass, toneClasses } from "@/lib/storyblok/editorial";
import { QUALITY } from "@/lib/storyblok/image-loader";
import type { QuoteStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * quote — editorial brief, page recipe #5.
 *
 * `over-image`: full-bleed image with a centred italic serif quote and small
 * attribution beneath. `plain` keeps it typographic on the page background.
 *
 * Brief item 6: the quote fades up as a unit, not per word or line.
 */
export function Quote({ blok }: { blok: QuoteStoryblok }) {
  if (!blok.text) return null;

  const off = motionDisabled(blok.motion);
  const overImage = blok.variant === "over-image" && Boolean(blok.image?.filename);

  if (!overImage) {
    return (
      <section {...storyblokEditable(blok)} className="container-content py-20 sm:py-28">
        <Reveal disabled={off}>
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="font-heading text-2xl leading-snug font-light text-balance italic sm:text-3xl">
              <p>{blok.text}</p>
            </blockquote>
            {blok.attribution ? (
              <figcaption className="mt-6 text-(length:--text-caption) tracking-[0.15em] text-brand-muted uppercase">
                {blok.attribution}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      </section>
    );
  }

  const tone = toneClasses(blok.text_tone);

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative flex min-h-[70svh] items-center overflow-hidden"
    >
      <PhotoImage
        src={blok.image?.filename ?? ""}
        alt={blok.image_alt ?? ""}
        focus={blok.image?.focus}
        sizes="full-bleed"
        quality={QUALITY.large}
        fill
        className="absolute inset-0 h-full w-full"
        imageClassName="object-cover"
      />

      <div
        className={cn("absolute inset-0 bg-black", overlayClass(blok.overlay_strength))}
        aria-hidden="true"
      />

      <Reveal disabled={off} className="relative w-full px-5 sm:px-8">
        <figure className={cn("mx-auto max-w-3xl text-center", tone.text)}>
          <blockquote className="font-heading text-2xl leading-snug font-light text-balance italic sm:text-4xl">
            <p>{blok.text}</p>
          </blockquote>
          {blok.attribution ? (
            <figcaption className="mt-6 text-(length:--text-caption) tracking-[0.15em] uppercase opacity-80">
              {blok.attribution}
            </figcaption>
          ) : null}
        </figure>
      </Reveal>
    </section>
  );
}
