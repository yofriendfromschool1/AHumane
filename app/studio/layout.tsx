import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/shell";

export const metadata: Metadata = {
  title: "Studio",
  description: "AHumane writing studio.",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
