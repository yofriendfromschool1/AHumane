import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileLock2, ScanSearch, ShieldCheck, Split, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "How the AHumane Pro Humanizer Works",
  description:
    "How AHumane rewrites with a real model, checks every protected fact, runs a second editorial pass, and falls back to a local engine.",
  alternates: { canonical: "/how-it-works" },
};

const PASSES = [
  {
    icon: FileLock2,
    step: "01",
    title: "Protect the facts",
    body: "URLs, emails, numbers, dates, citations, quoted text, and proper nouns are replaced with protected tokens before any rewrite. At the end, every token is restored and checked. If a sentence would lose one, it is reverted.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Remove the tells",
    body: "A curated lexicon of hundreds of patterns targets AI-favoured vocabulary, formal transitions, filler phrases, hedges, copula avoidance, nominalizations, and chatbot artifacts. Replacements are context-aware, not blind synonym swaps.",
  },
  {
    icon: Split,
    step: "03",
    title: "Rebuild the rhythm",
    body: "Sentences that run too long are split. Short ones are merged when grammar allows. Openings are varied, contractions are added by style, repeated discourse markers are thinned, and paragraphs that are suspiciously uniform are broken up.",
  },
  {
    icon: ScanSearch,
    step: "04",
    title: "Audit and repair",
    body: "The result is scored with the same detector you see in the studio. Sentences above the threshold get a targeted repair pass. The engine keeps the best candidate that still passes the fact check.",
  },
];

