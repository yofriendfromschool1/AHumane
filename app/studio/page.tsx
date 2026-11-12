import { StudioDashboard } from "@/components/studio/dashboard";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function StudioPage() {
  return <StudioDashboard />;
}
