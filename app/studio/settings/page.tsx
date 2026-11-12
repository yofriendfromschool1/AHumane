import { SettingsPanel } from "@/components/studio/settings-panel";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function StudioSettingsPage() {
  return <SettingsPanel />;
}
