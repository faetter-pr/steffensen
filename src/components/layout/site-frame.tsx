import type { ReactNode } from "react";

import type { NavItem } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEFAULT_SITE_NAME } from "@/lib/seo";

const FALLBACK_NAV: NavItem[] = [
  { label: "Børnehaver", href: "/kindergartens" },
  { label: "Skoler", href: "/schools" },
  { label: "Bryllupper", href: "/weddings" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Om mig", href: "/about" },
];

interface SiteFrameProps {
  children: ReactNode;
  siteName?: string;
  logoUrl?: string;
  headerNav?: NavItem[];
  footerNav?: NavItem[];
  socials?: NavItem[];
  intro?: string;
  contactEmail?: string;
  phone?: string;
  serviceArea?: string;
}

export function SiteFrame({
  children,
  siteName = DEFAULT_SITE_NAME,
  logoUrl,
  headerNav = FALLBACK_NAV,
  footerNav = FALLBACK_NAV,
  socials,
  intro,
  contactEmail,
  phone,
  serviceArea,
}: SiteFrameProps) {
  return (
    <>
      <SiteHeader
        siteName={siteName}
        logoUrl={logoUrl}
        navItems={headerNav}
        ctaLabel="Kontakt"
        ctaHref="/contact"
      />

      <div id="main" className="flex-1">
        {children}
      </div>

      <SiteFooter
        siteName={siteName}
        intro={intro}
        navItems={footerNav}
        socials={socials}
        contactEmail={contactEmail}
        phone={phone}
        serviceArea={serviceArea}
        year={new Date().getFullYear()}
      />
    </>
  );
}
