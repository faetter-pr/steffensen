import fixtures from "@/mock/fixtures.json";

import type { SbBlokBase, Segment } from "@/lib/storyblok/types";

/**
 * Typed access to the design-sandbox fixtures in fixtures.json.
 *
 * Sandbox-only: nothing in the real data path imports this. See /preview.
 */

export interface FixtureVariant {
  name: string;
  /** Applies a data-segment wrapper so segment theming can be reviewed. */
  segment: Segment | null;
  blok: SbBlokBase;
}

export interface FixtureBlock {
  label: string;
  notes?: string;
  variants: FixtureVariant[];
}

interface FixtureFile {
  blocks: Record<string, FixtureBlock>;
}

// The JSON import is `unknown`-shaped to TypeScript; this is the one place it is
// given a shape, and it is sandbox data rather than anything user-facing.
const file = fixtures as unknown as FixtureFile;

export const FIXTURE_BLOCKS = file.blocks;

export function getFixtureBlock(key: string): FixtureBlock | undefined {
  return Object.prototype.hasOwnProperty.call(FIXTURE_BLOCKS, key)
    ? FIXTURE_BLOCKS[key]
    : undefined;
}

export function listFixtureKeys(): string[] {
  return Object.keys(FIXTURE_BLOCKS).sort();
}
