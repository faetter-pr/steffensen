import { storyblokEditable } from "@storyblok/react/rsc";

import { PhotoImage } from "@/components/photo/photo-image";
import type { ImageItemStoryblok, LogoStripStoryblok } from "@/lib/storyblok/types";

/**
 * logo_strip (architecture.md §4) — institutions already worked with.
 *
 * §4 is explicit: only with permission. The Storyblok field carries that reminder.
 */
export function LogoStrip({ blok }: { blok: LogoStripStoryblok }) {
  const logos = (blok.logos ?? []) as ImageItemStoryblok[];
  if (!logos.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-12 sm:py-16">
      {blok.headline ? (
        <h2 className="text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {blok.headline}
        </h2>
      ) : null}

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {logos.map((logo) => (
          <li key={logo._uid} {...storyblokEditable(logo)}>
            <PhotoImage
              src={logo.asset?.filename ?? ""}
              alt={logo.alt ?? ""}
              sizes="thumb"
              height={40}
              className="w-auto"
              imageClassName="h-10 w-auto object-contain opacity-60 grayscale"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
