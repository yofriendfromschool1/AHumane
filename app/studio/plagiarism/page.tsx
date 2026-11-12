import { PlagiarismWorkspace } from "@/components/studio/plagiarism-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Plagiarism Checker" };

export default function StudioPlagiarismPage() {
  return <PlagiarismWorkspace />;
}
