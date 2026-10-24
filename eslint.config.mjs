import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * The rules below are the machine-enforced half of CLAUDE.md "Hard rules".
 * If you change one here, change it there too.
 */

/** Layers 1-2 (ui/, photo/, layout/) must not import from Storyblok. */
const NO_STORYBLOK_IN_LOWER_LAYERS = {
  patterns: [
    {
      group: ["@storyblok/*", "@storyblok/**"],
      message:
        "Layer 1-2 components must stay CMS-agnostic (architecture.md §5). Take plain props from a Layer 3 block in components/blocks/ instead.",
    },
    {
      group: ["@/lib/storyblok", "@/lib/storyblok/*", "**/lib/storyblok/*"],
      message:
        "Layer 1-2 components must stay CMS-agnostic (architecture.md §5). Take plain props from a Layer 3 block in components/blocks/ instead.",
    },
  ],
};

/** All images go through <PhotoImage>. */
const NO_DIRECT_IMAGE = {
  paths: [
    {
      name: "next/image",
      message:
        "Use <PhotoImage> from @/components/photo/photo-image instead (architecture.md §8). next/image is only allowed inside photo-image.tsx.",
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    ".storyblok/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/ui/**", // vendored shadcn output; not ours to lint
    "src/lib/storyblok/generated.d.ts", // storyblok-generate-ts output; regenerated, not edited
  ]),

  {
    name: "steffensenfoto/hard-rules",
    rules: {
      // "No `any`. Types come from the generated Storyblok types."
      "@typescript-eslint/no-explicit-any": "error",

      // "Never use raw <img>."
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='img']",
          message:
            "Never use a raw <img>. Use <PhotoImage> from @/components/photo/photo-image (architecture.md §8).",
        },
      ],
    },
  },

  {
    name: "steffensenfoto/layer-boundaries",
    files: [
      "src/components/photo/**/*.{ts,tsx}",
      "src/components/layout/**/*.{ts,tsx}",
      "src/components/forms/**/*.{ts,tsx}",
      "src/components/motion/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": ["error", NO_STORYBLOK_IN_LOWER_LAYERS],
    },
  },

  {
    name: "steffensenfoto/blocks-use-photoimage",
    files: ["src/components/blocks/**/*.{ts,tsx}", "src/components/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", NO_DIRECT_IMAGE],
    },
  },

  {
    /**
     * photo-image.tsx is the ONE sanctioned exception to the layer rule.
     *
     * architecture.md §8 requires PhotoImage to drive the Storyblok Image Service, and
     * §6 puts those helpers in lib/storyblok/image-loader.ts. So this file may import
     * that pure URL-building module — but still NOT the SDK, and it must keep taking
     * plain props rather than bloks.
     */
    name: "steffensenfoto/photo-image-exemption",
    files: ["src/components/photo/photo-image.tsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [NO_STORYBLOK_IN_LOWER_LAYERS.patterns[0]] }],
    },
  },
]);

export default eslintConfig;
