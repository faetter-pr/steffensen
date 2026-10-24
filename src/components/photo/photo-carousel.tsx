"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";

import { Lightbox, type LightboxItem } from "@/components/photo/lightbox";
import { PhotoImage } from "@/components/photo/photo-image";
import { useState } from "react";

/**
 * Horizontal carousel (architecture.md §4 — gallery_carousel).
 *
 * Built on CSS scroll-snap rather than a carousel library: no extra dependency, native
 * touch/trackpad behaviour, and it degrades to a plain scroller without JavaScript.
 * The arrow buttons are progressive enhancement on top.
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * NOTE: the `autoplay` option in architecture.md §4 is intentionally not implemented.
 * Auto-advancing carousels fight §13.10's prefers-reduced-motion requirement and move
 * content out from under people mid-read. Add it only if genuinely wanted.
 */

interface PhotoCarouselProps {
  items: LightboxItem[];
}

export function PhotoCarousel({ items }: PhotoCarouselProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstItem = scroller.querySelector("li");
    const step = firstItem ? firstItem.getBoundingClientRect().width + 16 : scroller.clientWidth;

    scroller.scrollBy({
      left: step * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, []);

  if (!items.length) return null;

  return (
    <>
      <div className="relative">
        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory [scrollbar-width:thin] gap-4 overflow-x-auto scroll-smooth pb-4 motion-reduce:scroll-auto"
        >
          {items.map((item, index) => (
            <li
              key={`${item.src}-${index}`}
              className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[32%]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Åbn billede: ${item.alt}`}
                className="block w-full cursor-zoom-in overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <PhotoImage
                  src={item.src}
                  alt={item.alt}
                  focus={item.focus}
                  sizes="grid-3col"
                  className="aspect-4/3 h-full w-full"
                  imageClassName="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>

        {items.length > 1 ? (
          <div className="mt-2 flex justify-end gap-2">
            <CarouselButton direction={-1} onClick={() => scrollBy(-1)} />
            <CarouselButton direction={1} onClick={() => scrollBy(1)} />
          </div>
        ) : null}
      </div>

      <Lightbox items={items} openIndex={openIndex} onOpenChange={setOpenIndex} />
    </>
  );
}

function CarouselButton({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  const Icon = direction === -1 ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === -1 ? "Rul tilbage" : "Rul frem"}
      className="tap-target flex items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
