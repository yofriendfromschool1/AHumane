import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Infinity as InfinityIcon, Lock, ScanSearch, Sparkles, Wand2 } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "Pricing — Free Forever, No Word Caps",
  description:
    "AHumane pricing is simple: everything is $0. Pro humanizer, AI detector, plagiarism checker, writer, and document library. No account, no card, no word cap.",
  alternates: { canonical: "/pricing" },
};

const FAQS = [
  {
    q: "Why is it free?",
    a: "AHumane is self-hosted software. You run it on your own machine or server, so there is no per-word API bill to pass on. The project is built as a free alternative to subscription humanizers, not as a funnel to one.",
  },
  {
    q: "What is the catch?",
    a: "No catch. There is no hidden tier, no watermark, and no “Pro” paywall. If you connect a hosted model, that provider may charge you, but the app itself does not.",
  },
  {
    q: "Is there really no word limit?",
    a: "There is a 25,000-word sanity cap per request so a single paste cannot lock up the server. You can run as many requests as you want. The cap is an engineering limit, not a sales limit.",
  },
  {
    q: "Do I need an account?",
    a: "No. The studio works without signing in. The login page is a local demo for people who want a named workspace; it does not unlock anything.",
  },
  {
    q: "Can I use it for commercial work?",
    a: "Yes. You are responsible for the content you produce and for complying with your school, employer, publisher, or client's rules. See the Terms of Use for the details.",
  },
  {
    q: "Can I self-host it for my team?",
    a: "Yes. The repository includes setup instructions. There is no seat count and no license fee. You pay only for your infrastructure.",
  },
];

const COMPARISON: Array<[string, string, string]> = [
  ["Pro humanizer", "Included", "Usually paywalled"],
  ["Word limits", "None (25k per request)", "500–3,000 words"],
  ["AI detector", "Unlimited", "Often metered"],
  ["Plagiarism checker", "Included", "Often metered"],
  ["Meaning-lock report", "Included", "Rare"],
  ["Sentence-level review", "Included", "Sometimes"],
  ["Account required", "No", "Usually"],
  ["Watermark", "Never", "Sometimes"],
  ["Your text used for training", "Never", "Varies"],
  ["Price", "$0", "$8–$40/mo"],
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page text-center">
          <p className="eyebrow">Pricing</p>
          <h1 className="display mx-auto mt-4 max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
            Everything. $0.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            The Pro humanizer, the detector, the plagiarism checker, the writer, and the document
            library. No account, no card, no word cap, no watermark.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              <InfinityIcon className="h-3 w-3" /> Free forever
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1">
              <Lock className="h-3 w-3" /> Local-only mode
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1">
              <Sparkles className="h-3 w-3" /> Pro included
            </span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Humanizer",
                tagline: "Basic and Pro, unlimited",
                features: [
                  "Unlimited humanizer runs",
                  "Pro multi-pass engine",
                  "Meaning-lock fact report",
                  "Sentence-level review",
                  "History and documents",
                  "No word cap",
                ],
                icon: Sparkles,
                featured: true,
              },
              {
                name: "Detector",
                tagline: "Understand the signals",
                features: [
                  "Unlimited scans",
                  "Sentence heat-map",
                  "Signal breakdown",
                  "Confidence and limitations",
                  "Humanizer handoff",
                  "No account",
                ],
                icon: ScanSearch,
                featured: false,
              },
              {
                name: "Studio",
                tagline: "The rest of the toolkit",
                features: [
                  "Plagiarism checker",
                  "AI writer and outlines",
                  "Document library",
                  "Chrome extension",
                  "7 built-in languages",
                  "Self-host for your team",
                ],
                icon: Wand2,
                featured: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 ${
                  tier.featured ? "border-blue-600 shadow-xl shadow-blue-600/5" : "border-neutral-200"
                }`}
              >
                {tier.featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Everything included
                  </span>
                ) : null}
                <tier.icon className={`h-5 w-5 ${tier.featured ? "text-blue-600" : "text-neutral-500"}`} aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold tracking-tight">{tier.name}</h2>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-5xl font-semibold tracking-tight">$0</span>
                  <span className="pb-1.5 text-sm text-slate-600">/ forever</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{tier.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/studio"
                  className={`btn mt-6 h-11 w-full text-sm ${tier.featured ? "btn-primary" : "btn-secondary"}`}
                >
                  Open Studio
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs leading-5 text-slate-600">
            There is no monthly/annual toggle because there is no annual price. Hosting is the only cost,
            and you can run AHumane on your own machine.
          </p>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="The honest comparison"
            title="How this usually works elsewhere"
            description="A typical subscription humanizer is not evil. It just has a different business model. Here is the difference in plain terms."
          />
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <span>Feature</span>
              <span className="text-blue-700">AHumane</span>
              <span>Typical paid tool</span>
            </div>
            {COMPARISON.map(([feature, ours, theirs]) => (
              <div
                key={feature}
                className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-3 border-b border-neutral-100 px-4 py-3 text-xs last:border-0 sm:text-sm"
              >
                <span className="font-medium text-neutral-700">{feature}</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {ours}
                </span>
                <span className="text-slate-600">{theirs}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading eyebrow="FAQ" title="Pricing questions" description="The short version: no, there is no catch." />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="container-page">
          <h2 className="display mx-auto max-w-2xl text-[2.25rem] sm:text-[3rem]">
            Start with the Pro engine. It is the default.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            No trial, no upgrade prompt, no card. Open the studio and paste a draft.
          </p>
          <Link href="/studio/humanizer" className="btn btn-primary mt-7 h-12 px-7 text-base">
            Open the humanizer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
