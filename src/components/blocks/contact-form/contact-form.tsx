import { storyblokEditable } from "@storyblok/react/rsc";

import { ContactFormUI } from "@/components/forms/contact-form-ui";
import { submitContact } from "@/app/actions/contact";
import type { ContactSegment } from "@/lib/contact-schema";
import { SEGMENTS } from "@/lib/contact-schema";
import type { ContactFormStoryblok } from "@/lib/storyblok/types";

/** contact_form (architecture.md §4, §11). Layer 3 — unwraps the blok, injects the action. */
export function ContactForm({ blok }: { blok: ContactFormStoryblok }) {
  const configured = Array.isArray(blok.segments) ? blok.segments : [];
  const segments = configured.filter((value): value is ContactSegment =>
    (SEGMENTS as readonly string[]).includes(value as string),
  );

  return (
    <section {...storyblokEditable(blok)} className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {blok.heading ? (
          <h2 className="font-heading text-3xl leading-tight text-balance sm:text-4xl">
            {blok.heading}
          </h2>
        ) : null}

        {blok.intro ? (
          <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{blok.intro}</p>
        ) : null}

        <div className="mt-10">
          <ContactFormUI
            action={submitContact}
            segments={segments}
            successMessage={blok.success_message}
          />
        </div>
      </div>
    </section>
  );
}
