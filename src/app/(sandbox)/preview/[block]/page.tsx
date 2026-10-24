import { StoryblokServerComponent } from "@storyblok/react/rsc";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Importing the client module registers the block registry, which
// <StoryblokServerComponent> resolves against.
import "@/lib/storyblok/client";
import { getFixtureBlock, listFixtureKeys } from "@/mock/fixtures";

/**
 * Renders every fixture variant of one block, stacked (dev only).
 *
 * Each variant is wrapped in its own data-segment so the §13.2 accent shift is visible
 * side by side.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  if (process.env.NODE_ENV === "production") return [];
  return listFixtureKeys().map((block) => ({ block }));
}

export default async function PreviewBlockPage({ params }: PageProps<"/preview/[block]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { block: key } = await params;
  const block = getFixtureBlock(key);
  if (!block) notFound();

  return (
    <main className="py-10">
      <div className="container-content">
        <Link href="/preview" className="text-sm text-muted-foreground hover:text-foreground">
          ← Alle blokke
        </Link>

        <h1 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl">{block.label}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{key}</p>
        {block.notes ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {block.notes}
          </p>
        ) : null}
      </div>

      <div className="mt-12 space-y-16">
        {block.variants.map((variant, index) => (
          <section key={`${key}-${index}`}>
            <div className="container-content">
              <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
                <span className="text-xs font-medium tracking-widest uppercase">
                  {variant.name}
                </span>
                {variant.segment ? (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs">
                    data-segment={variant.segment}
                  </span>
                ) : null}
              </div>
            </div>

            {/* The wrapper carries the segment so accent theming renders per variant. */}
            <div className="mt-6" data-segment={variant.segment ?? undefined}>
              <StoryblokServerComponent blok={variant.blok} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
