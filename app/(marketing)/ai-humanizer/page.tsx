import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Gauge,
  Languages,
  Lock,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { HumanizerWorkspace } from "@/components/studio/humanizer-workspace";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FaqAccordion } from "@/components/marketing/faq";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Free AI Humanizer — Make AI Text Sound Human",
  description:
    "Humanize AI text for free with AHumane. The Pro Humanizer rewrites vocabulary, rhythm, and structure while keeping names, numbers, quotes, and citations intact. No account, no word cap.",
  alternates: { canonical: "/ai-humanizer" },
};

const FAQS = [
  {
    q: "What is an AI humanizer?",
    a: "An AI humanizer rewrites machine-generated text so it reads like something a person wrote. It changes vocabulary, sentence rhythm, transitions, and structure while preserving the original meaning. It is not a spell-checker and not a simple synonym swap.",
  },
  {
    q: "Is AHumane's humanizer really free?",
    a: "Yes. Basic and Pro are both free, with no word cap and no account. There is no paid tier hiding the better model. The app runs on your own server, so hosting is the only cost.",
  },
  {
    q: "How is Pro different from Basic?",
    a: "Basic runs the local four-pass engine. Pro adds Deep rewrite: a language model rewrites the draft, a second pass revises it, and every protected fact is checked before the result is accepted. If the model is unavailable or loses a fact, the local engine takes over.",
  },
  {
    q: "Does it preserve meaning?",
    a: "The engine protects numbers, dates, names, URLs, quoted text, and citations before rewriting, then checks that every protected fact survived. If a rewrite loses one, it is rejected and the local engine runs. The UI reports the retention rate.",
  },
  {
    q: "Will it get past Turnitin or GPTZero?",
    a: "No honest tool can guarantee that. Our own external tests found ZeroGPT scoring a human public-domain passage at 78.4% AI, Sapling scoring every LLM output at 99.9–100%, and a leading free commercial humanizer at 30% on Sapling. Detectors are inconsistent and produce false positives. Use the result as a stronger draft, not a certificate.",
  },
  {
    q: "Can I humanize long documents?",
    a: "The local engine handles up to 25,000 words per request. Deep rewrite is limited to 2,400 words because of model latency; longer drafts automatically use the local engine or can be split into parts.",
  },
  {
    q: "Which languages work?",
    a: "English gets the full lexicon and rhythm engine. Spanish, French, German, Portuguese, Italian, and Dutch get structural cleanup. Connect an OpenAI-compatible or local model for 100+ languages.",
  },
  {
    q: "What happens to my text?",
    a: "History is stored in your browser and the reference server does not log drafts. Pro's Deep rewrite sends the draft to a free public model endpoint for rewriting; switch Deep rewrite off to keep processing local.",
  },
];

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Removes AI-favoured vocabulary",
    body: "Delve, tapestry, pivotal, seamless, leverage, foster, underscore, and hundreds of other tells are swapped for words people actually use.",
  },
  {
    icon: Gauge,
    title: "Rebuilds burstiness",
    body: "AI writes in a metronome. AHumane splits long sentences, merges short ones, and varies openings so the rhythm stops sounding generated.",
  },
  {
    icon: ShieldCheck,
    title: "Keeps the facts",
    body: "Numbers, names, dates, quotes, URLs, and citations are protected before any rewrite. The meaning-lock report shows what survived.",
  },
  {
    icon: ScanSearch,
    title: "Audits its own work",
    body: "The Pro engine scores its output with the same detector you use, then targets the sentences that still look machine-written.",
  },
  {
    icon: Languages,
    title: "Built for more than English",
    body: "English is the deepest, but the studio handles structural cleanup in six more languages and any language through a connected model.",
  },
  {
    icon: Lock,
    title: "Local-only mode",
    body: "History lives in your browser and the app does not train on your drafts. Turn Deep rewrite off and the local engine keeps the text on your server.",
  },
];

const USE_CASES = [
  ["Students", "Clean up AI-assisted notes and drafts while keeping citations and arguments intact."],
  ["Writers", "Turn a rough AI outline into prose that sounds like your byline."],
  ["Marketers", "Make campaign copy and emails sound like a person, not a template."],
  ["SEO teams", "Keep keywords and structure while removing the generic AI cadence."],
  ["Researchers", "Improve readability without changing findings, figures, or references."],
  ["Job seekers", "Make cover letters and LinkedIn summaries sound specific again."],
  ["Support teams", "Rewrite macros and replies so customers do not feel like a ticket number."],
  ["Non-native writers", "Smooth awkward phrasing without flattening the voice that makes it yours."],
];

