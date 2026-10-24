import { storyblokEditable } from "@storyblok/react/rsc";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { motionDisabled } from "@/lib/storyblok/editorial";
import { resolveLink } from "@/lib/storyblok/link";
import {
  type IncludedItemStoryblok,
  type PackageCardsStoryblok,
  type PackageStoryblok,
  resolveRefs,
} from "@/lib/storyblok/types";
import { cn } from "@/lib/utils";

/**
 * package_cards — presented as a quiet typographic list, not cards.
 *
 * The block keeps its Storyblok technical name (the brief is explicit that names stay
 * as the spec has them) but the rendering is now hairline-separated columns: no
 * borders, no fills, no shadows, no badge pills.
 *
 * `highlight` is still honoured — as a small lettered marker and slightly stronger
 * type, rather than a coloured box.
 *
 * `packages` is a reference field; resolveRefs() keeps only entries the fetch actually
 * resolved via resolve_relations (§7), so an unresolved field renders nothing.
 */

const PRICE_UNIT_LABEL: Record<string, string> = {
  per_child: "pr. barn",
  per_class: "pr. klasse",
  flat: "samlet",
};

export function PackageCards({ blok }: { blok: PackageCardsStoryblok }) {
  const packages = resolveRefs<PackageStoryblok>(blok.packages);
  if (!packages.length) return null;

  const off = motionDisabled(blok.motion);

  return (
    <section {...storyblokEditable(blok)} className="container-content py-20 sm:py-28">
      {blok.headline ? (
        <h2 className="text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase">
          {blok.headline}
        </h2>
      ) : null}

      {blok.intro ? (
        <p className="mt-4 max-w-xl text-pretty text-brand-muted">{blok.intro}</p>
      ) : null}

      <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
        {packages.map((entry, index) => {
          const pkg = entry.content;
          const href = resolveLink(pkg.cta_link);
          const included = (pkg.included ?? []) as IncludedItemStoryblok[];

          return (
            <Reveal
              key={entry.uuid}
              as="li"
              delay={index * 0.07}
              disabled={off}
              className="flex flex-col border-t border-brand-line pt-6"
            >
              <h3
                className={cn(
                  "font-heading text-2xl font-light",
                  pkg.highlight && "text-brand-accent-ink",
                )}
              >
                {pkg.title}
                {pkg.highlight ? (
                  <span className="ml-2 align-middle text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase">
                    Mest valgt
                  </span>
                ) : null}
              </h3>

              {pkg.description ? (
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">{pkg.description}</p>
              ) : null}

              {pkg.price_from ? (
                <p className="mt-6">
                  <span className="text-sm text-brand-muted">fra </span>
                  <span className="font-heading text-2xl font-light">{pkg.price_from}</span>
                  {pkg.price_unit ? (
                    <span className="text-sm text-brand-muted">
                      {" "}
                      {PRICE_UNIT_LABEL[pkg.price_unit] ?? pkg.price_unit}
                    </span>
                  ) : null}
                </p>
              ) : null}

              {included.length ? (
                <ul className="mt-6 space-y-2 text-sm">
                  {included.map((item) => (
                    <li key={item._uid} className="text-brand-muted">
                      {item.text}
                    </li>
                  ))}
                </ul>
              ) : null}

              {pkg.cta_label && href ? (
                <p className="mt-8">
                  <Link
                    href={href}
                    className="link-underline group inline-flex items-center gap-2 text-sm text-brand-accent-ink"
                  >
                    {pkg.cta_label}
                    <ArrowRight
                      className="size-3.5 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </p>
              ) : null}
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
