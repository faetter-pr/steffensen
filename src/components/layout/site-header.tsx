import Link from "next/link";

import { MobileNav, type NavItem } from "@/components/layout/mobile-nav";
import { PhotoImage } from "@/components/photo/photo-image";
import { Button } from "@/components/ui/button";

/**
 * Site header (architecture.md §13.3).
 *
 * Layer 2: plain props only. The layout resolves global settings and passes them in.
 *
 * NOTE: §13.3 also asks for "transparent over hero images, solid after scroll". That needs
 * a scroll listener and therefore a client component, and it only makes sense once
 * hero_fullbleed is actually placed on a page. It lands with phase 2 — today the header is
 * simply solid and sticky.
 */

interface SiteHeaderProps {
  siteName: string;
  logoUrl?: string;
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export function SiteHeader({ siteName, logoUrl, navItems, ctaLabel, ctaHref }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container-content flex h-18 items-center justify-between gap-6">
        <Link href="/" className="tap-target flex items-center gap-2" aria-label={siteName}>
          {logoUrl ? (
            <PhotoImage
              src={logoUrl}
              alt={siteName}
              sizes="thumb"
              height={32}
              imageClassName="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-heading text-xl tracking-tight">{siteName}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hovedmenu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="tap-target hidden md:inline-flex">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>

          <MobileNav items={navItems} ctaLabel={ctaLabel} ctaHref={ctaHref} siteName={siteName} />
        </div>
      </div>
    </header>
  );
}
