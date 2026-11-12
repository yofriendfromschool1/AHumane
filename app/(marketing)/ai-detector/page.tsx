import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp, Gauge, Scale, ScanSearch, Sparkles } from "lucide-react";
import { DetectorWorkspace } from "@/components/studio/detector-workspace";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FaqAccordion } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Free AI Detector — See the Signals, Not Just a Score",
  description:
    "Check text for AI-generated patterns with AHumane's free AI detector. Get a score, a sentence heat-map, and a plain-English breakdown of the signals — plus honest limits.",
  alternates: { canonical: "/ai-detector" },
};

const FAQS = [
  {
    q: "How accurate is this AI detector?",
    a: "It is a transparent stylistic model, not a trained commercial classifier. It separates human and AI writing well on our test fixtures, but it can be wrong, especially on formal, non-native, or heavily edited prose. There is no scientifically valid way to certify authorship from text alone.",
  },
  {
    q: "What does the score mean?",
    a: "The score is an estimate of how much the text resembles the AI-writing patterns in our feature set. Higher means more AI-like signals. The sentence heat-map shows where those signals concentrate, and the signal breakdown shows why.",
  },
  {
    q: "Can it detect ChatGPT, Claude, Gemini, and other models?",
    a: "It detects shared stylistic patterns common to instruction-tuned models: uniform rhythm, AI-favoured vocabulary, formal transitions, low contraction rates, and similar features. It does not identify which model wrote a text, and it does not use a watermark.",
  },
  {
    q: "Is the detector the same as a plagiarism checker?",
    a: "No. An AI detector estimates whether text looks machine-generated. A plagiarism checker looks for text that matches an existing source. A passage can be AI-generated and original, or human-written and copied. Use both for different questions.",
  },
  {
    q: "How much text do I need?",
    a: "Aim for at least 150 words. Under 80 words the score is deliberately pulled toward the middle because short samples do not contain enough signal. The confidence label tells you when length is a problem.",
  },
  {
    q: "Is my text private?",
    a: "Yes. The scan happens on your own server and the text is not logged or stored. History in the studio stays in your browser. Nothing is sent to a third-party detector.",
  },
  {
    q: "What should I do if I get a false positive?",
    a: "Read the sentence heat-map and the reasons. If the flagged patterns are genuinely yours, revise for clarity if you want, but do not add errors just to lower a score. Keep drafts, notes, and version history so you can demonstrate your process.",
  },
];

export default function AiDetectorPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 pb-14 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Free AI content detector</p>
            <h1 className="display mt-4 text-[2.5rem] sm:text-[3.5rem]">AI Detector</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              See what makes a draft read like AI — and where. A score, a sentence heat-map, and
              the actual signals behind the number.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                Free · unlimited
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">Sentence-level</span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">No sign-up</span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">Honest limits</span>
            </div>
          </div>
          <div className="mt-10">
            <DetectorWorkspace />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">AI checker overview</p>
            <h2 className="display mt-4 text-[2rem] sm:text-[2.6rem]">
              What an AI detector can and cannot tell you
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              AI detectors estimate how closely a text matches patterns that are common in
              machine-generated writing. They do not inspect a hidden signature, and they cannot
              prove who wrote something. That is why a good detector shows its reasoning instead of
              asking you to trust a number.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              AHumane measures rhythm, vocabulary, transitions, hedging, punctuation, repetition,
              and structure. Each signal contributes to the score, and each one is visible in the
              breakdown. You can disagree with the result and see exactly why it happened.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Perplexity-style predictability", "Plain, generic word choices"],
                ["Burstiness", "Sentence length variation"],
                ["Transition density", "Moreover, furthermore, thus…"],
                ["Punctuation habits", "Em dashes, semicolons, colons"],
                ["Repetition", "Repeated phrases and openers"],
                ["Structure", "Uniform paragraphs and lists"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-xs font-semibold text-neutral-800">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-500">
              The uncomfortable truth
            </h3>
            <div className="mt-5 space-y-4">
              {[
                {
                  icon: Scale,
                  title: "Detectors are not judges",
                  body: "Studies repeatedly find high false-positive rates, especially for non-native English writers. A score is evidence of style, not evidence of misconduct.",
                },
                {
                  icon: CircleHelp,
                  title: "Short text is unreliable",
                  body: "A paragraph rarely contains enough signal. Our detector lowers its confidence and pulls the score toward the middle for short samples.",
                },
                {
                  icon: Gauge,
                  title: "Scores move",
                  body: "Models change, prompts change, and a light edit can swing a commercial detector by 40 points. Do not optimize for one number.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-500 ring-1 ring-neutral-200">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="How detection works"
            title="From raw text to a readable signal"
            description="No black box. Four steps, each one inspectable in the result."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Normalize", "Clean invisible characters, quotes, and formatting so the analysis sees the actual prose."],
              ["02", "Extract", "Measure sentence rhythm, vocabulary, transitions, punctuation, repetition, and structure."],
              ["03", "Score", "Weight the signals, compare them to human and AI reference patterns, and produce a probability."],
              ["04", "Explain", "Show the top contributors and a sentence-level heat-map so you can act on it."],
            ].map(([step, title, body]) => (
              <div key={step} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">{step}</span>
                  <ScanSearch className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who it's for"
            title="A second pair of eyes, not a verdict"
            description="Use it to understand a draft, prepare for a conversation, or spot patterns before publishing."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Students", "Understand why a draft might be flagged and learn which habits to change."],
              ["Teachers", "Start a conversation about process and revision — never as the only evidence."],
              ["Editors", "Spot passages that need a stronger voice before they reach readers."],
              ["SEO teams", "Find generic, templated sections that read like they were assembled."],
              ["Researchers", "Check whether a draft has drifted into generic assistant phrasing."],
              ["Writers", "Get a sentence-level map of where your voice disappears."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-neutral-200 p-4">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-2xl items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            If the scan finds patterns you want to change, open the draft in the humanizer. It uses the
            same detector to check its own output.
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="FAQ" title="AI detector questions" description="Straight answers about accuracy, privacy, and what a score really means." />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="container-page">
          <h2 className="display mx-auto max-w-2xl text-[2.25rem] sm:text-[3rem]">Scan a draft, then fix what it finds.</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            The detector and the humanizer share the same engine. No handoff, no second account.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/studio/detector" className="btn btn-primary h-12 px-7 text-base">
              Open the detector <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/ai-humanizer" className="btn btn-secondary h-12 px-7 text-base">
              See the humanizer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
