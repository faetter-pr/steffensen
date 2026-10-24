import { storyblokEditable } from "@storyblok/react/rsc";

import { Reveal } from "@/components/motion/reveal";
import { motionDisabled } from "@/lib/storyblok/editorial";
import type { TrustBarStoryblok, TrustItemStoryblok } from "@/lib/storyblok/types";

/**
 * trust_bar — a single quiet line of short statements.
 *
 * The brief forbids icon grids ("No cards, drop shadows, boxed callouts or icon grids")
 * and asks for trust_bar as "a single line of short statements", so the `icon` field in
 * the schema is intentionally NOT rendered. It stays in the schema because the numbered
 * process variant and a future filled layout may want it, and removing a field that
 * editors may already have filled is destructive.
 *
 * §2 still applies: institutions need to see professionalism before pretty pictures.
 * This design makes that point with restraint rather than checkmarks.
 */
export function TrustBar({ blok }: { blok: TrustBarStoryblok }) {
  const items = (blok.items ?? []) as TrustItemStoryblok[];
  if (!items.length) return null;

  const off = motionDisabled(blok.motion);

  return (
    <section {...storyblokEditable(blok)} className="border-y border-brand-line">
      <Reveal disabled={off} className="container-content py-6">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-(length:--text-caption) tracking-[0.12em] text-brand-muted uppercase">
          {items.map((item) => (
            <li key={item._uid} {...storyblokEditable(item)}>
              {item.text}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
