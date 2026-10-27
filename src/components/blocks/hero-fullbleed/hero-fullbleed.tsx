import { storyblokEditable } from "@storyblok/react/rsc";

import { HeroImage } from "@/components/motion/hero-image";
import { LineReveal } from "@/components/motion/line-reveal";
import { Reveal } from "@/components/motion/reveal";
import { PhotoImage } from "@/components/photo/photo-image";
import { toLines } from "@/lib/text";
import { QUALITY } from "@/lib/storyblok/image-loader";
import { motionDisabled, overlayClass, toneClasses } from "@/lib/storyblok/editorial";
import type { HeroFullbleedStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * hero_fullbleed — editorial brief, page recipe #1.
 *
 * Image fills min-h-[85svh] (capped ~900px), headline bottom-left in large serif,
 * no buttons, small "Scroll" cue bottom-right.
 *
 * Server component. storyblokEditable sits on the outer <section> and the motion
 * wrappers live INSIDE it, so Visual Editor click-to-edit outlines keep working.
 *
 * Headline line breaks are authored, not measured: the editor writes the headline on
 * separate lines and each becomes a masked line.
 */
export function HeroFullbleed({
  blok,
  priority = true,
}: {
  blok: HeroFullbleedStoryblok;
  /** The first hero on a page is the LCP element. */
  priority?: boolean;
}) {
  const off = motionDisabled(blok.motion);
  const tone = toneClasses(blok.text_tone);
  const lines = toLines(blok.headline);

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative flex max-h-[900px] min-h-[85svh] items-end overflow-hidden"
    >
      {blok.image?.filename ? (
        <HeroImage disabled={off} className="absolute inset-0">
          <PhotoImage
            src={blok.image.filename}
            // §12: describe the scene, never a child's name.
            alt={blok.image_alt ?? ""}
            focus={blok.image.focus}
            sizes="hero"
            quality={QUALITY.large}
            priority={priority}
            fill
            className="h-full w-full"
            imageClassName="object-cover"
          />
        </HeroImage>
      ) : null}

      <div
        className={cn("absolute inset-0 bg-black", overlayClass(blok.overlay_strength))}
        aria-hidden="true"
      />

      {/* Scrim behind the text only — overlay alone cannot guarantee contrast. */}
      <div className={cn("absolute inset-x-0 bottom-0 h-1/2", tone.scrim)} aria-hidden="true" />

      <div className={cn("relative w-full px-5 pb-14 sm:px-8 sm:pb-20", tone.text)}>
        <div className="flex items-end justify-between gap-8">


        {blok.headline ? (
          <Reveal delay={off ? 0 : 0.2} y={12} disabled={off}>
            <h1 className="mt-5 text-2xl sm:text-4xl">{blok.subline}</h1>
          </Reveal>
        ) : null}


          {/* Scroll cue, bottom-right. Fades in after the headline. */}
          <Reveal
            delay={off ? 0 : 0.8}
            y={8}
            disabled={off}
            className="hidden shrink-0 pb-2 sm:block"
          >
            <span className="text-(length:--text-caption) tracking-[0.2em] uppercase opacity-70">
              Scroll
            </span>
          </Reveal>
        </div>

        {blok.subline ? (
          <Reveal delay={off ? 0 : 0.5} y={12} disabled={off}>
            <p className="mt-5 max-w-[42ch] text-base opacity-85 sm:text-lg">{blok.subline}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