const SIGNALS = [
  ["Burstiness", "Variation in sentence length", "Split long sentences, merge short ones, vary openings"],
  ["AI vocabulary", "Overused model-favoured words", "Curated lexicon with context-aware replacements"],
  ["Transitions", "Moreover, furthermore, thus, in conclusion", "Thin, replace, or delete"],
  ["Hedging", "It could be argued, potentially, may suggest", "Reduce to the hedges that carry real uncertainty"],
  ["Punctuation", "Em dashes, semicolons, colons in tidy patterns", "Match the style, remove the tics"],
  ["Repetition", "Repeated phrases and sentence openers", "Vary openings and sentence shapes"],
  ["Structure", "Uniform paragraphs and balanced triads", "Break the symmetry where it serves the reader"],
  ["Chatbot artifacts", "I hope this helps, let me know, certainly!", "Strip them before anything else"],
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page">
          <p className="eyebrow">How it works</p>
          <h1 className="display mt-4 max-w-3xl text-[2.5rem] leading-[1.05] sm:text-[3.75rem]">
            A humanizer that shows its work.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Pro starts with a real semantic rewrite from a language model, not a synonym swap.
            Then it checks every protected fact, runs a second editorial pass, and falls back to a
            local four-pass engine when no model is available.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              Pro is free
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Deterministic</span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Meaning lock</span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">Optional local model</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <div className="space-y-4">
            {PASSES.map((pass) => (
              <div
                key={pass.step}
                className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-8"
              >
                <div className="flex items-start gap-4 sm:w-[220px] sm:flex-col">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <pass.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-xs font-medium text-blue-600">Pass {pass.step}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">{pass.title}</h2>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">{pass.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="The signal map"
            title="Every rule has a reason"
            description="The engine is built around the same features a detector measures. Here is the mapping."
          />
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-[1fr_1.2fr_1.4fr] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[11px]">
              <span>Signal</span>
              <span>What it looks like</span>
              <span>What AHumane does</span>
            </div>
            {SIGNALS.map(([signal, look, action]) => (
              <div
                key={signal}
                className="grid grid-cols-[1fr_1.2fr_1.4fr] gap-3 border-b border-neutral-100 px-4 py-3 text-[11px] leading-5 last:border-0 sm:text-xs"
              >
                <span className="font-medium text-neutral-800">{signal}</span>
                <span className="text-slate-600">{look}</span>
                <span className="text-slate-600">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Meaning lock</p>
            <h2 className="display mt-3 text-[2rem] sm:text-[2.5rem]">
              A rewrite that changes the facts is a failure.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Before any transformation, the engine tags the things that must survive: numbers,
              dates, currencies, percentages, names, quotes, URLs, emails, and citations. It checks
              the tag inventory after every pass. The studio reports the retention rate, and any
              sentence that would lose a tag is reverted to its original form.
            </p>
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4" /> Example report
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white p-2">
                  <p className="text-lg font-semibold tabular-nums text-emerald-700">12/12</p>
                  <p className="text-[10px] text-slate-600">facts kept</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-lg font-semibold tabular-nums text-emerald-700">4</p>
                  <p className="text-[10px] text-slate-600">passes</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-lg font-semibold tabular-nums text-emerald-700">100%</p>
                  <p className="text-[10px] text-slate-600">retention</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">Model-first, with a local fallback</p>
            <h2 className="display mt-3 text-[2rem] sm:text-[2.5rem]">
              A real rewrite first. A local engine when you need privacy.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Deep rewrite uses a free public model endpoint by default. The model's output is
              checked against protected facts, revised by a second editorial pass, and rejected if it
              changes a number, quote, citation, URL, or name. Turn Deep rewrite off and the local
              four-pass engine runs entirely on your server.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
              {["Ollama", "OpenAI-compatible", "Local-first", "Fallback safe"].map((item) => (
                <span key={item} className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
              <strong>What we do not claim:</strong> no humanizer can guarantee a specific detector
              score, and a high score is not proof of authorship. The engine removes stylistic
              signals. It does not certify anything.
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-16">
        <div className="container-page mx-auto max-w-4xl">
          <p className="eyebrow">External detector tests</p>
          <h2 className="display mt-3 text-[2rem] sm:text-[2.5rem]">
            What the public detectors actually said
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            We submitted a 452-word AI essay, the local engine output, a two-pass model rewrite, and a
            leading free commercial humanizer to the public detector pages. This is the honest result.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              <span>Text</span><span>Sapling</span><span>ZeroGPT</span>
            </div>
            {[
              ["Human-written essay (Ethan Mollick)", "0.0%", "not run"],
              ["Human-written essay (Paul Graham)", "0.0%", "not run"],
              ["Public-domain human prose", "0.0%", "78.4%"],
              ["Leading free commercial humanizer", "30.0%", "100%"],
              ["AHumane local engine", "99.9%", "100%"],
              ["AHumane two-pass model rewrite", "99.9%", "100%"],
            ].map(([label, sapling, zero]) => (
              <div key={label} className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-t border-neutral-100 px-4 py-2.5 text-xs">
                <span className="text-neutral-700">{label}</span>
                <span className="font-medium text-neutral-900">{sapling}</span>
                <span className="text-neutral-600">{zero}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-[11px] leading-5 text-rose-900">
              ZeroGPT scored a human public-domain passage at 78.4% AI. It cannot be a pass/fail gate.
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
              Sapling scored every LLM output at 99.9–100%, including 70B and 120B models.
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-[11px] leading-5 text-blue-900">
              GPTZero, Copyleaks, and Originality.ai required accounts, credits, or blocked headless
              access. No scores were invented.
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Method and full table: <code className="rounded bg-neutral-100 px-1 py-0.5">docs/external-detector-tests.md</code>.
            This is why the product does not promise a detector score.
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight">Research behind the rules</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["Wikipedia: Signs of AI writing", "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing"],
                ["Liang et al. — GPT detectors are biased against non-native English writers", "https://arxiv.org/abs/2304.02819"],
                ["GPTZero — how AI detection works", "https://gptzero.me/"],
                ["The AI Detector Bypassers research archive", "https://github.com/yofriendfromschool1/ai-detector-bypassers-and-school-cheating2"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">See it on your own draft.</p>
                <p className="mt-1 text-xs text-slate-600">Free, no account, no word cap.</p>
              </div>
              <Link href="/studio/humanizer" className="btn btn-primary h-10 px-5 text-sm">
                Open the humanizer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
