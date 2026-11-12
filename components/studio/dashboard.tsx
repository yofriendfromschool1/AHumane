"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  PenLine,
  ScanSearch,
  Sparkles,
  TrendingDown,
  Wand2,
} from "lucide-react";
import { loadDocuments, loadHistory, type StoredDocument, type StoredRun } from "@/lib/studio/storage";
import { formatRelativeTime } from "@/lib/studio/storage";

export function StudioDashboard() {
  const [history, setHistory] = useState<StoredRun[]>([]);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  useEffect(() => {
    const refresh = () => {
      setHistory(loadHistory());
      setDocuments(loadDocuments());
    };
    refresh();
    window.addEventListener("ahumane:history", refresh);
    window.addEventListener("ahumane:documents", refresh);
    return () => {
      window.removeEventListener("ahumane:history", refresh);
      window.removeEventListener("ahumane:documents", refresh);
    };
  }, []);

  const stats = useMemo(() => {
    const words = history.reduce((sum, run) => sum + run.output.split(/\s+/).length, 0);
    const drops = history
      .filter((run) => run.beforeScore > 0)
      .map((run) => (run.beforeScore - run.afterScore) / run.beforeScore);
    const avgDrop = drops.length ? Math.round((drops.reduce((a, b) => a + b, 0) / drops.length) * 100) : 0;
    return [
      { label: "Humanizer runs", value: history.length.toString(), icon: Sparkles },
      { label: "Words humanized", value: words.toLocaleString(), icon: PenLine },
      { label: "Avg. AI score drop", value: `${avgDrop}%`, icon: TrendingDown },
      { label: "Saved documents", value: documents.length.toString(), icon: FileText },
    ];
  }, [documents.length, history]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              Welcome back
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">What are we writing today?</h2>
            <p className="mt-1 text-sm text-slate-600">
              The Pro humanizer is free. Your history stays in this browser.
            </p>
          </div>
          <Link href="/studio/humanizer" className="btn btn-primary h-11 px-5 text-sm">
            <Sparkles className="h-4 w-4" /> New humanization
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-neutral-200 p-4">
              <stat.icon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/studio/humanizer", label: "Humanizer", body: "Rewrite a draft", icon: Sparkles, color: "text-blue-600 bg-blue-50" },
          { href: "/studio/detector", label: "AI Detector", body: "Scan for signals", icon: ScanSearch, color: "text-rose-700 bg-rose-50" },
          { href: "/studio/plagiarism", label: "Plagiarism", body: "Check sources", icon: BookOpen, color: "text-amber-600 bg-amber-50" },
          { href: "/studio/writer", label: "AI Writer", body: "Start an outline", icon: Wand2, color: "text-emerald-700 bg-emerald-50" },
        ].map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tool.color}`}>
              <tool.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold">{tool.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-600">{tool.body}</p>
            <ArrowRight className="mt-3 h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent humanizations</h2>
            <Link href="/studio/humanizer" className="text-[11px] font-medium text-blue-600 hover:text-blue-700">
              Open humanizer
            </Link>
          </div>
          {history.length ? (
            <ul className="mt-3 divide-y divide-neutral-100">
              {history.slice(0, 6).map((run) => (
                <li key={run.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-neutral-800">{run.title}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-500">
                      {formatRelativeTime(run.createdAt)} · {run.mode} · AI {run.beforeScore}% → {run.afterScore}%
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    −{run.beforeScore > 0 ? Math.round(((run.beforeScore - run.afterScore) / run.beforeScore) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-neutral-200 p-6 text-center">
              <p className="text-xs font-medium text-neutral-600">No runs yet</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Paste a draft into the humanizer and it will show up here.
              </p>
              <Link href="/studio/humanizer" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                Start a run <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold">A good first pass</h2>
          <ol className="mt-3 space-y-3 text-xs text-slate-600">
            {[
              "Paste the AI draft into the humanizer.",
              "Choose Pro and Natural. Strength 4 is a good default.",
              "Read the Review tab before you copy anything.",
              "Run it again if a sentence feels off. A new seed gives a new variant.",
            ].map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-700">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-800">
            No detector can certify authorship. Use the score as a diagnostic, not a guarantee.
          </div>
        </div>
      </div>
    </div>
  );
}
