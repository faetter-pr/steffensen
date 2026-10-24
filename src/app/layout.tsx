import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { DEFAULT_SITE_NAME, SITE_URL } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * Root layout (architecture.md §6, §9, §13.2, §13.3).
 * Route-group layouts choose live CMS settings or the independent fixture sandbox.
 */

// §13.2 — headings in a soft serif, body/UI in a clean sans.
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SITE_NAME,
    template: `%s · ${DEFAULT_SITE_NAME}`,
  },
  description:
    "Fotografering af børnehaver, skoler og bryllupper — naturlige billeder, taget på deres præmisser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only bg-background focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
        >
          Spring til indhold
        </a>

        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
