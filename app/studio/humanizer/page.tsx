import { HumanizerWorkspace } from "@/components/studio/humanizer-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Humanizer" };

export default function StudioHumanizerPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Pro engine", "Model rewrite, fact check, then a second pass. Free."],
          ["Meaning lock", "Numbers, names, quotes, and citations are protected."],
          ["Review", "Every changed sentence shows its reason. You decide."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-xs font-semibold text-neutral-800">{title}</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-600">{body}</p>
          </div>
        ))}
      </div>
      <HumanizerWorkspace />
    </div>
  );
}
