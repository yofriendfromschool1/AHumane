import { WriterWorkspace } from "@/components/studio/writer-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Writer" };

export default function StudioWriterPage() {
  return <WriterWorkspace />;
}