export default function AiHumanizerPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 pb-14 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">AI to human text converter</p>
            <h1 className="display mt-4 text-[2.5rem] sm:text-[3.5rem]">
              Humanize AI text
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Turn text from ChatGPT, Claude, Gemini, Grok, or any other model into natural,
              human-sounding writing. Keep the meaning. Lose the robot voice.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                <Check className="h-3 w-3" /> Pro is free
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1">
                No account
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1">
                25k local · 2.4k deep
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1">
                Meaning lock
              </span>
            </div>
          </div>

          <div className="mt-10">
            <HumanizerWorkspace />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-10">
        <div className="container-page">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Works with drafts from
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg font-semibold tracking-tight text-slate-600">
            {["ChatGPT", "Claude", "Gemini", "Grok", "DeepSeek", "Copilot", "Perplexity", "Grammarly", "QuillBot"].map(
              (tool) => (
                <span key={tool}>{tool}</span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow">Natural AI rewriting</p>
            <h2 className="display mt-4 text-[2rem] sm:text-[2.6rem]">
              Humanizing is not a synonym swap.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The tells live in the structure: the same sentence length, the same transition
              words, the same polished distance from the reader. AHumane changes the writing,
              not just the vocabulary.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Removes robotic phrasing and stock transitions",
                "Varies sentence length, openings, and paragraph shape",
                "Adds contractions and a human cadence where appropriate",
                "Keeps names, numbers, quotes, citations, and URLs intact",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="rounded-xl border border-rose-100 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-700">AI text</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                “It is important to note that the implementation of robust data governance
                frameworks is crucial for organizations seeking to leverage analytics effectively.”
              </p>
            </div>
            <ArrowRight className="mx-auto my-3 h-4 w-4 rotate-90 text-neutral-500" aria-hidden="true" />
            <div className="rounded-xl border border-emerald-100 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Humanized</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">
                “If you want analytics to be useful, start with data governance. Without it, every
                dashboard becomes a debate about whose numbers are right.”
              </p>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-600">
              Meaning preserved · 2 passes · natural style
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps, zero setup"
            description="Paste, choose, humanize, review. The engine does the tedious part and shows its work."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: FileText, step: "01", title: "Paste your text", body: "Drop in a draft from any AI tool, or upload a .docx or .txt file." },
              { icon: Wand2, step: "02", title: "Choose your settings", body: "Basic or Pro, style, strength, and language. Pro is free." },
              { icon: Sparkles, step: "03", title: "Humanize", body: "The engine rewrites, audits, and repeats until the signals drop." },
              { icon: ScanSearch, step: "04", title: "Review the output", body: "See the score change, every edit, and the fact-preservation report." },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 60}>
                <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] text-neutral-600">{item.step}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Built for natural rewriting"
            title="What the engine actually changes"
            description="Every rule exists for a reason, and every reason is visible in the review tab."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 50}>
                <div className="h-full rounded-2xl border border-neutral-200 p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <benefit.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who it's for"
            title="Eight kinds of writing, one engine"
            description="The same rewrite engine adapts to a thesis, a landing page, a cover letter, or a customer email."
          />
          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map(([title, body]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="AI detector bypass"
            title="What detectors notice — and what we change"
            description="Detectors look for statistical regularity, not a watermark. The fix is to write with more variation, not to sprinkle in typos."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {[
              ["Predictable sentence length", "Vary length and paragraph shape"],
              ["Repeated transitions", "Thin or replace formal connectors"],
              ["AI-favoured vocabulary", "Use plain, specific verbs"],
              ["Low contraction rate", "Add contractions by style"],
              ["Uniform punctuation", "Remove em-dash and semicolon tics"],
              ["Formulaic conclusions", "Cut the summary scaffolding"],
            ].map(([before, after]) => (
              <div key={before} className="rounded-xl border border-neutral-200 bg-white p-4">
                <p className="text-xs font-medium text-rose-700">{before}</p>
                <p className="mt-1 text-sm text-slate-700">{after}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-slate-600">
            Important: no humanizer can guarantee a particular score. Detectors are inconsistent and
            can flag human writing. Use the result as a stronger draft, not a certificate.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="FAQ"
            title="Humanize AI text, answered"
            description="The questions we hear most often, without the marketing fog."
          />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="container-page">
          <h2 className="display mx-auto max-w-2xl text-[2.25rem] sm:text-[3rem]">
            Humanize your first draft in seconds.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Free, private, and built to show its work. The Pro engine is not behind a paywall.
          </p>
          <Link href="/studio/humanizer" className="btn btn-primary mt-7 h-12 px-7 text-base">
            Open the humanizer <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-slate-600">No account · No word cap · No watermark</p>
        </div>
      </section>
    </>
  );
}
