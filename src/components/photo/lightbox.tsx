"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { PhotoImage } from "@/components/photo/photo-image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Lightbox — Radix Dialog shell + Motion shared-element transition (brief item 7).
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * Radix supplies the focus trap, Escape handling, scroll lock and focus restoration —
 * all required by the brief's accessibility bar and easy to get wrong by hand. Motion
 * supplies the layoutId transition from the clicked thumbnail, the backdrop fade and
 * the swipe.
 *
 * Under reduced motion the shared element and drag are both dropped, leaving a fade.
 */

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  focus?: string | null;
}

interface LightboxProps {
  items: LightboxItem[];
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
  /** Supplies the shared-element id matching the clicked thumbnail. */
  layoutIdFor?: (index: number) => string;
}

export function Lightbox({ items, openIndex, onOpenChange, layoutIdFor }: LightboxProps) {
  const [index, setIndex] = useState(openIndex ?? 0);
  const prefersReduced = useReducedMotion();

  // Adjusting state during render rather than in an effect — React's documented pattern
  // for "state derived from props that can also change on its own".
  const [lastOpenIndex, setLastOpenIndex] = useState(openIndex);
  if (openIndex !== lastOpenIndex) {
    setLastOpenIndex(openIndex);
    if (openIndex !== null) setIndex(openIndex);
  }

  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, go]);

  const active = items[index];
  const isOpen = openIndex !== null && Boolean(active);

  // The shared element only makes sense for the image the user actually clicked.
  // Once they navigate away from it, fall back to a plain crossfade.
  const sharedLayoutId =
    !prefersReduced && layoutIdFor && index === openIndex ? layoutIdFor(index) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open ? index : null)}>
      <DialogContent
        showCloseButton={false}
        className="h-dvh w-screen max-w-none gap-0 border-0 bg-black/95 p-0 shadow-none sm:max-w-none"
      >
        <DialogTitle className="sr-only">{active ? active.alt : "Billedvisning"}</DialogTitle>

        <button
          type="button"
          onClick={() => onOpenChange(null)}
          aria-label="Luk"
          className="tap-target absolute top-4 right-4 z-20 flex items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {count > 1 ? (
          <>
            <NavButton side="left" onClick={() => go(-1)} />
            <NavButton side="right" onClick={() => go(1)} />
          </>
        ) : null}

        {active ? (
          <figure className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                layoutId={sharedLayoutId}
                className="flex min-h-0 items-center justify-center"
                initial={sharedLayoutId ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE }}
                // Swipe between images on touch. Off under reduced motion.
                drag={prefersReduced || count < 2 ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_event, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <PhotoImage
                  src={active.src}
                  alt={active.alt}
                  focus={active.focus}
                  sizes="full-bleed"
                  quality={85}
                  priority
                  className="flex max-h-full min-h-0 w-auto items-center justify-center"
                  imageClassName="max-h-[80dvh] w-auto object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {active.caption ? (
              <figcaption className="max-w-xl text-center text-(length:--text-caption) text-white/70">
                {active.caption}
              </figcaption>
            ) : null}

            {count > 1 ? (
              <p className="text-(length:--text-caption) text-white/50" aria-live="polite">
                {index + 1} / {count}
              </p>
            ) : null}
          </figure>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Forrige billede" : "Næste billede"}
      className={cn(
        "tap-target absolute top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  );
}
