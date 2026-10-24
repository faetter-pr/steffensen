import type { Metadata } from "next";

/**
 * Client / parent gallery — STUB (architecture.md §12).
 *
 * Deliberately not implemented. §15.2 is still open: build in-house, or delegate to a
 * hosted gallery/delivery service. That decision comes before any code here.
 *
 * Whatever is chosen, §12 is non-negotiable:
 *   - gallery code → SERVER-SIDE validation → signed, expiring cookie
 *   - noindex, Cache-Control: private, never in the sitemap
 *   - private galleries must NOT live in Storyblok's public CDN
 *   - a defined retention period, stated on the privacy page
 *
 * The headers below are already correct, so the route cannot leak if someone links it
 * before the feature lands. See lib/gallery-auth.ts.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

// Never prerender or cache a private route.
export const dynamic = "force-dynamic";

export default async function GalleryPage({ params }: PageProps<"/gallery/[code]">) {
  // The code is intentionally unused. No lookup exists yet, and rendering it into the
  // page would be the first step toward a response that differs between a real code and
  // a guessed one. Every code gets this identical page.
  //
  // (The value still appears in Next's RSC routing payload, as route params always do.
  // That is not a disclosure: the visitor supplied it in their own URL, and the response
  // is byte-identical either way, so it reveals nothing about validity.)
  await params;

  return (
    <main className="container-content flex min-h-[60vh] flex-col justify-center py-24">
      <h1 className="max-w-xl font-heading text-3xl leading-tight text-balance sm:text-4xl">
        Galleriet er ikke klar endnu.
      </h1>

      <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
        Billedgallerier til forældre og kunder er under opbygning. Har du fået en kode, så kontakt
        mig, indtil galleriet åbner.
      </p>
    </main>
  );
}
