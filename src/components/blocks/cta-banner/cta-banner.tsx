import { storyblokEditable } from "@storyblok/react/rsc";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { motionDisabled } from "@/lib/storyblok/editorial";
import { resolveLink } from "@/lib/storyblok/link";
import type { CtaBannerStoryblok } from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * cta_banner — editorial brief, page recipe #8.
 *
 * `minimal` (default): one serif sentence and one underlined text link with an arrow.
 * No button fill, no card. The underline draws from the left on hover (brief item 10),
 * done in CSS via .link-underline.
 *
 * `filled` keeps a solid band for the rare page that needs more weight.
 */
export function CtaBanner({ blok }: { blok: CtaBannerStoryblok }) {
  const href = resolveLink(blok.cta_link);
  const off = motionDisabled(blok.motion);
  const filled = blok.variant === "filled";

  const body = (
    <Reveal disabled={off} className="container-content">
      <div className={cn("mx-auto max-w-3xl", filled ? "text-center" : "")}>
        <h2
          className={cn(
            "font-heading text-3xl leading-tight font-light text-balance sm:text-4xl",
            filled && "text-brand-on-image",
          )}
        >
          {blok.headline}
        </h2>

        {blok.text ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-pretty",
              filled ? "mx-auto text-brand-on-image/85" : "text-brand-muted",
            )}
          >
            {blok.text}
          </p>
        ) : null}

        {blok.cta_label && href ? (
          <p className="mt-8">
            <Link
              href={href}
              className={cn(
                "link-underline group inline-flex items-center gap-2 text-lg",
                filled ? "text-brand-on-image" : "text-brand-accent-ink",
              )}
            >
              {blok.cta_label}
              <ArrowRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </p>
        ) : null}
      </div>
    </Reveal>
  );

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn("py-24 sm:py-32", filled && "bg-brand-ink")}
    >
      {body}
    </section>
  );
}
