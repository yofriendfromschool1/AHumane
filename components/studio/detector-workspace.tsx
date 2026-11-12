"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Info,
  Loader2,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { countWords } from "@/lib/utils/text";
import type { DetectionResult } from "@/lib/detector/score";
import { ScoreGauge } from "@/components/ui/score-gauge";

const SAMPLES: Array<{ label: string; text: string }> = [
  {
    label: "ChatGPT-style",
    text: `In today's rapidly evolving digital landscape, artificial intelligence has become a pivotal component of modern life. It is important to note that AI systems offer a myriad of benefits, from streamlining repetitive tasks to fostering innovation across industries. Moreover, the integration of these technologies into everyday workflows serves as a testament to human ingenuity. Consequently, organizations that leverage AI effectively can unlock unprecedented levels of productivity and gain a significant competitive advantage. Additionally, the proliferation of AI-powered tools has democratized access to capabilities that were once reserved for large enterprises. However, it is crucial to acknowledge that this transformation is not without its challenges. Issues such as data privacy, algorithmic bias, and workforce displacement must be addressed through thoughtful regulation and ethical governance. Ultimately, the future of AI will depend on our collective ability to harness its potential responsibly while mitigating its risks.`,
  },
  {
    label: "Claude-style",
    text: `The question of how cities should adapt to a warming climate is not merely technical. It is also a question about who gets to decide, who bears the cost, and what kind of public life we want to preserve. Consider the humble shade tree. A mature canopy can lower surface temperatures by several degrees, reduce energy demand, and make a sidewalk usable on a hot afternoon. Yet tree cover is distributed unevenly, often along the same lines as income and race. Planners who treat shade as decoration miss the point. It is infrastructure, and like any infrastructure, it has to be maintained, funded, and argued over.`,
  },
  {
    label: "Human-written",
    text: `My grandmother kept a radio in the kitchen, tuned to a station that played old show tunes and read the obituaries on Sunday mornings. She called it "the house" and would not let anyone move it, even after the dial broke and the only sound it made was static. I asked her once why she kept it. She said, "Because your grandfather used to sing along." That was the whole answer. No lesson, no tidy conclusion. Just a woman standing at a counter, peeling potatoes, listening to a dead man's favorite song.`,
  },
  {
    label: "Mixed",
    text: `Remote work has changed the shape of the workday. It is important to note that employees now report higher levels of autonomy and lower levels of commuting stress. Moreover, organizations benefit from access to a broader talent pool. But there is a cost that the productivity dashboards rarely capture. The spontaneous conversation that used to happen by the coffee machine now has to be scheduled, and the people who are best at asking for help are often the ones who already have the most context. That is the part I keep coming back to.`,
  },
];

