"use client";

import { useState } from "react";
import { Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SAMPLE_RESULTS } from "@/lib/content/site";

export function SampleShowcase() {
  const [index, setIndex] = useState(0);
  const sample = SAMPLE_RESULTS[index]!;

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="flex flex-wrap justify-center gap-2">
        {SAMPLE_RESULTS.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
              i === index
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> AI draft
            </span>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
              94% AI
            </span>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-slate-600">{sample.before}</p>
        </div>
        <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/70 to-white p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> AHumane
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              11% AI
            </span>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-slate-800">{sample.after}</p>
          <Sparkles className="absolute right-5 top-16 h-4 w-4 text-blue-300" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Quote className="h-3.5 w-3.5" aria-hidden="true" />
        Real output from the AHumane engine. Scores from the built-in detector.
      </div>
    </div>
  );
}
