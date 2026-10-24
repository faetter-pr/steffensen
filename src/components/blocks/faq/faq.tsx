import { StoryblokServerRichText, storyblokEditable } from "@storyblok/react/rsc";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItemStoryblok, FaqStoryblok } from "@/lib/storyblok/types";

/**
 * faq (architecture.md §4, §5 — Radix Accordion).
 *
 * Radix supplies the keyboard interaction and aria wiring required by §13.10.
 */
export function Faq({ blok }: { blok: FaqStoryblok }) {
  const items = (blok.items ?? []) as FaqItemStoryblok[];
  if (!items.length) return null;

  return (
    <section {...storyblokEditable(blok)} className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {blok.headline ? (
          <h2 className="font-heading text-3xl leading-tight text-balance sm:text-4xl">
            {blok.headline}
          </h2>
        ) : null}

        <Accordion type="single" collapsible className="mt-8 w-full">
          {items.map((item) => (
            <AccordionItem key={item._uid} value={item._uid} {...storyblokEditable(item)}>
              <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer ? (
                  <div className="prose-a:text-brand-accent-ink text-sm leading-relaxed">
                    <StoryblokServerRichText document={item.answer} />
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
