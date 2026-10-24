"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * Segment filter bar (architecture.md §13.8 — ToggleGroup, URL-synced via query param).
 *
 * Layer 2: plain props, no Storyblok imports. Keeping the state in the URL means the
 * filtered view is linkable and survives a refresh or back-navigation.
 */

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  /** Query parameter to write. Defaults to "segment". */
  paramName?: string;
  /** Value meaning "no filter". Removed from the URL rather than written. */
  allValue?: string;
  label?: string;
}

export function FilterBar({
  options,
  paramName = "segment",
  allValue = "all",
  label = "Filtrér efter type",
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = searchParams.get(paramName) ?? allValue;

  function onValueChange(value: string) {
    // ToggleGroup emits "" when the active item is deselected; treat that as "all".
    const next = value || allValue;

    const params = new URLSearchParams(searchParams.toString());
    if (next === allValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, next);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={onValueChange}
      aria-label={label}
      data-pending={isPending ? "" : undefined}
      className="flex-wrap justify-start gap-2"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="tap-target rounded-full px-4 data-[state=on]:bg-secondary data-[state=on]:text-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
