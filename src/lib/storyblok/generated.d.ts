import {StoryblokStory} from 'storyblok-generate-ts'

export interface ContactFormStoryblok {
  heading?: string;
  intro?: string;
  types?: ContactTypeStoryblok[];
  success_message?: string;
  _uid: string;
  component: "contact_form";
  [k: string]: unknown;
}

export interface ContactTypeStoryblok {
  label: string;
  _uid: string;
  component: "contact_type";
  [k: string]: unknown;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
      [k: string]: unknown;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
      [k: string]: unknown;
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
      [k: string]: unknown;
    };

export interface CtaBannerStoryblok {
  headline: string;
  text?: string;
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  background?: "" | "soft" | "accent" | "ink";
  variant?: "" | "minimal" | "filled";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "cta_banner";
  [k: string]: unknown;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: unknown;
  text?: string;
  [k: string]: unknown;
}

export interface FaqItemStoryblok {
  question: string;
  answer: RichtextStoryblok;
  _uid: string;
  component: "faq_item";
  [k: string]: unknown;
}

export interface FaqStoryblok {
  headline?: string;
  items?: FaqItemStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "faq";
  [k: string]: unknown;
}

export interface FeaturedProjectsStoryblok {
  headline?: string;
  intro?: string;
  projects?: unknown[];
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  motion?: "" | "default" | "none";
  _uid: string;
  component: "featured_projects";
  [k: string]: unknown;
}

export interface GalleryAccessStoryblok {
  heading?: string;
  instructions?: string;
  button_label?: string;
  _uid: string;
  component: "gallery_access";
  [k: string]: unknown;
}

export interface GalleryCarouselStoryblok {
  headline?: string;
  images?: ImageItemStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "gallery_carousel";
  [k: string]: unknown;
}

export interface GalleryGridStoryblok {
  headline?: string;
  images?: ImageItemStoryblok[];
  columns?: "" | "2" | "3" | "4";
  gap?: "" | "none" | "frame" | "loose";
  aspect?: "" | "square" | "portrait" | "landscape" | "original";
  variant?: "" | "contained" | "edge-to-edge" | "strip-3";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "gallery_grid";
  [k: string]: unknown;
}

export interface GalleryMasonryStoryblok {
  headline?: string;
  images?: ImageItemStoryblok[];
  columns?: "" | "2" | "3" | "4";
  gap?: "" | "none" | "frame" | "loose";
  edge_to_edge: boolean;
  motion?: "" | "default" | "none";
  _uid: string;
  component: "gallery_masonry";
  [k: string]: unknown;
}

export interface AssetStoryblok {
  _uid?: string;
  id: number | null;
  alt: string | null;
  name: string;
  focus: string | null;
  source: string | null;
  title: string | null;
  filename: string;
  copyright: string | null;
  fieldtype?: string;
  meta_data?: null | {
    [k: string]: unknown;
  };
  is_external_url?: boolean;
  [k: string]: unknown;
}

export interface GlobalSettingsStoryblok {
  site_name?: string;
  logo?: AssetStoryblok;
  header_nav?: NavLinkStoryblok[];
  footer_nav?: NavLinkStoryblok[];
  socials?: NavLinkStoryblok[];
  default_seo?: SeoStoryblok[];
  contact_email?: string;
  phone?: string;
  service_area?: string;
  privacy_blurb?: string;
  _uid: string;
  component: "global_settings";
  [k: string]: unknown;
}

export interface HeroFullbleedStoryblok {
  image: AssetStoryblok;
  image_alt: string;
  headline?: string;
  subline?: string;
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  overlay_strength?: "" | "none" | "light" | "medium" | "strong";
  text_tone?: "" | "light" | "dark";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "hero_fullbleed";
  [k: string]: unknown;
}

export interface HeroSplitStoryblok {
  image: AssetStoryblok;
  image_alt: string;
  headline?: string;
  subline?: string;
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  secondary_cta_label?: string;
  secondary_cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image_side?: "" | "right" | "left";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "hero_split";
  [k: string]: unknown;
}

export interface ImageFullStoryblok {
  image: AssetStoryblok;
  image_alt: string;
  caption?: string;
  width?: "" | "contained" | "wide" | "full";
  aspect?: "" | "auto" | "3-2" | "16-9" | "4-5";
  max_height?: "" | "none" | "70svh" | "90svh";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "image_full";
  [k: string]: unknown;
}

export interface ImageItemStoryblok {
  asset: AssetStoryblok;
  alt: string;
  caption?: string;
  featured: boolean;
  aspect?: "" | "auto" | "3-2" | "16-9" | "4-5";
  _uid: string;
  component: "image_item";
  [k: string]: unknown;
}

