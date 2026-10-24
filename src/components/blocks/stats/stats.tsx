import { storyblokEditable } from "@storyblok/react/rsc";

import type { StatItemStoryblok, StatsStoryblok } from "@/lib/storyblok/types";

/** stats (architecture.md §4) — e.g. "120+ klasser fotograferet". */
export function Stats({ blok }: { blok: StatsStoryblok }) {
  const items = (blok.items ?? []) as StatItemStoryblok[];
  if (!items.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-14 sm:py-20">
      <dl className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
        {items.map((item) => (
          <div key={item._uid} {...storyblokEditable(item)}>
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block font-heading text-4xl text-brand-accent sm:text-5xl">
                {item.value}
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">{item.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
