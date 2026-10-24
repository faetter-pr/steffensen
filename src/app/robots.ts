import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt (architecture.md §11).
 *
 * §12: /gallery is explicitly disallowed. The gallery routes also send noindex headers —
 * robots.txt alone is advisory and does not stop indexing of a linked URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gallery", "/gallery/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
