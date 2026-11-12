import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Gauge,
  Infinity as InfinityIcon,
  Languages,
  Lock,
  Megaphone,
  PenLine,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { HeroDashboard } from "@/components/marketing/hero-dashboard";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SampleShowcase } from "@/components/marketing/sample-showcase";
import { FaqAccordion } from "@/components/marketing/faq";
import { HOME_FAQS, PERSONAS, STATS, TOOL_MARQUEE } from "@/lib/content/site";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ahumane.app/#organization",
      name: "AHumane",
      url: "https://ahumane.app",
      logo: "https://ahumane.app/brand/icon.svg",
      description:
        "A free, self-hostable AI humanizer, detector, plagiarism checker, and writing studio.",
    },
    {
      "@type": "WebSite",
      "@id": "https://ahumane.app/#website",
      url: "https://ahumane.app",
      name: "AHumane",
      publisher: { "@id": "https://ahumane.app/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "AHumane",
      applicationCategory: "WritingApplication",
      operatingSystem: "Web",
      url: "https://ahumane.app",
      description:
        "Free AI humanizer with a Pro multi-pass engine, AI detector, plagiarism checker, and writing studio.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: HOME_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

const PERSONA_ICONS = {
  pen: PenLine,
  megaphone: Megaphone,
  book: BookOpen,
};

const PERSONA_STYLES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-700",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD).replace(/</g, "\\u003c") }}
      />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-20 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-fade opacity-70" aria-hidden="true" />
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              The Pro Humanizer is free. So is everything else.
            </div>
            <h1 className="display mt-6 text-[2.75rem] sm:text-[4rem] lg:text-[4.25rem]">
              Humanize your writing
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Turn AI-generated text into natural, human-sounding prose. Keep the meaning.
              Lose the robot voice. Pay nothing.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/studio/humanizer" className="btn btn-primary h-12 w-full px-7 text-base sm:w-auto">
                Get started for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/ai-humanizer" className="btn btn-secondary h-12 w-full px-7 text-base sm:w-auto">
                See the humanizer
              </Link>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-600">
              No account · No word cap · No watermark
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1096px] sm:mt-20">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* ── Tool marquee ─────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-white py-10" aria-label="Compatible AI tools">
        <div className="container-page">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            Works beautifully with text from
          </p>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee-track flex w-max items-center gap-12">
              {[...TOOL_MARQUEE, ...TOOL_MARQUEE].map((tool, index) => (
                <span
                  key={`${tool}-${index}`}
                  className="whitespace-nowrap text-xl font-semibold tracking-tight text-slate-600 grayscale transition-colors hover:text-slate-600"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Personas ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Built for everyone"
            title="Humanize any AI-generated text"
            description="A humanizer should not flatten your voice into a different kind of generic. It should remove the tells and leave the thinking."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PERSONAS.map((persona, index) => {
              const Icon = PERSONA_ICONS[persona.icon as keyof typeof PERSONA_ICONS];
              return (
                <Reveal key={persona.title} delay={index * 70}>
                  <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg hover:shadow-slate-900/5">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${PERSONA_STYLES[persona.accent]}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">
                      {persona.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{persona.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature bento ────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Features"
            title="Why AHumane?"
            description="Most humanizers swap a few words and hope. AHumane rewrites rhythm, vocabulary, and structure — then checks its own work."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-blue-600">
                      The Pro Humanizer
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      A real model rewrite plus a local fallback, not a thesaurus.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    Free
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-700">
                      Before
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-700">
                      Physics delves into the intricate relationships between matter, energy,
                      and the forces that shape our universe.
                    </p>
                    <span className="mt-2 inline-block rounded bg-white px-2 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-rose-100">
                      AI detected
                    </span>
                  </div>
                  <ArrowRight className="mx-auto hidden h-4 w-4 text-neutral-500 sm:block" aria-hidden="true" />
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                      After
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-800">
                      Physics asks how matter, energy, and force fit together. The answers are
                      stranger than the questions.
                    </p>
                    <span className="mt-2 inline-block rounded bg-white px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                      Sounds human
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="rounded-md border border-neutral-200 px-2 py-1">4 passes</span>
                    <span className="rounded-md border border-neutral-200 px-2 py-1">Fact lock</span>
                    <span className="rounded-md border border-neutral-200 px-2 py-1">Any length</span>
                  </div>
                  <Link
                    href="/ai-humanizer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Try it <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-5" delay={80}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-blue-600">
                  Detector-aware
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Every Pro pass checks its own output and repairs what still looks machine-made.
                </p>
                <div className="mt-8 flex items-center justify-center gap-8">
                  <ScoreDial value={94} label="AI draft" tone="rose" />
                  <ArrowRight className="h-5 w-5 text-neutral-500" aria-hidden="true" />
                  <ScoreDial value={11} label="Humanized" tone="emerald" />
                </div>
                <div className="mt-7 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    AI phrases removed
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    Sentence rhythm rebuilt
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    Names, numbers, and citations preserved
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4" delay={40}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <InfinityIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">Free. Actually free.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No credits, no monthly cap, no “upgrade to Pro.” The Pro engine is the default
                  engine here.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-lg font-semibold tracking-tight tabular-nums">{stat.value}</p>
                      <p className="text-[11px] text-slate-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4" delay={100}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">Your text stays yours</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  History lives in your browser. Choose a local Ollama model for local-only
                  processing, or turn Deep rewrite off and use the local engine.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1">
                    <Lock className="h-3 w-3" /> Local-first
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1">
                    <Zap className="h-3 w-3" /> No sign-up
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4" delay={160}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Languages className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">Seven languages built in</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  English gets the full engine. Spanish, French, German, Portuguese, Italian, and
                  Dutch get structural cleanup. Connect a model for 100+.
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                  {["EN", "ES", "FR", "DE", "PT", "IT", "NL"].map((lang) => (
                    <span key={lang} className="rounded bg-neutral-100 px-2 py-1">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-12" delay={60}>
              <div className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:p-8">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-blue-600">
                    Built for the detectors people actually use
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    AHumane targets the statistical fingerprints shared by GPTZero, ZeroGPT,
                    Copyleaks, QuillBot, Turnitin, Writer, Grammarly, and Originality — without
                    promising a score it cannot control.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium text-slate-600">
                  {["GPTZero", "ZeroGPT", "Copyleaks", "QuillBot", "Turnitin", "Grammarly"].map(
                    (name) => (
                      <div key={name} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                        {name}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. No learning curve."
            description="Paste a draft, choose how hard to push, and review the result. The engine handles the rest."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: PenLine,
                step: "01",
                title: "Paste your AI draft",
                body: "Text from ChatGPT, Claude, Gemini, Grok, DeepSeek, or anything else. Up to 25,000 words.",
              },
              {
                icon: Gauge,
                step: "02",
                title: "Pick Basic or Pro",
                body: "Basic is one careful pass. Pro audits and rewrites until the signals drop. Both are free.",
              },
              {
                icon: ScanSearch,
                step: "03",
                title: "Review and ship",
                body: "See every change, the before/after score, and a fact-preservation report. Then copy it.",
              },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 70}>
                <div className="h-full rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-medium text-neutral-600">{item.step}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Samples ──────────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="See the difference"
            title="Before and after, without the magic tricks"
            description="These are real engine outputs, not hand-edited marketing copy. Same meaning, different rhythm."
          />
          <SampleShowcase />
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Pricing"
            title="One price: $0"
            description="Every tool, every mode, every word. No account, no card, no trial clock."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Humanizer",
                price: "$0",
                tagline: "Basic and Pro, unlimited",
                features: ["Unlimited words", "Basic + Pro engine", "Meaning lock", "Full change review", "History in your browser"],
                icon: Sparkles,
                featured: true,
              },
              {
                name: "Detector",
                price: "$0",
                tagline: "Transparent AI likelihood",
                features: ["Sentence heat-map", "Signal breakdown", "Confidence and limits", "No scan caps", "Built-in recommendations"],
                icon: ScanSearch,
                featured: false,
              },
              {
                name: "Studio",
                price: "$0",
                tagline: "Everything else",
                features: ["Plagiarism checker", "AI writer", "Document library", "Chrome extension", "No watermark"],
                icon: Wand2,
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 ${
                  plan.featured ? "border-blue-600 shadow-lg shadow-blue-600/5" : "border-neutral-200"
                }`}
              >
                {plan.featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    All included
                  </span>
                ) : null}
                <plan.icon className={`h-5 w-5 ${plan.featured ? "text-blue-600" : "text-neutral-500"}`} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-600">/ forever</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{plan.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/studio"
                  className={`btn mt-6 h-11 w-full text-sm ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                >
                  Open Studio
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-600">
            AHumane is self-hostable. If you run it for a team, the software is still free — you only pay for your own hosting.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="The short answers. The longer ones live in the Help Center and on the blog."
          />
          <div className="mt-10">
            <FaqAccordion items={HOME_FAQS} />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            Still curious?{" "}
            <Link href="/help" className="font-medium text-blue-600 underline underline-offset-2">
              Visit the Help Center
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" aria-hidden="true" />
        <div className="container-page relative text-center">
          <p className="eyebrow">Ready to get started?</p>
          <h2 className="display mx-auto mt-4 max-w-3xl text-[2.25rem] sm:text-[3.25rem]">
            Start humanizing your content today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
            The Pro Humanizer is free. The detector is free. Your words stay yours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/studio/humanizer" className="btn btn-primary h-12 px-7 text-base">
              Open the humanizer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary h-12 px-7 text-base">
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ScoreDial({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "rose" | "emerald";
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = tone === "rose" ? "#fb7185" : "#10b981";
  return (
    <div className="text-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 84 84" className="h-24 w-24 -rotate-90">
          <circle cx="42" cy="42" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="7" />
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">
          {value}%
        </span>
      </div>
      <p className="mt-2 text-[11px] font-medium text-slate-600">{label}</p>
    </div>
  );
}
