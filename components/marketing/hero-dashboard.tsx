"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  ScanSearch,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LogoMark } from "@/components/brand/logo";

const AI_TEXT =
  "In today's fast-paced digital landscape, artificial intelligence has emerged as a pivotal force that is fundamentally reshaping the way we work, learn, and communicate. It is important to note that these technologies offer a myriad of benefits.";
const HUMAN_TEXT =
  "AI is changing how we work. That sounds obvious, but the day-to-day shift is stranger than the headlines suggest. The useful part is not the magic trick. It's the quiet stuff: a first draft that no longer starts with a blank page.";

type Phase = "idle" | "ai" | "working" | "human";

export function HeroDashboard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [aiChars, setAiChars] = useState(0);
  const [humanChars, setHumanChars] = useState(0);
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setAiChars(AI_TEXT.length);
      setHumanChars(HUMAN_TEXT.length);
      setPhase("human");
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    async function run() {
      await wait(500);
      if (cancelled) return;
      setPhase("ai");
      for (let i = 0; i <= AI_TEXT.length; i += 3) {
        if (cancelled) return;
        setAiChars(Math.min(AI_TEXT.length, i));
        await wait(12);
      }
      setAiChars(AI_TEXT.length);
      await wait(650);
      if (cancelled) return;
      setPhase("working");
      await wait(1100);
      if (cancelled) return;
      setPhase("human");
      for (let i = 0; i <= HUMAN_TEXT.length; i += 3) {
        if (cancelled) return;
        setHumanChars(Math.min(HUMAN_TEXT.length, i));
        await wait(10);
      }
      setHumanChars(HUMAN_TEXT.length);
    }

    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion]);

  const humanizing = phase === "working";

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[70%] rounded-full bg-gradient-to-b from-blue-300/50 to-transparent blur-[90px]"
      />
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Browser bar */}
        <div className="flex h-10 items-center gap-2 border-b border-neutral-200 bg-neutral-50/80 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <div className="ml-3 flex-1 rounded-md border border-neutral-200 bg-white px-3 py-1 text-[10px] text-neutral-600">
            ahumane.app/studio/humanizer
          </div>
        </div>

        <div className="flex min-h-[430px]">
          {/* Sidebar */}
          <aside className="hidden w-[168px] shrink-0 border-r border-neutral-200 bg-white p-3 sm:block">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <LogoMark className="h-6 w-6" />
              <span className="text-sm font-semibold tracking-tight">AHumane</span>
            </div>
            <div className="mt-4 space-y-0.5">
              <SideItem icon={LayoutDashboard} label="Dashboard" />
              <SideItem icon={FileText} label="Documents" />
            </div>
            <p className="mt-5 px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
              Tools
            </p>
            <div className="mt-1 space-y-0.5">
              <SideItem icon={Sparkles} label="Humanizer" active />
              <SideItem icon={ScanSearch} label="AI Detector" />
              <SideItem icon={Wand2} label="AI Writer" />
            </div>
            <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-2.5">
              <p className="text-[10px] font-semibold text-blue-700">Pro is free</p>
              <p className="mt-1 text-[9px] leading-4 text-blue-700">
                Every mode, every word. No account.
              </p>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-600">
                  Studio / Humanizer
                </p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                  Untitled draft
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Unlimited
                </span>
                <span className="hidden items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-[10px] text-neutral-600 sm:inline-flex">
                  English <ChevronDown className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50/60 px-3 py-2">
                <div className="flex rounded-md border border-neutral-200 bg-white p-0.5 text-[10px]">
                  <span className="rounded px-2 py-1 text-neutral-600">Basic</span>
                  <span className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 font-medium text-white">
                    <Sparkles className="h-2.5 w-2.5" /> Pro
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-neutral-600">
                  <span className="rounded bg-white px-1.5 py-0.5 ring-1 ring-neutral-200">
                    Natural
                  </span>
                  <span>Strength 4</span>
                </div>
              </div>

              <div className="grid min-h-[290px] grid-cols-1 sm:grid-cols-2">
                <div className="relative border-b border-neutral-200 p-3 sm:border-b-0 sm:border-r">
                  <div className="mb-2 flex items-center justify-between text-[9px] font-medium uppercase tracking-wider text-neutral-600">
                    <span>Input</span>
                    <span>{aiChars > 0 ? "AI text" : "Paste text"}</span>
                  </div>
                  <p className="text-[11px] leading-[1.7] text-neutral-600">
                    {AI_TEXT.slice(0, aiChars)}
                    {phase === "ai" ? <span className="caret" /> : null}
                    {aiChars === 0 ? (
                      <span className="text-neutral-600">Paste AI text here…</span>
                    ) : null}
                  </p>
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                    <button
                      type="button"
                      tabIndex={-1}
                      className="pointer-events-none inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-medium text-white"
                    >
                      <Sparkles className="h-3 w-3" /> Humanize
                    </button>
                    <span className="text-[9px] tabular-nums text-neutral-600">
                      {Math.round((aiChars / AI_TEXT.length) * 61)} / 2,500 words
                    </span>
                  </div>
                </div>

                <div className="relative p-3">
                  <div className="mb-2 flex items-center justify-between text-[9px] font-medium uppercase tracking-wider text-neutral-600">
                    <span>Output</span>
                    {phase === "human" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                        AI 94% → 11%
                      </span>
                    ) : (
                      <span className="text-neutral-600">Humanized</span>
                    )}
                  </div>
                  {humanizing ? (
                    <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-blue-600">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
                      </span>
                      <span className="text-[10px] font-medium">Humanizing, pass 2 of 4…</span>
                    </div>
                  ) : (
                    <p className="text-[11px] leading-[1.7] text-neutral-700">
                      {HUMAN_TEXT.slice(0, humanChars)}
                      {phase === "human" && humanChars < HUMAN_TEXT.length ? (
                        <span className="caret" />
                      ) : null}
                      {humanChars === 0 ? (
                        <span className="text-neutral-600">
                          Your humanized text will appear here.
                        </span>
                      ) : null}
                    </p>
                  )}
                  {phase === "human" ? (
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[9px] text-neutral-600">
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        14 facts preserved
                      </span>
                      <span>54 words</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[9px] text-neutral-600">
                <span className="rounded border border-neutral-200 px-1.5 py-0.5">Readability 62</span>
                <span className="rounded border border-neutral-200 px-1.5 py-0.5">Burstiness +38%</span>
                <span className="hidden rounded border border-neutral-200 px-1.5 py-0.5 sm:inline">
                  Meaning lock on
                </span>
              </div>
              <Link
                href="/studio/humanizer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Try the real thing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function SideItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof FileText;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px]",
        active ? "bg-blue-50 font-medium text-blue-700" : "text-neutral-600",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </div>
  );
}
