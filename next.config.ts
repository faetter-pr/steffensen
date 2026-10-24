import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * create-next-app turns `cacheComponents` on by default. It is off here.
   *
   * architecture.md §9 specifies static generation via generateStaticParams plus
   * tag-based revalidation from a publish webhook. Cache Components replaces that
   * with an explicit "use cache" model, and because draftMode() (a dynamic API) is
   * read inside the shared fetch helpers, enabling it would push every route into
   * dynamic rendering unless each one is restructured around Suspense boundaries.
   *
   * Revisit in phase 6 if the caching model is worth migrating.
   */
  cacheComponents: false,
  // partialPrefetching requires cacheComponents, so it is off too. Both come back
  // together if the caching model is migrated in phase 6.

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    // architecture.md §8 — Storyblok's Image Service does the resizing, not Next.
    loader: "custom",
    loaderFile: "./src/lib/storyblok/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "a-us.storyblok.com" },
      { protocol: "https", hostname: "a-ap.storyblok.com" },
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
