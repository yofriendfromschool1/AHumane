"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  FileSearch,
  Globe2,
  Loader2,
  Search,
} from "lucide-react";
import { countWords } from "@/lib/utils/text";
import type { PlagiarismResult } from "@/lib/plagiarism";
import { ScoreGauge } from "@/components/ui/score-gauge";

const SAMPLES: Array<{ label: string; text: string }> = [
  {
    label: "Copied passage",
    text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.`,
  },
  {
    label: "Mixed draft",
    text: `Remote work has changed the shape of the workday. It is important to note that employees now report higher levels of autonomy and lower levels of commuting stress. I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach. But there is a cost that the productivity dashboards rarely capture. The spontaneous conversation that used to happen by the coffee machine now has to be scheduled.`,
  },
  {
    label: "Original",
    text: `The first thing I noticed about the new office was the silence. Not the focused silence of a library, but the flat, airless quiet of a room full of people pretending to be busy. The plants were fake. The coffee was real but tasted like it had been brewed for a meeting that ended hours ago. I sat at my assigned desk and opened my laptop, and for the first time in three years I missed the noise of my kitchen.`,
  },
];

export function PlagiarismWorkspace() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [web, setWeb] = useState(true);
  const [error, setError] = useState("");
  const words = useMemo(() => countWords(text), [text]);

  async function run() {
    if (words < 8) {
      setError("Paste at least a few sentences to check.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/plagiarism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, web }),
      });
      const data = (await response.json()) as PlagiarismResult & { error?: string };
      if (!response.ok) throw new Error(data.error || "The check could not finish.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileSearch className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Plagiarism Checker</p>
              <p className="text-[10px] text-neutral-500">Local corpus + Wikipedia</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
            Beta
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-neutral-100 px-4 py-2">
          <span className="mr-1 self-center text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Try
          </span>
          {SAMPLES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setText(sample.text);
                setResult(null);
              }}
              className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste an essay, article, or report. The checker compares 8-word sequences against a public-domain corpus and, optionally, Wikipedia."
          className="min-h-[360px] w-full resize-y bg-transparent px-4 py-3 text-[15px] leading-7 text-neutral-800 outline-none placeholder:text-neutral-500"
          spellCheck
          aria-label="Text to check for plagiarism"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void run()}
              disabled={loading || words === 0}
              className="btn btn-primary h-10 px-5 text-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Checking…" : "Check for plagiarism"}
            </button>
            <label className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500">
              <input
                type="checkbox"
                checked={web}
                onChange={(event) => setWeb(event.target.checked)}
                className="h-3.5 w-3.5 accent-blue-600"
              />
              <Globe2 className="h-3 w-3" /> Wikipedia
            </label>
          </div>
          <span className="text-[11px] tabular-nums text-neutral-500">
            {words.toLocaleString()} words
          </span>
        </div>

        {error ? (
          <div role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          {result ? (
            <>
              <div className="flex flex-col items-center">
                <ScoreGauge value={result.score} label="matched" size={160} tone={result.score > 20 ? "amber" : "emerald"} />
                <p className="mt-2 text-sm font-semibold text-neutral-900">
                  {result.score === 0 ? "No matching passages found" : `${result.score}% of the text matched`}
                </p>
                <p className="mt-1 text-center text-[11px] text-neutral-500">
                  {result.words} words · {result.sources.length} source{result.sources.length === 1 ? "" : "s"}
                </p>
              </div>

              {result.sources.length ? (
                <div className="mt-4 space-y-2">
                  {result.sources.map((source) => (
                    <div key={source.id} className="rounded-lg border border-neutral-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-neutral-800">{source.title}</p>
                          <p className="mt-0.5 text-[10px] text-neutral-500">{source.domain}</p>
                        </div>
                        <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {source.coverage}%
                        </span>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:underline"
                      >
                        Open source <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                  Nothing in the local corpus or the Wikipedia results overlapped by eight or more
                  consecutive words.
                </p>
              )}

              {result.warnings.length ? (
                <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-2.5 text-[10px] leading-4 text-amber-800">
                  {result.warnings.join(" ")}
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <FileSearch className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-neutral-700">No check yet</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500">
                Paste a draft to compare it against public-domain books, speeches, and Wikipedia.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-amber-900">What this checker is not</p>
              <p className="mt-1 text-[11px] leading-5 text-amber-900">
                It is not Turnitin. It checks a small public-domain corpus and Wikipedia search
                results — not the entire web, paywalled journals, or your school's submission
                database. Use it to catch obvious copied passages and missing quotes, not as a
                certificate of originality.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold text-neutral-800">Method</p>
          <ul className="mt-2 space-y-1 text-[11px] leading-5 text-neutral-500">
            <li className="flex items-start gap-1.5">
              <Check className="mt-0.5 h-3 w-3 text-emerald-500" /> 8-word shingle overlap
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="mt-0.5 h-3 w-3 text-emerald-500" /> Local public-domain source index
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="mt-0.5 h-3 w-3 text-emerald-500" /> Optional English Wikipedia comparison
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
