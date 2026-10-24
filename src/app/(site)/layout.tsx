import type { ReactNode } from "react";

import type { NavItem } from "@/components/layout/mobile-nav";
import { SiteFrame } from "@/components/layout/site-frame";
import { fetchGlobal } from "@/lib/storyblok/fetch";
import { resolveLink } from "@/lib/storyblok/link";
import type { NavLinkStoryblok } from "@/lib/storyblok/types";

function toNavItems(links: NavLinkStoryblok[] | undefined): NavItem[] | undefined {
  const items = (links ?? [])
    .map((link) => ({ label: link.label, href: resolveLink(link.link) ?? "" }))
    .filter((item): item is NavItem => Boolean(item.label && item.href));
  return items.length ? items : undefined;
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const globalStory = await fetchGlobal();
  const global = globalStory?.content;

  return (
    <SiteFrame
      siteName={global?.site_name || undefined}
      logoUrl={global?.logo?.filename}
      headerNav={toNavItems(global?.header_nav)}
      footerNav={toNavItems(global?.footer_nav)}
      socials={toNavItems(global?.socials)}
      intro={global?.privacy_blurb}
      contactEmail={global?.contact_email}
      phone={global?.phone}
      serviceArea={global?.service_area}
    >
      {children}
    </SiteFrame>
  );
}
