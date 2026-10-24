import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

import { ContactForm } from "@/components/blocks/contact-form/contact-form";
import { CtaBanner } from "@/components/blocks/cta-banner/cta-banner";
import { Faq } from "@/components/blocks/faq/faq";
import { FeaturedProjects } from "@/components/blocks/featured-projects/featured-projects";
import { GalleryAccess } from "@/components/blocks/gallery-access/gallery-access";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel/gallery-carousel";
import { GalleryGrid } from "@/components/blocks/gallery-grid/gallery-grid";
import { GalleryMasonry } from "@/components/blocks/gallery-masonry/gallery-masonry";
import { HeroFullbleed } from "@/components/blocks/hero-fullbleed/hero-fullbleed";
import { HeroSplit } from "@/components/blocks/hero-split/hero-split";
import { ImageFull } from "@/components/blocks/image-full/image-full";
import { ImagePair } from "@/components/blocks/image-pair/image-pair";
import { LogoStrip } from "@/components/blocks/logo-strip/logo-strip";
import { PackageCards } from "@/components/blocks/package-cards/package-cards";
import { ProcessSteps } from "@/components/blocks/process-steps/process-steps";
import { ProjectGrid } from "@/components/blocks/project-grid/project-grid";
import { Quote } from "@/components/blocks/quote/quote";
import { RichText } from "@/components/blocks/rich-text/rich-text";
import { SegmentChooser } from "@/components/blocks/segment-chooser/segment-chooser";
import { Spacer } from "@/components/blocks/spacer/spacer";
import { Stats } from "@/components/blocks/stats/stats";
import { Testimonials } from "@/components/blocks/testimonials/testimonials";
import { TextImage } from "@/components/blocks/text-image/text-image";
import { TrustBar } from "@/components/blocks/trust-bar/trust-bar";
import { Page } from "@/components/pages/page";
import { ProjectPage } from "@/components/pages/project-page";
import { SegmentPage } from "@/components/pages/segment-page";

/**
 * Storyblok init + component registry (architecture.md §7).
 *
 * Registry keys MUST equal the Storyblok technical name, and the component's filename
 * must match it too (see CLAUDE.md hard rules). hero_fullbleed → hero-fullbleed.tsx.
 *
 * Nested-only bloks (image_item, faq_item, nav_link, included_item, process_step,
 * stat_item, trust_item, segment_card, seo) are deliberately absent: their parent block
 * renders them directly rather than going through the registry.
 */

export const STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN ?? "";
export const STORYBLOK_REGION = process.env.STORYBLOK_REGION ?? "eu";

/**
 * True when a delivery token is configured. There is no space yet, so every data path
 * has to degrade instead of throwing — `npm run build` must stay green. See CLAUDE.md.
 */
export const isStoryblokConfigured = STORYBLOK_TOKEN.length > 0;

export const getStoryblokApi = storyblokInit({
  accessToken: STORYBLOK_TOKEN,
  // Registering the API plugin without a token makes getStoryblokApi() throw on use,
  // so only load it when we actually have one. fetch.ts checks isStoryblokConfigured
  // before ever calling getStoryblokApi().
  use: isStoryblokConfigured ? [apiPlugin] : [],
  apiOptions: {
    region: STORYBLOK_REGION,
  },
  components: {
    // --- content types (§3) ---
    page: Page,
    segment_page: SegmentPage,
    project: ProjectPage,

    // --- hero / intro (§4) ---
    hero_fullbleed: HeroFullbleed,
    hero_split: HeroSplit,
    segment_chooser: SegmentChooser,

    // --- gallery (§4) ---
    gallery_grid: GalleryGrid,
    gallery_masonry: GalleryMasonry,
    gallery_carousel: GalleryCarousel,
    project_grid: ProjectGrid,
    featured_projects: FeaturedProjects,

    // --- editorial (§4) ---
    image_full: ImageFull,
    image_pair: ImagePair,
    text_image: TextImage,

    // --- business / trust (§4) ---
    package_cards: PackageCards,
    process_steps: ProcessSteps,
    trust_bar: TrustBar,
    testimonials: Testimonials,
    logo_strip: LogoStrip,
    faq: Faq,
    cta_banner: CtaBanner,
    stats: Stats,

    // --- forms and access (§4) ---
    contact_form: ContactForm,
    gallery_access: GalleryAccess,

    // --- content / utility (§4) ---
    rich_text: RichText,
    quote: Quote,
    spacer: Spacer,
  },
  enableFallbackComponent: true,
});
