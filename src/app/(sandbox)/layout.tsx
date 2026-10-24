import type { ReactNode } from "react";

import { SiteFrame } from "@/components/layout/site-frame";

export default function SandboxLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>;
}