export function DetectorWorkspace({ initialText = "" }: { initialText?: string }) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSignal, setOpenSignal] = useState<string | null>(null);
  const [openSentence, setOpenSentence] = useState<number | null>(null);

  const words = useMemo(() => countWords(text), [text]);

  async function scan() {
    if (words < 3) {
      setError("Paste at least a few words to scan.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await response.json()) as DetectionResult & { error?: string };
      if (!response.ok) throw new Error(data.error || "The scan could not finish.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function humanizeThis() {
    try {
      window.sessionStorage.setItem("ahumane:pending", text);
    } catch {
      // ignore
    }
    router.push("/studio/humanizer?from=detector");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ScanSearch className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">AI Detector</p>
              <p className="text-[10px] text-neutral-500">Sentence-level analysis</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
            Free · unlimited
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
              className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste an essay, article, email, or draft to see what the detector notices. 150+ words gives a more reliable read."
          className="min-h-[340px] w-full resize-y bg-transparent px-4 py-3 text-[15px] leading-7 text-neutral-800 outline-none placeholder:text-neutral-500"
          spellCheck
          aria-label="Text to scan for AI signals"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 px-4 py-3">
          <button
            type="button"
            onClick={() => void scan()}
            disabled={loading || words === 0}
            className="btn btn-primary h-10 px-5 text-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ScanSearch className="h-4 w-4" aria-hidden="true" />}
            {loading ? "Scanning…" : "Scan for AI"}
          </button>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
            <span>{words.toLocaleString()} / 25,000 words</span>
            {result ? (
              <button
                type="button"
                onClick={humanizeThis}
                className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
              >
                <Sparkles className="h-3 w-3" /> Humanize this text
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          {result ? (
            <>
              <div className="flex flex-col items-center">
                <ScoreGauge value={result.score} label="likely AI" size={170} />
                <p className="mt-2 text-sm font-semibold text-neutral-900">{result.verdict}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Confidence: {result.confidence} · {result.wordCount} words · {result.sentenceCount} sentences
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-xs">
                <span className="text-neutral-500">AI likelihood</span>
                <span className="font-semibold text-rose-700">{result.score}%</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-500">Human</span>
                <span className="font-semibold text-emerald-700">{result.humanScore}%</span>
              </div>

              {result.topPhrases.length ? (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    Phrases it noticed
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.topPhrases.map((phrase) => (
                      <span key={phrase} className="rounded bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <ScanSearch className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-neutral-700">No scan yet</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500">
                Paste a draft and run the detector. You will get a score, a sentence heat-map, and the signals behind it.
              </p>
            </div>
          )}
        </div>

        {result ? (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">Signal breakdown</h3>
                <span className="text-[10px] text-neutral-500">Top contributors</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {result.signals.slice(0, 6).map((signal) => (
                  <button
                    key={signal.key}
                    type="button"
                    onClick={() => setOpenSignal(openSignal === signal.key ? null : signal.key)}
                    className="w-full rounded-lg border border-neutral-100 px-3 py-2 text-left transition-colors hover:bg-neutral-50"
                    aria-expanded={openSignal === signal.key}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-neutral-700">{signal.label}</span>
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100">
                          <span
                            className="block h-full rounded-full bg-rose-400"
                            style={{ width: `${Math.max(4, signal.value * 100)}%` }}
                          />
                        </span>
                        <ChevronDown
                          className={cn("h-3 w-3 text-neutral-500 transition-transform", openSignal === signal.key && "rotate-180")}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    {openSignal === signal.key ? (
                      <span className="mt-1.5 block text-[11px] leading-5 text-neutral-500">{signal.detail}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">Sentence heat-map</h3>
                <span className="text-[10px] text-neutral-500">Click a sentence</span>
              </div>
              <div className="mt-3 max-h-[360px] space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
                {result.sentences.map((sentence) => {
                  const tone =
                    sentence.score >= 70
                      ? "border-rose-200 bg-rose-50/60"
                      : sentence.score >= 45
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-emerald-200 bg-emerald-50/50";
                  return (
                    <button
                      key={sentence.index}
                      type="button"
                      onClick={() => setOpenSentence(openSentence === sentence.index ? null : sentence.index)}
                      className={cn("w-full rounded-lg border px-3 py-2 text-left text-xs leading-5 transition-colors", tone)}
                      aria-expanded={openSentence === sentence.index}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-neutral-700">{sentence.text}</span>
                        <span className="shrink-0 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-neutral-600">
                          {sentence.score}%
                        </span>
                      </span>
                      {openSentence === sentence.index && sentence.reasons.length ? (
                        <span className="mt-1.5 block border-t border-black/5 pt-1.5 text-[11px] text-neutral-500">
                          {sentence.reasons.join(" · ")}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-blue-900">Read this before you panic</p>
                  <ul className="mt-1.5 space-y-1 text-[11px] leading-5 text-blue-900">
                    {result.limitations.slice(0, 3).map((limitation) => (
                      <li key={limitation}>· {limitation}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={humanizeThis}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                Open this draft in the humanizer <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-amber-900">Detection is probabilistic</p>
                <p className="mt-1 text-[11px] leading-5 text-amber-900">
                  AHumane's detector is a transparent style analysis, not a verdict. It can be wrong —
                  especially on formal, non-native, or heavily edited writing. Use it to spot patterns,
                  not to certify authorship.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
