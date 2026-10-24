/**
 * Gallery access control — NOT IMPLEMENTED (architecture.md §12, open question §15.2).
 *
 * This file exists to hold the decision, not to pretend the feature works. Nothing here
 * is wired up; the gallery route is a stub.
 *
 * Before writing any of this, §15.2 has to be answered: build in-house, or use a hosted
 * gallery/delivery service (Pic-Time, Pixieset, ShootProof, …)? For a one-person studio
 * handling photos of children, a hosted service moves a meaningful amount of security and
 * GDPR liability off this codebase — worth weighing seriously against the in-house route.
 *
 * If built in-house, §12 requires all of:
 *
 *   1. Codes validated SERVER-SIDE only. Never ship the list to the client.
 *   2. Store a hash (argon2/bcrypt), never the plaintext code.
 *   3. On success set a signed, HttpOnly, Secure, SameSite=Lax cookie scoped to the
 *      gallery path, with a short expiry.
 *   4. Rate-limit attempts per IP and per code — a 4-6 character code is brute-forceable.
 *   5. Serve images from private storage via short-lived signed URLs, NOT from
 *      Storyblok's public CDN.
 *   6. noindex + Cache-Control: private on every gallery response; never in the sitemap.
 *   7. A defined retention period, enforced by a scheduled job, stated on /privacy.
 *   8. A data processing agreement with institutions holding personal data.
 *
 * Point 5 is the one most easily got wrong: anything uploaded to Storyblok is served from
 * a public CDN. A "private" gallery backed by Storyblok assets is public to anyone with
 * the URL, regardless of what guards the page around it.
 */

export const GALLERY_COOKIE_NAME = "sf_gallery";

/** Suggested cookie lifetime. Short on purpose — galleries are shared links. */
export const GALLERY_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export {};
