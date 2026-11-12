import { DocumentsWorkspace } from "@/components/studio/documents-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Documents" };

export default function StudioDocumentsPage() {
  return <DocumentsWorkspace />;
}