export interface ImagePairStoryblok {
  images?: ImageItemStoryblok[];
  caption?: string;
  variant?: "" | "equal" | "asymmetric" | "asymmetric-mirrored";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "image_pair";
  [k: string]: unknown;
}

export interface IncludedItemStoryblok {
  text: string;
  _uid: string;
  component: "included_item";
  [k: string]: unknown;
}

export interface LogoStripStoryblok {
  headline?: string;
  logos?: ImageItemStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "logo_strip";
  [k: string]: unknown;
}

export interface NavLinkStoryblok {
  label: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "nav_link";
  [k: string]: unknown;
}

export interface PackageCardsStoryblok {
  headline?: string;
  intro?: string;
  packages?: unknown[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "package_cards";
  [k: string]: unknown;
}

export interface PackageStoryblok {
  title: string;
  segment?: "" | "kindergartens" | "schools" | "weddings" | "other";
  description?: string;
  price_from?: string;
  price_unit?: "" | "per_child" | "per_class" | "flat";
  included?: IncludedItemStoryblok[];
  highlight: boolean;
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "package";
  [k: string]: unknown;
}

export interface PageStoryblok {
  body?: (
    | ContactFormStoryblok
    | ContactTypeStoryblok
    | CtaBannerStoryblok
    | FaqItemStoryblok
    | FaqStoryblok
    | FeaturedProjectsStoryblok
    | GalleryAccessStoryblok
    | GalleryCarouselStoryblok
    | GalleryGridStoryblok
    | GalleryMasonryStoryblok
    | GlobalSettingsStoryblok
    | HeroFullbleedStoryblok
    | HeroSplitStoryblok
    | ImageFullStoryblok
    | ImageItemStoryblok
    | ImagePairStoryblok
    | IncludedItemStoryblok
    | LogoStripStoryblok
    | NavLinkStoryblok
    | PackageCardsStoryblok
    | PackageStoryblok
    | PageStoryblok
    | ProcessStepStoryblok
    | ProcessStepsStoryblok
    | ProjectGridStoryblok
    | ProjectStoryblok
    | QuoteStoryblok
    | RichTextStoryblok
    | SegmentCardStoryblok
    | SegmentChooserStoryblok
    | SegmentPageStoryblok
    | SeoStoryblok
    | SpacerStoryblok
    | StatItemStoryblok
    | StatsStoryblok
    | TestimonialStoryblok
    | TestimonialsStoryblok
    | TextImageStoryblok
    | TrustBarStoryblok
    | TrustItemStoryblok
  )[];
  seo?: SeoStoryblok[];
  _uid: string;
  component: "page";
  uuid?: string;
  [k: string]: unknown;
}

export interface ProcessStepStoryblok {
  title: string;
  description?: string;
  _uid: string;
  component: "process_step";
  [k: string]: unknown;
}

export interface ProcessStepsStoryblok {
  headline?: string;
  steps?: ProcessStepStoryblok[];
  variant?: "" | "line" | "numbered";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "process_steps";
  [k: string]: unknown;
}

export interface ProjectGridStoryblok {
  headline?: string;
  segment?: "" | "kindergartens" | "schools" | "weddings" | "other";
  projects?: unknown[];
  show_filter: boolean;
  layout?: "" | "grid" | "wide";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "project_grid";
  [k: string]: unknown;
}

export interface ProjectStoryblok {
  title: string;
  segment?: "" | "kindergartens" | "schools" | "weddings" | "other";
  cover: AssetStoryblok;
  cover_alt: string;
  year?: string;
  location?: string;
  intro?: RichtextStoryblok;
  body?: (
    | ContactFormStoryblok
    | ContactTypeStoryblok
    | CtaBannerStoryblok
    | FaqItemStoryblok
    | FaqStoryblok
    | FeaturedProjectsStoryblok
    | GalleryAccessStoryblok
    | GalleryCarouselStoryblok
    | GalleryGridStoryblok
    | GalleryMasonryStoryblok
    | GlobalSettingsStoryblok
    | HeroFullbleedStoryblok
    | HeroSplitStoryblok
    | ImageFullStoryblok
    | ImageItemStoryblok
    | ImagePairStoryblok
    | IncludedItemStoryblok
    | LogoStripStoryblok
    | NavLinkStoryblok
    | PackageCardsStoryblok
    | PackageStoryblok
    | PageStoryblok
    | ProcessStepStoryblok
    | ProcessStepsStoryblok
    | ProjectGridStoryblok
    | ProjectStoryblok
    | QuoteStoryblok
    | RichTextStoryblok
    | SegmentCardStoryblok
    | SegmentChooserStoryblok
    | SegmentPageStoryblok
    | SeoStoryblok
    | SpacerStoryblok
    | StatItemStoryblok
    | StatsStoryblok
    | TestimonialStoryblok
    | TestimonialsStoryblok
    | TextImageStoryblok
    | TrustBarStoryblok
    | TrustItemStoryblok
  )[];
  seo?: SeoStoryblok[];
  _uid: string;
  component: "project";
  [k: string]: unknown;
}

export interface QuoteStoryblok {
  text: string;
  attribution?: string;
  overlay_strength?: "" | "none" | "light" | "medium" | "strong";
  text_tone?: "" | "light" | "dark";
  variant?: "" | "plain" | "over-image";
  image?: AssetStoryblok;
  image_alt?: string;
  motion?: "" | "default" | "none";
  _uid: string;
  component: "quote";
  [k: string]: unknown;
}

export interface RichTextStoryblok {
  text?: RichtextStoryblok;
  width?: "" | "contained" | "wide";
  _uid: string;
  component: "rich_text";
  [k: string]: unknown;
}

export interface SegmentCardStoryblok {
  label: string;
  image: AssetStoryblok;
  image_alt: string;
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  segment?: "" | "kindergartens" | "schools" | "weddings" | "other";
  overlay_strength?: "" | "none" | "light" | "medium" | "strong";
  text_tone?: "" | "light" | "dark";
  _uid: string;
  component: "segment_card";
  [k: string]: unknown;
}

export interface SegmentChooserStoryblok {
  headline?: string;
  items?: SegmentCardStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "segment_chooser";
  [k: string]: unknown;
}

export interface SegmentPageStoryblok {
  segment: "" | "kindergartens" | "schools" | "weddings" | "other";
  body?: (
    | ContactFormStoryblok
    | ContactTypeStoryblok
    | CtaBannerStoryblok
    | FaqItemStoryblok
    | FaqStoryblok
    | FeaturedProjectsStoryblok
    | GalleryAccessStoryblok
    | GalleryCarouselStoryblok
    | GalleryGridStoryblok
    | GalleryMasonryStoryblok
    | GlobalSettingsStoryblok
    | HeroFullbleedStoryblok
    | HeroSplitStoryblok
    | ImageFullStoryblok
    | ImageItemStoryblok
    | ImagePairStoryblok
    | IncludedItemStoryblok
    | LogoStripStoryblok
    | NavLinkStoryblok
    | PackageCardsStoryblok
    | PackageStoryblok
    | PageStoryblok
    | ProcessStepStoryblok
    | ProcessStepsStoryblok
    | ProjectGridStoryblok
    | ProjectStoryblok
    | QuoteStoryblok
    | RichTextStoryblok
    | SegmentCardStoryblok
    | SegmentChooserStoryblok
    | SegmentPageStoryblok
    | SeoStoryblok
    | SpacerStoryblok
    | StatItemStoryblok
    | StatsStoryblok
    | TestimonialStoryblok
    | TestimonialsStoryblok
    | TextImageStoryblok
    | TrustBarStoryblok
    | TrustItemStoryblok
  )[];
  seo?: SeoStoryblok[];
  _uid: string;
  component: "segment_page";
  [k: string]: unknown;
}

export interface SeoStoryblok {
  title?: string;
  description?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  _uid: string;
  component: "seo";
  [k: string]: unknown;
}

export interface SpacerStoryblok {
  size?: "" | "small" | "medium" | "large";
  _uid: string;
  component: "spacer";
  [k: string]: unknown;
}

export interface StatItemStoryblok {
  value: string;
  label: string;
  _uid: string;
  component: "stat_item";
  [k: string]: unknown;
}

export interface StatsStoryblok {
  items?: StatItemStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "stats";
  [k: string]: unknown;
}

export interface TestimonialStoryblok {
  quote: string;
  name?: string;
  role?: string;
  organisation?: string;
  segment?: "" | "kindergartens" | "schools" | "weddings" | "other";
  portrait?: AssetStoryblok;
  portrait_alt?: string;
  _uid: string;
  component: "testimonial";
  [k: string]: unknown;
}

export interface TestimonialsStoryblok {
  headline?: string;
  testimonials?: unknown[];
  layout?: "" | "grid" | "single";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "testimonials";
  [k: string]: unknown;
}

export interface TextImageStoryblok {
  image: AssetStoryblok;
  image_alt: string;
  headline?: string;
  text?: RichtextStoryblok;
  cta_label?: string;
  cta_link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  image_side?: "" | "left" | "right";
  motion?: "" | "default" | "none";
  _uid: string;
  component: "text_image";
  [k: string]: unknown;
}

export interface TrustBarStoryblok {
  items?: TrustItemStoryblok[];
  motion?: "" | "default" | "none";
  _uid: string;
  component: "trust_bar";
  [k: string]: unknown;
}

export interface TrustItemStoryblok {
  text: string;
  icon?: "" | "check" | "shield" | "clock" | "camera" | "heart" | "users";
  _uid: string;
  component: "trust_item";
  [k: string]: unknown;
}
