import { DetectorWorkspace } from "@/components/studio/detector-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Detector" };

export default function StudioDetectorPage() {
  return <DetectorWorkspace />;
}
