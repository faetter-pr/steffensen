import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { CACHE_TAGS } from "@/lib/storyblok/fetch";

/**
 * Storyblok publish webhook → revalidateTag (architecture.md §9).
 *
 * Configure in Storyblok under Settings → Webhooks ("Story published"/"unpublished"):
 *   https://your-site/api/revalidate?secret=STORYBLOK_WEBHOOK_SECRET
 *
 * Storyblok POSTs { action, text, story_id, full_slug }.
 */

interface StoryblokWebhookPayload {
  action?: string;
  story_id?: number;
  full_slug?: string;
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.STORYBLOK_WEBHOOK_SECRET;

  if (!expected) {
    return NextResponse.json({ revalidated: false, reason: "not configured" }, { status: 501 });
  }

  if (searchParams.get("secret") !== expected) {
    return NextResponse.json({ revalidated: false, reason: "invalid secret" }, { status: 401 });
  }

  let payload: StoryblokWebhookPayload = {};
  try {
    payload = (await request.json()) as StoryblokWebhookPayload;
  } catch {
    // Storyblok sends a body on every real event; an empty one just means "flush broadly".
  }

  // A referenced package, testimonial or project can affect any cached page.
  const tags = new Set<string>([CACHE_TAGS.global, CACHE_TAGS.projects, CACHE_TAGS.content]);

  if (payload.full_slug) {
    tags.add(CACHE_TAGS.story(payload.full_slug));
    // The home story is fetched as "home" but published at the root.
    if (payload.full_slug === "home") tags.add(CACHE_TAGS.story(""));
  }

  // Next 16 requires a cacheLife profile. "max" purges the entry outright, which is what
  // a publish webhook wants. (updateTag is Server-Action-only and not usable here.)
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    revalidated: true,
    tags: [...tags],
    slug: payload.full_slug ?? null,
  });
}
