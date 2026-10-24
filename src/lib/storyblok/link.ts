import type { MultilinkStoryblok } from "@/lib/storyblok/types";

/**
 * Turn a Storyblok multilink into an href.
 *
 * Storyblok stores internal links as "home", "weddings", "portfolio/foo" with no leading
 * slash, and uses "home" for the root story.
 */
export function resolveLink(link: MultilinkStoryblok | undefined | null): string | undefined {
  if (!link) return undefined;

  if (link.linktype === "email") {
    return link.email ? `mailto:${link.email}` : undefined;
  }

  if (link.linktype === "url" || link.linktype === "asset") {
    return link.url || link.cached_url || undefined;
  }

  const raw = link.story?.full_slug ?? link.cached_url ?? link.url;
  if (!raw) return undefined;

  if (/^https?:\/\//.test(raw)) return raw;

  const clean = raw.replace(/^\/+|\/+$/g, "");
  const path = clean === "" || clean === "home" ? "/" : `/${clean}`;

  return link.anchor ? `${path}#${link.anchor}` : path;
}
