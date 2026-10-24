"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Gallery code entry (architecture.md §12).
 *
 * Layer 2: plain props, no Storyblok imports.
 *
 * This only NAVIGATES to /gallery/[code]. It deliberately does not validate anything —
 * validating a code in the browser would mean shipping the codes to the browser. All
 * checking belongs on the server, and none of it is built yet (§15.2 is open).
 * See lib/gallery-auth.ts.
 */
export function GalleryAccessUI({ buttonLabel }: { buttonLabel: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = code.trim();
    if (!trimmed) return;

    // Keep it URL-safe; the server decides whether it means anything.
    router.push(`/gallery/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
      <div className="w-full text-left">
        <Label htmlFor="gallery-code">Galleri-kode</Label>
        <Input
          id="gallery-code"
          name="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="mt-2 text-center tracking-[0.3em] uppercase"
          placeholder="ABCD12"
        />
      </div>

      <Button type="submit" size="lg" className="tap-target w-full" disabled={!code.trim()}>
        {buttonLabel}
      </Button>
    </form>
  );
}
