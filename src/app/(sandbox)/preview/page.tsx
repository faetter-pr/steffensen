import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FIXTURE_BLOCKS, listFixtureKeys } from "@/mock/fixtures";

/**
 * Design sandbox index (dev only).
 *
 * Lists every block that has fixtures, so blocks can be built and reviewed before a
 * Storyblok space exists. Add an entry to src/mock/fixtures.json and it shows up here.
 */

export const metadata: Metadata = {
  title: "Design sandbox",
  robots: { index: false, follow: false },
};

export default function PreviewIndex() {
  // Never expose the sandbox outside development.
  if (process.env.NODE_ENV === "production") notFound();

  const keys = listFixtureKeys();

  return (
    <main className="container-content py-16 sm:py-24">
      <p className="text-xs font-medium tracking-widest text-brand-accent-ink uppercase">
        Kun i udvikling
      </p>

      <h1 className="mt-4 max-w-2xl font-heading text-4xl leading-tight text-balance sm:text-5xl">
        Design sandbox
      </h1>

      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Blokke renderet fra{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">src/mock/fixtures.json</code> uden
        Storyblok. Billeder vises som farvede felter i det rigtige format.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {keys.map((key) => {
          const block = FIXTURE_BLOCKS[key];
          if (!block) return null;

          return (
            <li key={key}>
              <Link
                href={`/preview/${key}`}
                className="group block rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-accent"
              >
                <p className="font-medium">{block.label}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{key}</p>
                {block.notes ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {block.notes}
                  </p>
                ) : null}
                <p className="mt-4 text-sm text-brand-accent-ink">
                  {block.variants.length} {block.variants.length === 1 ? "variant" : "varianter"} →
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {keys.length === 0 ? (
        <p className="mt-12 text-muted-foreground">Ingen fixtures endnu.</p>
      ) : null}
    </main>
  );
}
