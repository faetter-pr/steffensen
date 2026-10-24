import Link from "next/link";

import type { NavItem } from "@/components/layout/mobile-nav";

/**
 * Site footer (architecture.md §13.3): short intro, segment links, contact details,
 * socials, privacy link, service area, copyright.
 *
 * Layer 2: plain props only, no Storyblok imports.
 */

interface SiteFooterProps {
  siteName: string;
  intro?: string;
  navItems: NavItem[];
  socials?: NavItem[];
  contactEmail?: string;
  phone?: string;
  serviceArea?: string;
  /** Passed in so the server owns the clock — keeps the footer statically renderable. */
  year: number;
}

export function SiteFooter({
  siteName,
  intro,
  navItems,
  socials = [],
  contactEmail,
  phone,
  serviceArea,
  year,
}: SiteFooterProps) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-heading text-lg">{siteName}</p>
          {intro ? (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{intro}</p>
          ) : null}
          {serviceArea ? (
            <p className="mt-4 text-sm text-muted-foreground">Dækker {serviceArea}</p>
          ) : null}
        </div>

        <nav aria-label="Footermenu">
          <p className="text-xs font-medium tracking-wider uppercase">Sider</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-medium tracking-wider uppercase">Kontakt</p>
          <ul className="mt-4 space-y-2 text-sm">
            {contactEmail ? (
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {contactEmail}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-content flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}
          </p>
          {/* §12 — privacy page linked in the footer */}
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privatliv og fotosamtykke
          </Link>
        </div>
      </div>
    </footer>
  );
}
