"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Mobile navigation (architecture.md §13.3 — "Mobile uses a Sheet").
 *
 * Layer 2: plain props only, no Storyblok imports. One of the few client components.
 */

export interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  siteName: string;
}

export function MobileNav({ items, ctaLabel, ctaHref, siteName }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="tap-target md:hidden" aria-label="Åbn menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-left">{siteName}</SheetTitle>
          <SheetDescription className="sr-only">Hovedmenu</SheetDescription>
        </SheetHeader>

        <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="Mobil hovedmenu">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="tap-target flex items-center rounded-lg px-3 text-lg transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}

          <Button asChild className="tap-target mt-4">
            <Link href={ctaHref} onClick={() => setOpen(false)}>
              {ctaLabel}
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
