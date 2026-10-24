/**
 * The app's single Storyblok type surface.
 *
 * The shapes are GENERATED from the per-block JSON sources, bundled into
 * storyblok-components.json by `npm run generate:types`
 * into ./generated.d.ts — do not hand-edit that file. This module re-exports them and
 * patches the handful of things the generator cannot know about, so app code never
 * imports the generated file directly.
 *
 * What is patched, and why:
 *
 *   1. `_editable` — the Visual Editor marker. storyblokEditable() requires it; the
 *      generator never emits it.
 *   2. Multilink — the generated union omits `story`, which the API does return once a
 *      link is resolved. Without this every access lands on the `[k: string]: unknown`
 *      index signature and is unusable.
 *   3. Richtext — the generated RichtextStoryblok is looser than the SDK's
 *      StoryblokRichTextInput, so <StoryblokServerRichText> rejects it.
 *   4. `seo` — Storyblok models a "max 1" bloks field as an array. firstSeo() unwraps it.
 *
 * All patching is by INTERSECTION, never Omit. The generated types carry a
 * `[k: string]: unknown` index signature, and `Omit` over such a type collapses it to
 * `{}` — silently discarding every named property.
 *
 * When the real space exists: use storyblok:pull and storyblok:import to update the
 * per-block schemas and regenerate, then fix whatever breaks here.
 */

import type { ISbStoryData, StoryblokRichTextInput } from "@storyblok/react/rsc";

import type {
  AssetStoryblok,
  ContactFormStoryblok as GenContactForm,
  CtaBannerStoryblok as GenCtaBanner,
  FaqStoryblok as GenFaq,
  FaqItemStoryblok as GenFaqItem,
  FeaturedProjectsStoryblok as GenFeaturedProjects,
  GalleryAccessStoryblok as GenGalleryAccess,
  GalleryCarouselStoryblok as GenGalleryCarousel,
  GalleryGridStoryblok as GenGalleryGrid,
  GalleryMasonryStoryblok as GenGalleryMasonry,
  GlobalSettingsStoryblok as GenGlobalSettings,
  HeroFullbleedStoryblok as GenHeroFullbleed,
  HeroSplitStoryblok as GenHeroSplit,
  ImageFullStoryblok as GenImageFull,
  ImageItemStoryblok as GenImageItem,
  ImagePairStoryblok as GenImagePair,
  IncludedItemStoryblok as GenIncludedItem,
  LogoStripStoryblok as GenLogoStrip,
  MultilinkStoryblok as GenMultilink,
  NavLinkStoryblok as GenNavLink,
  PackageStoryblok as GenPackage,
  PackageCardsStoryblok as GenPackageCards,
  PageStoryblok as GenPage,
  ProcessStepStoryblok as GenProcessStep,
  ProcessStepsStoryblok as GenProcessSteps,
  ProjectStoryblok as GenProject,
  ProjectGridStoryblok as GenProjectGrid,
  QuoteStoryblok as GenQuote,
  RichTextStoryblok as GenRichText,
  SegmentCardStoryblok as GenSegmentCard,
  SegmentChooserStoryblok as GenSegmentChooser,
  SegmentPageStoryblok as GenSegmentPage,
  SeoStoryblok as GenSeo,
  SpacerStoryblok as GenSpacer,
  StatItemStoryblok as GenStatItem,
  StatsStoryblok as GenStats,
  TestimonialStoryblok as GenTestimonial,
  TestimonialsStoryblok as GenTestimonials,
  TextImageStoryblok as GenTextImage,
  TrustBarStoryblok as GenTrustBar,
  TrustItemStoryblok as GenTrustItem,
} from "@/lib/storyblok/generated";

export type { AssetStoryblok };

/** (1) The Visual Editor marker that storyblokEditable() reads. */
export interface SbEditable {
  _editable?: string;
}

/** (2) The API returns a resolved `story` on internal links. */
export type MultilinkStoryblok = GenMultilink & {
  story?: { full_slug?: string; name?: string };
  url?: string;
  cached_url?: string;
  email?: string;
  anchor?: string;
};

/** (3) The SDK's richtext type, which StoryblokServerRichText accepts. */
export type RichtextStoryblok = StoryblokRichTextInput;

export type SeoStoryblok = GenSeo;

export type ImageItemStoryblok = GenImageItem & SbEditable;
export type NavLinkStoryblok = GenNavLink & SbEditable & { link: MultilinkStoryblok };

export type HeroFullbleedStoryblok = GenHeroFullbleed &
  SbEditable & { cta_link?: MultilinkStoryblok };

export type RichTextStoryblok = GenRichText & SbEditable & { text?: RichtextStoryblok };

