"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { diffWordsWithSpace } from "diff";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  History,
  Info,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { countWords } from "@/lib/utils/text";
import type { HumanizeResult, HumanizerMode, HumanizerStyle } from "@/lib/humanizer/types";
import { STYLE_DESCRIPTIONS, STYLE_LABELS } from "@/lib/humanizer/types";
import type { DetectionResult } from "@/lib/detector/score";
import {
  copyText,
  deleteRun,
  downloadText,
  formatRelativeTime,
  HISTORY_EVENT,
  loadHistory,
  saveRun,
  type StoredRun,
} from "@/lib/studio/storage";
import { toast } from "@/components/ui/toast";

const SAMPLE = `In today's fast-paced digital landscape, artificial intelligence has emerged as a pivotal force that is fundamentally reshaping the way we work, learn, and communicate. It is important to note that these technologies offer a myriad of benefits, from streamlining repetitive tasks to fostering unprecedented levels of creativity and collaboration. Moreover, the integration of AI into everyday workflows serves as a testament to human ingenuity and underscores the importance of adapting to an ever-evolving technological environment. Consequently, organizations that leverage these tools effectively can unlock the full potential of their teams and gain a significant competitive advantage. Additionally, the proliferation of AI-powered platforms has democratized access to advanced capabilities that were once reserved for large enterprises. However, it is crucial to acknowledge that this transformation is not without its challenges. Issues such as data privacy, algorithmic bias, and the displacement of certain job roles must be addressed through thoughtful regulation and ethical governance. Ultimately, the future of AI will depend on our collective ability to harness its potential responsibly while mitigating its risks.`;

const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "nl", label: "Dutch" },
];

const PHASES = [
  "Reading structure",
  "Removing AI tells",
  "Rebuilding rhythm",
  "Auditing with the detector",
  "Final polish",
];

interface ApiResponse {
  result: HumanizeResult;
  before: DetectionResult;
  after: DetectionResult;
}

