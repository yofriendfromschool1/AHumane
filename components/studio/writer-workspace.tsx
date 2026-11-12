"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Copy, Loader2, Sparkles, Wand2 } from "lucide-react";
import { copyText } from "@/lib/studio/storage";
import { generateDraft, type WriterKind, type WriterTone } from "@/lib/studio/writer";
import { toast } from "@/components/ui/toast";

const KINDS: Array<{ value: WriterKind; label: string }> = [
  { value: "blog", label: "Blog post" },
  { value: "essay", label: "Essay" },
  { value: "email", label: "Email" },
  { value: "outline", label: "Outline" },
  { value: "social", label: "Social post" },
];

const TONES: Array<{ value: WriterTone; label: string }> = [
  { value: "clear", label: "Clear" },
  { value: "warm", label: "Warm" },
  { value: "professional", label: "Professional" },
  { value: "direct", label: "Direct" },
];

export function WriterWorkspace() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [kind, setKind] = useState<WriterKind>("blog");
  const [tone, setTone] = useState<WriterTone>("clear");
  const [sections, setSections] = useState(4);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const words = useMemo(() => output.split(/\s+/).filter(Boolean).length, [output]);

  function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    window.setTimeout(() => {
      setOutput(generateDraft({ prompt, kind, tone, sections }));
      setLoading(false);
    }, 450);
  }

  function sendToHumanizer() {
    try {
      window.sessionStorage.setItem("ahumane:pending", output);
    } catch {
      // ignore
    }
    router.push("/studio/humanizer?from=writer");
  }

  async function copy() {
    if (!output) return;
    if (await copyText(output)) toast("Draft copied.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Wand2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Draft builder</p>
            <p className="text-[10px] text-neutral-500">Template-based · model optional</p>
          </div>
        </div>

        <label className="mt-5 block text-xs font-medium text-neutral-700" htmlFor="writer-prompt">
          What are you writing?
        </label>
        <textarea
          id="writer-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="e.g. A practical guide to reducing meeting overload for remote teams"
          className="mt-1.5 min-h-[110px] w-full resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-neutral-500 focus:border-blue-400"
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-xs text-neutral-600">
            Format
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as WriterKind)}
              className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
            >
              {KINDS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-neutral-600">
            Tone
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value as WriterTone)}
              className="mt-1 h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs"
            >
              {TONES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-3 block text-xs text-neutral-600">
          Sections: <span className="font-medium text-neutral-900">{sections}</span>
          <input
            type="range"
            min={2}
            max={8}
            value={sections}
            onChange={(event) => setSections(Number(event.target.value))}
            className="mt-2 w-full accent-blue-600"
          />
        </label>

        <button
          type="button"
          onClick={generate}
          disabled={!prompt.trim() || loading}
          className="btn btn-primary mt-4 h-10 w-full text-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Building…" : "Generate draft"}
        </button>

        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-800">
          This builder gives you a strong outline and prompts, not a finished article. Connect a
          local model in Settings for full prose. The draft is meant to be rewritten in your voice.
        </div>
      </div>

      <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Draft
          </span>
          {output ? (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100">
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button
                type="button"
                onClick={sendToHumanizer}
                className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50"
              >
                <Sparkles className="h-3 w-3" /> Humanize
              </button>
            </div>
          ) : null}
        </div>
        {output ? (
          <>
            <textarea
              value={output}
              onChange={(event) => setOutput(event.target.value)}
              className="flex-1 resize-none bg-transparent px-5 py-4 font-mono text-[12.5px] leading-7 text-neutral-800 outline-none"
              aria-label="Generated draft"
            />
            <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2 text-[11px] text-neutral-500">
              <span>{words} words</span>
              <button type="button" onClick={sendToHumanizer} className="inline-flex items-center gap-1 font-medium text-blue-600">
                Send to humanizer <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
              <Wand2 className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-semibold text-neutral-700">Your draft will appear here</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500">
              Describe what you are writing, choose a format, and generate an outline or a first draft.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