/* --- nested-only bloks (§4) --- */
export type FaqItemStoryblok = GenFaqItem & SbEditable & { answer?: RichtextStoryblok };
export type IncludedItemStoryblok = GenIncludedItem & SbEditable;
export type ProcessStepStoryblok = GenProcessStep & SbEditable;
export type StatItemStoryblok = GenStatItem & SbEditable;
export type TrustItemStoryblok = GenTrustItem & SbEditable;
export type SegmentCardStoryblok = GenSegmentCard & SbEditable & { link: MultilinkStoryblok };

/* --- page-level bloks (§4) --- */
export type HeroSplitStoryblok = GenHeroSplit &
  SbEditable & { cta_link?: MultilinkStoryblok; secondary_cta_link?: MultilinkStoryblok };
export type SegmentChooserStoryblok = GenSegmentChooser & SbEditable;
export type GalleryGridStoryblok = GenGalleryGrid & SbEditable;
export type GalleryMasonryStoryblok = GenGalleryMasonry & SbEditable;
export type GalleryCarouselStoryblok = GenGalleryCarousel & SbEditable;
export type ProjectGridStoryblok = GenProjectGrid & SbEditable;
export type FeaturedProjectsStoryblok = GenFeaturedProjects &
  SbEditable & { cta_link?: MultilinkStoryblok };
export type ImageFullStoryblok = GenImageFull & SbEditable;
export type ImagePairStoryblok = GenImagePair & SbEditable;
export type TextImageStoryblok = GenTextImage &
  SbEditable & { text?: RichtextStoryblok; cta_link?: MultilinkStoryblok };
export type PackageCardsStoryblok = GenPackageCards & SbEditable;
export type ProcessStepsStoryblok = GenProcessSteps & SbEditable;
export type TrustBarStoryblok = GenTrustBar & SbEditable;
export type TestimonialsStoryblok = GenTestimonials & SbEditable;
export type LogoStripStoryblok = GenLogoStrip & SbEditable;
export type FaqStoryblok = GenFaq & SbEditable & { items?: FaqItemStoryblok[] };
export type CtaBannerStoryblok = GenCtaBanner & SbEditable & { cta_link?: MultilinkStoryblok };
export type StatsStoryblok = GenStats & SbEditable;
export type QuoteStoryblok = GenQuote & SbEditable;
export type SpacerStoryblok = GenSpacer & SbEditable;
export type ContactFormStoryblok = GenContactForm & SbEditable;
export type GalleryAccessStoryblok = GenGalleryAccess & SbEditable;

/* --- content types (§3) --- */
export type PageStoryblok = GenPage & SbEditable;
export type SegmentPageStoryblok = GenSegmentPage & SbEditable;
export type ProjectStoryblok = GenProject & SbEditable & { intro?: RichtextStoryblok };
export type PackageStoryblok = GenPackage & SbEditable & { cta_link?: MultilinkStoryblok };
export type TestimonialStoryblok = GenTestimonial & SbEditable;
export type GlobalSettingsStoryblok = GenGlobalSettings & SbEditable;

/**
 * A reference field (`type: "options"`, `source: "internal_stories"`).
 *
 * Storyblok returns uuid STRINGS by default, and full story objects once the fetch
 * passes `resolve_relations` (§7). The generator cannot express that, so it emits
 * `unknown[]`. Use resolveRefs() to get just the resolved entries.
 */
export type StoryRef<T> = string | ISbStoryData<T>;

export function resolveRefs<T>(refs: unknown): ISbStoryData<T>[] {
  if (!Array.isArray(refs)) return [];
  return refs.filter(
    (ref): ref is ISbStoryData<T> => typeof ref === "object" && ref !== null && "content" in ref,
  );
}

/**
 * Every Storyblok blok carries these. Used where a component only needs to pass a blok
 * through to <StoryblokServerComponent> without caring what it is.
 */
export interface SbBlokBase extends SbEditable {
  _uid: string;
  component: string;
  [k: string]: unknown;
}

export type Segment = "kindergartens" | "schools" | "weddings" | "other";

/** Any content type routed through [[...slug]]. */
export type RoutableStoryblok = PageStoryblok | SegmentPageStoryblok | ProjectStoryblok;

export type SbStory<T> = ISbStoryData<T>;

/** (4) Unwrap Storyblok's "max 1 blok" array into the single entry. */
export function firstSeo(
  seo: SeoStoryblok[] | SeoStoryblok | undefined | unknown,
): SeoStoryblok | undefined {
  if (!seo) return undefined;
  if (Array.isArray(seo)) return seo[0] as SeoStoryblok | undefined;
  return seo as SeoStoryblok;
}

/** Narrow a routable story's content to a project. */
export function isProject(content: RoutableStoryblok): content is ProjectStoryblok {
  return content.component === "project";
}

/**
 * Bloks nested in a `body` field. The generator types these as a union of every
 * registered component, but renderers only pass them through to
 * <StoryblokServerComponent>, which takes any blok.
 */
export function asBloks(body: unknown): SbBlokBase[] {
  return Array.isArray(body) ? (body as SbBlokBase[]) : [];
}
