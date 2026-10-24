import type { Metadata } from "next";

import { buildStoryblokImageUrl, isStoryblokAsset } from "@/lib/storyblok/image-loader";
import { type GlobalSettingsStoryblok, type SeoStoryblok, firstSeo } from "@/lib/storyblok/types";

/**
 * Metadata helpers (architecture.md §11). JSON-LD (LocalBusiness / ImageGallery / Service)
 * lands in phase 6 alongside the rest of the SEO work.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const DEFAULT_SITE_NAME = "Steffensen Foto";

interface BuildMetadataArgs {
  seo?: SeoStoryblok;
  fallbackTitle?: string;
  fallbackDescription?: string;
  /** Storyblok asset URL used for the OG image when seo.og_image is empty. */
  coverUrl?: string;
  path?: string;
  global?: GlobalSettingsStoryblok | null;
}

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  coverUrl,
  path = "/",
  global,
}: BuildMetadataArgs): Metadata {
  const siteName = global?.site_name || DEFAULT_SITE_NAME;
  // Storyblok models "max 1 blok" fields as arrays.
  const defaults = firstSeo(global?.default_seo);

  const title = seo?.title || fallbackTitle || defaults?.title || siteName;
  const description = seo?.description || fallbackDescription || defaults?.description || undefined;

  const rawOg = seo?.og_image || coverUrl || defaults?.og_image;
  const ogImage =
    rawOg && isStoryblokAsset(rawOg)
      ? buildStoryblokImageUrl(rawOg, { width: 1200, height: 630, quality: 85 })
      : rawOg;

  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "da_DK",
      siteName,
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitter_title || title,
      description: seo?.twitter_description || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/** Slug → public path. Storyblok's "home" story lives at "/". */
export function slugToPath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  if (clean === "" || clean === "home") return "/";
  return `/${clean}`;
}
