import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Next draft mode for the Storyblok Visual Editor (architecture.md §9).
 *
 * Set the preview URL in Storyblok to:
 *   https://your-site/api/draft?secret=STORYBLOK_PREVIEW_SECRET&slug=
 *
 * Storyblok appends the story slug. The secret stops anyone else from flipping the site
 * into draft mode and reading unpublished content.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "";

  const expected = process.env.STORYBLOK_PREVIEW_SECRET;

  if (!expected) {
    return new NextResponse("Draft mode is not configured.", { status: 501 });
  }

  if (secret !== expected) {
    return new NextResponse("Invalid token.", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  // Only ever redirect to a path on this origin — an open redirect here would leak the
  // draft cookie to whatever host an attacker supplied.
  const safePath = `/${slug.replace(/^\/+/, "")}`.replace(/[^\w\-/åæøÅÆØ]/gi, "");

  return NextResponse.redirect(new URL(safePath, request.url));
}
