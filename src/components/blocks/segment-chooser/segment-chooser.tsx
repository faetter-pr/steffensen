import { storyblokEditable } from "@storyblok/react/rsc";

import { SegmentPanel } from "@/components/motion/segment-panel";
import { Stagger } from "@/components/motion/stagger";
import { motionDisabled } from "@/lib/storyblok/editorial";
import { resolveLink } from "@/lib/storyblok/link";
import type { SegmentCardStoryblok, SegmentChooserStoryblok } from "@/lib/storyblok/types";

/**
 * segment_chooser — editorial brief, page recipe #2.
 *
 * Three full-height panels in one row, 2px apart, ~60svh desktop. Each is a full-bleed
 * image with one serif label bottom-left and an arrow-up-right icon. No description
 * text. Mobile: stacked full-width frames (~55svh) — the brief says choose stack.
 *
 * §2 is why this block exists at all: a wedding couple and a kindergarten director want
 * different things, so the front page's job is routing, not selling.
 */
export function SegmentChooser({ blok }: { blok: SegmentChooserStoryblok }) {
  const items = (blok.items ?? []) as SegmentCardStoryblok[];
  if (!items.length) return null;

  const off = motionDisabled(blok.motion);

  return (
    <section {...storyblokEditable(blok)}>
      {/*
        Headline is optional and deliberately unobtrusive — the brief wants no section
        headings for the sake of structure. Rendered as a quiet eyebrow if present.
      */}
      {blok.headline ? (
        <h2 className="px-5 pt-16 pb-6 text-(length:--text-caption) tracking-[0.2em] text-brand-muted uppercase sm:px-8">
          {blok.headline}
        </h2>
      ) : null}

      <Stagger
        as="ul"
        disabled={off}
        stagger={0.1}
        className="grid grid-cols-1 gap-frame md:grid-cols-3"
      >
        {items.map((item) => {
          const href = resolveLink(item.link);
          if (!href) return null;

          return (
            <SegmentPanel
              key={item._uid}
              href={href}
              label={item.label}
              src={item.image?.filename ?? ""}
              alt={item.image_alt ?? ""}
              focus={item.image?.focus}
              segment={item.segment || undefined}
              overlayStrength={item.overlay_strength}
              textTone={item.text_tone}
              editable={storyblokEditable(item)}
              disabled={off}
            />
          );
        })}
      </Stagger>
    </section>
  );
}