export function HumanizerWorkspace({
  initialText = "",
  compact = false,
}: {
  initialText?: string;
  compact?: boolean;
}) {
  const [text, setText] = useState(initialText);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<HumanizerMode>("pro");
  const [style, setStyle] = useState<HumanizerStyle>("natural");
  const [strength, setStrength] = useState(4);
  const [language, setLanguage] = useState("en");
  const [seed, setSeed] = useState(42);
  const [useModel, setUseModel] = useState(true);
  const [modelAvailable, setModelAvailable] = useState<string | null>(null);
  const [cloudRewrite, setCloudRewrite] = useState(false);
  const [modelChoice, setModelChoice] = useState("auto");
  const [modelOptions, setModelOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [tab, setTab] = useState<"editor" | "review" | "history">("editor");
  const [mobilePane, setMobilePane] = useState<"input" | "output">("output");
  const [history, setHistory] = useState<StoredRun[]>([]);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ahumane.settings.v1");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          mode?: HumanizerMode;
          style?: HumanizerStyle;
          strength?: number;
          language?: string;
        };
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.style) setStyle(parsed.style);
        if (parsed.strength) setStrength(parsed.strength);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch {
      // defaults are fine
    }
    fetch("/api/health")
      .then((response) => response.json())
      .then((data: {
        cloud?: { available?: boolean; model?: string | null; models?: string[] };
        ollama?: {
          available?: boolean;
          models?: string[];
          details?: Array<{ name: string; size?: number }>;
        };
        openaiCompatible?: boolean;
        preferLocal?: boolean;
      }) => {
        const options: Array<{ value: string; label: string }> = [
          { value: "auto", label: "Auto (best available)" },
        ];
        if (data.cloud?.available) {
          const models = data.cloud.models?.length
            ? data.cloud.models
            : data.cloud.model
              ? [data.cloud.model]
              : [];
          for (const model of models.slice(0, 8)) {
            options.push({ value: `ovh:${model}`, label: `Cloud · ${model}` });
          }
        }
        const rawDetails: Array<{ name: string; size?: number }> =
          data.ollama?.details ??
          (data.ollama?.models ?? []).map((name) => ({ name }));
        const details = rawDetails.sort(
          (a, b) => (a.size ?? Number.MAX_SAFE_INTEGER) - (b.size ?? Number.MAX_SAFE_INTEGER),
        );
        for (const model of details) {
          const size = model.size ? ` (${(model.size / 1e9).toFixed(1)} GB)` : "";
          options.push({ value: `ollama:${model.name}`, label: `Local · ${model.name}${size}` });
        }
        if (data.openaiCompatible) {
          options.push({ value: "openai-compatible", label: "Custom / Unsloth (vLLM)" });
        }
        setModelOptions(options);
        let saved: string | null = null;
        try {
          saved = window.localStorage.getItem("ahumane.model.v1");
        } catch {
          saved = null;
        }
        const localOption = options.find((option) => option.value.startsWith("ollama:"));
        const selected = options.some((option) => option.value === saved)
          ? saved!
          : data.preferLocal && localOption
            ? localOption.value
            : options.length > 1
              ? options[1]!.value
              : "auto";
        setModelChoice(selected);
        setModelAvailable(options.find((option) => option.value === selected)?.label ?? null);
        setCloudRewrite(selected.startsWith("ovh") || (selected === "auto" && Boolean(data.cloud?.available)));
        setUseModel(Boolean(data.cloud?.available || data.ollama?.available || data.openaiCompatible));
      })
      .catch(() => setModelAvailable(null));
    setHistory(loadHistory());
    const onHistory = () => setHistory(loadHistory());
    window.addEventListener(HISTORY_EVENT, onHistory);
    return () => window.removeEventListener(HISTORY_EVENT, onHistory);
  }, []);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      return;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const handoff = params.get("handoff");
      if (handoff) {
        const normalized = handoff.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "===".slice((normalized.length + 3) % 4);
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        setText(new TextDecoder().decode(bytes));
        return;
      }
      if (params.get("from") === "detector") {
        const pending = window.sessionStorage.getItem("ahumane:pending");
        if (pending) setText(pending);
      }
    } catch {
      // a malformed handoff should never block the editor
    }
  }, [initialText]);

  useEffect(() => {
    if (!loading) {
      setPhase(0);
      return;
    }
    const timer = setInterval(() => {
      setPhase((value) => (value + 1) % PHASES.length);
    }, 900);
    return () => clearInterval(timer);
  }, [loading]);

  const wordsIn = useMemo(() => countWords(text), [text]);
  const wordsOut = useMemo(() => countWords(output), [output]);

  const run = useCallback(
    async (nextSeed = seed, nextMode = mode) => {
      const trimmed = text.trim();
      if (trimmed.length < 12) {
        setError("Paste at least a sentence or two so the engine has something to work with.");
        return;
      }
      if (wordsIn > 25000) {
        setError("This draft is over the 25,000-word sanity limit. Split it into parts.");
        return;
      }
      setLoading(true);
      setError("");
      setCopied(false);
      setMobilePane("output");
      try {
        const res = await fetch("/api/humanize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: trimmed,
            mode: nextMode,
            style,
            strength,
            language,
            seed: nextSeed,
            useModel,
            provider: modelChoice.startsWith("auto")
              ? "auto"
              : (modelChoice.split(":")[0] as
                  | "auto"
                  | "ovh"
                  | "ollama"
                  | "openai-compatible"),
            model: modelChoice.startsWith("auto")
              ? undefined
              : modelChoice.split(":").slice(1).join(":") || undefined,
          }),
        });
        const data = (await res.json()) as ApiResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error || "The humanizer could not finish that request.");
        }
        setResponse(data);
        setOutput(data.result.output);
        setSeed(nextSeed);
        const runRecord: StoredRun = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
          title: trimmed.slice(0, 60),
          input: trimmed,
          output: data.result.output,
          mode: nextMode,
          style,
          strength,
          language,
          beforeScore: data.before.score,
          afterScore: data.after.score,
          passes: data.result.stats.passes,
        };
        setHistory(saveRun(runRecord));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [language, mode, modelChoice, seed, strength, style, text, useModel, wordsIn],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!loading) void run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, run]);

  async function handleFile(file: File) {
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      setError("That file is larger than 4 MB. Paste the text instead.");
      return;
    }
    const lower = file.name.toLowerCase();
    try {
      if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".markdown")) {
        const content = await file.text();
        setText(content);
        return;
      }
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/parse-document", { method: "POST", body: form });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error || "Could not read that file.");
      setText(data.text);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read that file.");
    }
  }

  async function handleCopy() {
    if (!output) return;
    const ok = await copyText(output);
    if (ok) {
      setCopied(true);
      toast("Copied the humanized text.");
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError("Your browser blocked clipboard access. Select the text and copy it manually.");
    }
  }

  function restore(record: StoredRun) {
    setText(record.input);
    setOutput(record.output);
    setMode(record.mode);
    setStyle(record.style as HumanizerStyle);
    setStrength(record.strength);
    setLanguage(record.language);
    setResponse(null);
    setTab("editor");
    setMobilePane("output");
  }

  const diffParts = useMemo(
    () => (response ? diffWordsWithSpace(text, output) : []),
    [output, response, text],
  );

  return (
    <div className={cn("w-full", compact ? "" : "mx-auto max-w-[1280px]")}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-slate-900/5">
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5" role="tablist" aria-label="Humanizer mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "basic"}
                onClick={() => setMode("basic")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  mode === "basic" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                Basic
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "pro"}
                onClick={() => setMode("pro")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  mode === "pro" ? "bg-blue-600 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Pro
              </button>
            </div>
            <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 sm:inline">
              Pro · free
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="sr-only">Writing style</span>
              <select
                value={style}
                onChange={(event) => setStyle(event.target.value as HumanizerStyle)}
                className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs text-neutral-700"
              >
                {Object.entries(STYLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="hidden items-center gap-1.5 text-[11px] text-neutral-500 sm:flex">
              Strength
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={strength}
                onChange={(event) => setStrength(Number(event.target.value))}
                className="h-1.5 w-16 accent-blue-600"
                aria-label="Humanization strength"
              />
              <span className="w-3 text-center font-medium text-neutral-800">{strength}</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="sr-only">Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs text-neutral-700"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {useModel && mode === "pro" && modelOptions.length > 1 ? (
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="sr-only">Deep rewrite model</span>
                <select
                  value={modelChoice}
                  onChange={(event) => {
                    const value = event.target.value;
                    setModelChoice(value);
                    setModelAvailable(
                      modelOptions.find((option) => option.value === value)?.label ?? null,
                    );
                    setCloudRewrite(value.startsWith("ovh") || value === "auto");
                    try {
                      window.localStorage.setItem("ahumane.model.v1", value);
                    } catch {
                      // storage is optional
                    }
                  }}
                  className="h-8 max-w-[230px] rounded-md border border-neutral-200 bg-white px-2 text-xs text-neutral-700"
                >
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {modelAvailable ? (
              <label
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-neutral-600"
                title={`Use ${modelAvailable} for a deeper rewrite. ${cloudRewrite ? "Text is sent to a model endpoint." : "Local model; falls back to the Pro engine if unavailable."}`}
              >
                <input
                  type="checkbox"
                  checked={useModel}
                  onChange={(event) => setUseModel(event.target.checked)}
                  className="h-3 w-3 accent-blue-600"
                />
                <span className="hidden sm:inline">Deep rewrite</span>
                <span className="sm:hidden">Deep</span>
              </label>
            ) : null}
          </div>
        </div>

        {useModel && mode === "pro" ? (
          <div className="flex items-start gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2 text-[11px] leading-5 text-blue-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>Deep rewrite:</strong> {modelAvailable ? `uses ${modelAvailable}` : "uses a model endpoint"} for a semantic rewrite, then checks every protected fact.
              {cloudRewrite || !modelAvailable
                ? " Your draft is sent to that endpoint; switch Deep rewrite off for local-only mode."
                : " Runs on your local model. CPU inference can take several minutes; pick a 1.5B–4B model if it times out."}
            </span>
          </div>
        ) : null}

        {/* tabs + mobile pane toggle */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-1.5 sm:hidden">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMobilePane("input")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[11px] font-medium",
                mobilePane === "input" ? "bg-neutral-100 text-neutral-900" : "text-neutral-500",
              )}
            >
              Input
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("output")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[11px] font-medium",
                mobilePane === "output" ? "bg-neutral-100 text-neutral-900" : "text-neutral-500",
              )}
            >
              Output
            </button>
          </div>
          <button
            type="button"
            onClick={() => setTab(tab === "history" ? "editor" : "history")}
            className="inline-flex items-center gap-1 text-[11px] text-neutral-500"
          >
            <History className="h-3.5 w-3.5" /> History
          </button>
        </div>

        {/* editor */}
        <div className={cn("grid min-h-[430px] grid-cols-1 md:grid-cols-2", compact && "min-h-[360px]")}>
          <div className={cn("relative flex flex-col border-b border-neutral-200 md:border-b-0 md:border-r", mobilePane === "output" && "hidden md:flex")}>
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Input text
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setText(SAMPLE)}
                  className="rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                >
                  Sample
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                >
                  <Upload className="h-3 w-3" /> Upload
                </button>
                {text ? (
                  <button
                    type="button"
                    onClick={() => {
                      setText("");
                      setOutput("");
                      setResponse(null);
                      inputRef.current?.focus();
                    }}
                    className="rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste AI-generated text here. The Pro engine works on essays, emails, posts, reports, and long drafts."
              className="min-h-[300px] flex-1 resize-none bg-transparent px-4 py-3 text-[15px] leading-7 text-neutral-800 outline-none placeholder:text-neutral-500"
              spellCheck
              aria-label="Text to humanize"
            />
            <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void run()}
                  disabled={loading || wordsIn === 0}
                  className="btn btn-primary h-9 px-4 text-sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  {loading ? "Humanizing…" : "Humanize"}
                </button>
                <span className="hidden text-[11px] text-neutral-500 sm:inline">
                  ⌘/Ctrl + Enter
                </span>
              </div>
              <span className="text-[11px] tabular-nums text-neutral-500">
                {wordsIn.toLocaleString()} / 25,000 words
              </span>
            </div>
          </div>

          <div className={cn("relative flex flex-col", mobilePane === "input" && "hidden md:flex")}>
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Humanized text
              </span>
              <div className="flex items-center gap-1">
                {output ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowDiff((value) => !value)}
                      className={cn(
                        "rounded px-1.5 py-1 text-[11px] font-medium hover:bg-neutral-100",
                        showDiff ? "text-blue-600" : "text-neutral-500",
                      )}
                    >
                      {showDiff ? "Text" : "Diff"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopy()}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadText("ahumane-humanized.txt", output)}
                      className="rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                      aria-label="Download humanized text"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3">
              {loading && !output ? (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.24s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.12s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                  </div>
                  <p className="text-sm font-medium text-blue-700">{PHASES[phase]}</p>
                  <p className="max-w-xs text-center text-xs text-neutral-500">
                    {useModel && mode === "pro"
                      ? modelChoice.startsWith("ollama")
                        ? "This local model can take several minutes on CPU. The request timeout is 15 minutes."
                        : "Deep rewrite can take 30–90 seconds: a model rewrites, then a second pass revises and checks facts."
                      : "The local engine runs several passes and checks the result with the detector."}
                  </p>
                </div>
              ) : output ? (
                showDiff ? (
                  <div className="text-[15px] leading-7 text-neutral-700">
                    {diffParts.map((part, index) => (
                      <span
                        key={index}
                        className={cn(
                          part.added && "rounded bg-emerald-100 text-emerald-900",
                          part.removed && "rounded bg-rose-100 text-rose-700 line-through decoration-rose-400",
                        )}
                      >
                        {part.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-800">
                    {output}
                  </div>
                )
              ) : (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                    <Wand2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-neutral-500">Your humanized text will appear here</p>
                  <p className="max-w-xs text-xs text-neutral-500">
                    The engine keeps names, numbers, quotes, and citations intact.
                  </p>
                </div>
              )}
            </div>

            {response ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 px-4 py-2.5 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-rose-50 px-2 py-1 font-medium text-rose-700">
                    AI {response.before.score}%
                  </span>
                  <ArrowRight className="h-3 w-3 text-neutral-500" aria-hidden="true" />
                  <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                    AI {response.after.score}%
                  </span>
                  <span className="hidden rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700 sm:inline">
                    {response.result.provider === "algorithm" ? "Local engine" : "Deep rewrite"} · {response.result.stats.passes} passes
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <Check className="h-3 w-3" />
                    {Math.round(response.result.meaning.retention * 100)}% facts kept
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void run(seed + 1)}
                    disabled={loading}
                    className="inline-flex items-center gap-1 rounded px-1.5 py-1 font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <RotateCcw className="h-3 w-3" /> Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("review")}
                    className="rounded px-1.5 py-1 font-medium text-neutral-500 hover:bg-neutral-100"
                  >
                    Review {response.result.changes.length}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5 text-[11px] text-neutral-500">
                <span>{wordsOut.toLocaleString()} words</span>
                <span>Free · unlimited</span>
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div role="alert" className="flex items-start gap-2 border-t border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        ) : null}

        {response?.result.warnings.length ? (
          <div className="border-t border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
            {response.result.warnings.join(" ")}
          </div>
        ) : null}
      </div>

      {/* tabs: review / history */}
      <div className="mt-4">
        <div className="flex items-center gap-1 border-b border-neutral-200">
          {(["editor", "review", "history"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "border-b-2 px-3 py-2 text-xs font-medium capitalize transition-colors",
                tab === item
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-800",
              )}
            >
              {item === "review" ? `Review (${response?.result.changes.length ?? 0})` : item}
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] text-neutral-500 sm:inline">
            {STYLE_DESCRIPTIONS[style]}
          </span>
        </div>

        {tab === "review" ? (
          <div className="mt-3 space-y-2">
            {response && response.result.provider !== "algorithm" && response.result.changes.length === 0 ? (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
                Deep rewrite replaces whole sentences rather than applying phrase-level rules. Use the
                Diff toggle in the output panel to compare it with your original.
              </div>
            ) : null}
            {response?.result.changes.length ? (
              response.result.changes.map((change, index) => (
                <details key={index} className="group rounded-lg border border-neutral-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3">
                    <span className="min-w-0">
                      <span className="line-clamp-1 text-sm font-medium text-neutral-800">
                        {change.after}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {change.reasons.map((reason) => (
                          <span key={reason} className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                            {reason}
                          </span>
                        ))}
                      </span>
                    </span>
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="grid gap-3 border-t border-neutral-100 p-4 text-xs leading-6 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 font-semibold uppercase tracking-wider text-rose-700">Before</p>
                      <p className="text-neutral-600">{change.before}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold uppercase tracking-wider text-emerald-700">After</p>
                      <p className="text-neutral-800">{change.after}</p>
                    </div>
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
                Run the humanizer to see sentence-level changes and the reasons behind them.
              </div>
            )}
          </div>
        ) : null}

        {tab === "history" ? (
          <div className="mt-3">
            {history.length ? (
              <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {history.map((record) => (
                  <li key={record.id} className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => restore(record)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-medium text-neutral-800">{record.title}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(record.createdAt)} · {record.mode} · AI {record.beforeScore}% → {record.afterScore}%
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistory(deleteRun(record.id))}
                      className="rounded p-1.5 text-neutral-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Delete ${record.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
                Your humanized drafts will appear here. They stay in this browser.
              </div>
            )}
          </div>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.markdown,.docx"
        aria-label="Upload a document to humanize"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
