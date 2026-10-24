import { storyblokEditable } from "@storyblok/react/rsc";

import { MaskReveal } from "@/components/motion/mask-reveal";
import { ParallaxFrame } from "@/components/motion/parallax-frame";
import { PhotoImage } from "@/components/photo/photo-image";
import { motionDisabled } from "@/lib/storyblok/editorial";
import type { ImageItemStoryblok, ImagePairStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * image_pair — editorial brief, page recipe #4.
 *
 * `asymmetric`: left frame ~5/8 and tall; right column ~3/8 holding a short frame
 * stacked on a taller one, bottom-aligned. `equal` is a plain diptych.
 * Mobile: single column in every variant.
 *
 * Brief item 5: the two columns get slightly different parallax strengths. That small
 * difference is what creates depth — it needs no extra UI.
 */
export function ImagePair({ blok }: { blok: ImagePairStoryblok }) {
  const images = ((blok.images ?? []) as ImageItemStoryblok[]).filter((i) => i.asset?.filename);
  if (!images.length) return null;

  const off = motionDisabled(blok.motion);
  const variant = blok.variant || "equal";
  const mirrored = variant === "asymmetric-mirrored";
  const asymmetric = variant === "asymmetric" || mirrored;

  if (!asymmetric) {
    return (
      <section {...storyblokEditable(blok)} className="py-10 sm:py-14">
        <figure>
          <div className="grid grid-cols-1 gap-frame sm:grid-cols-2">
            {images.slice(0, 2).map((image, index) => (
              <MaskReveal key={image._uid} disabled={off} delay={index * 0.08}>
                <ParallaxFrame
                  disabled={off}
                  strength={index === 0 ? 0.06 : 0.1}
                  className="aspect-4/5"
                >
                  <Frame image={image} sizes="half" />
                </ParallaxFrame>
              </MaskReveal>
            ))}
          </div>
          <Caption text={blok.caption} />
        </figure>
      </section>
    );
  }

  const [large, ...rest] = images;
  if (!large) return null;

  return (
    <section {...storyblokEditable(blok)} className="py-10 sm:py-14">
      <figure>
        <div className="grid grid-cols-1 gap-frame md:grid-cols-8">
          {/* Left (or right, mirrored): 5/8, tall. */}
          <MaskReveal disabled={off} className={cn("md:col-span-5", mirrored && "md:order-2")}>
            <ParallaxFrame disabled={off} strength={0.06} className="aspect-4/5 md:h-full">
              <Frame image={large} sizes="asym-large" />
            </ParallaxFrame>
          </MaskReveal>

          {/* 3/8 column: short frame above a taller one, aligned to the bottom. */}
          <div
            className={cn(
              "grid gap-frame md:col-span-3 md:grid-rows-[4fr_5fr]",
              mirrored && "md:order-1",
            )}
          >
            {rest.slice(0, 2).map((image, index) => (
              <MaskReveal key={image._uid} disabled={off} delay={0.08 + index * 0.08}>
                <ParallaxFrame
                  disabled={off}
                  strength={0.11}
                  className={cn(
                    "h-full",
                    index === 0 ? "aspect-3/2 md:aspect-auto" : "aspect-4/5 md:aspect-auto",
                  )}
                >
                  <Frame image={image} sizes="asym-small" />
                </ParallaxFrame>
              </MaskReveal>
            ))}
          </div>
        </div>

        <Caption text={blok.caption} />
      </figure>
    </section>
  );
}

function Frame({ image, sizes }: { image: ImageItemStoryblok; sizes: string }) {
  return (
    <PhotoImage
      src={image.asset.filename}
      // §12: describe the activity, never a child's name.
      alt={image.alt ?? ""}
      focus={image.asset.focus}
      sizes={sizes}
      fill
      className="h-full w-full"
      imageClassName="object-cover"
    />
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <figcaption className="mt-2 px-5 text-(length:--text-caption) text-brand-muted sm:px-8">
      {text}
    </figcaption>
  );
}
