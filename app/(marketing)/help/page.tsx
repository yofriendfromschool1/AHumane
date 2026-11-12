import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileSearch, ScanSearch, Sparkles, Wand2 } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Help Center — AHumane",
  description:
    "Answers about the humanizer, detector, plagiarism checker, privacy, languages, limits, and self-hosting.",
  alternates: { canonical: "/help" },
};

const FAQS = [
  {
    q: "How do I humanize text?",
    a: "Open the studio, paste a draft, choose Basic or Pro, pick a style and strength, and press Humanize. Pro is the default and it is free. You can also use the editor on the AI Humanizer page.",
  },
  {
    q: "Why does the output sometimes change a sentence I liked?",
    a: "The Pro engine makes several passes and keeps the version that scores best while preserving facts. Open the Review tab to see every changed sentence with the reason, and use the original if you prefer it. You can also run it again with a new seed for a different variant.",
  },
  {
    q: "What does the meaning-lock report mean?",
    a: "It counts the numbers, names, dates, quotes, URLs, and citations the engine protected, and how many survived. A 100% score means every protected fact is still present verbatim. If a sentence would lose one, the engine reverts that sentence.",
  },
  {
    q: "Why is the AI detector score different from another detector?",
    a: "Different detectors use different models, thresholds, and training data. A score is an estimate of style, not a fact about authorship. Use the sentence heat-map and reasons to understand what our detector noticed; do not treat any single score as definitive.",
  },
  {
    q: "Can I upload a PDF or DOCX?",
    a: "DOCX, TXT, and Markdown are supported. PDF is not yet supported because reliable text extraction requires a heavier parser. Copy the text out of the PDF and paste it in.",
  },
  {
    q: "How do I connect a local model?",
    a: "Run Ollama or any OpenAI-compatible endpoint and set the environment variables in your deployment. The studio's settings page shows whether a provider is detected. Without a model, the deterministic Pro pipeline still works.",
  },
  {
    q: "Where is my history stored?",
    a: "In your browser's local storage. It is not uploaded to a database. Clearing site data or using a private window will remove it. You can export individual results from the humanizer.",
  },
  {
    q: "Can I self-host AHumane?",
    a: "Yes. The repository includes a README with development, build, and deployment instructions. There is no license fee or seat count. You are responsible for your own hosting, security, and model costs.",
  },
  {
    q: "Does AHumane work on mobile?",
    a: "Yes. The marketing site and studio are responsive. On a small screen, the humanizer stacks the input and output panels and shows a tab toggle.",
  },
  {
    q: "Is AHumane affiliated with Turnitin, GPTZero, or the other detectors?",
    a: "No. Those names are used only to describe the patterns the engine targets. AHumane is independent and does not have access to their models or scores.",
  },
];

const TOPICS = [
  { icon: Sparkles, title: "Humanizer", body: "Modes, styles, strength, meaning lock, and review.", href: "/ai-humanizer" },
  { icon: ScanSearch, title: "Detector", body: "Scores, heat-maps, confidence, and false positives.", href: "/ai-detector" },
  { icon: FileSearch, title: "Plagiarism", body: "What the checker covers and what it cannot see.", href: "/plagiarism-checker" },
  { icon: Wand2, title: "Studio", body: "Documents, history, settings, and the writer.", href: "/studio" },
];

export default function HelpPage() {
  return (
    <>
      <section className="border-b border-neutral-200 bg-neutral-50 py-16">
        <div className="container-page">
          <p className="eyebrow">Help Center</p>
          <h1 className="display mt-4 max-w-2xl text-[2.5rem] sm:text-[3.5rem]">
            How can we help?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Quick answers about the tools, the engine, privacy, and the limits we would rather be
            upfront about.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((topic) => (
              <Link
                key={topic.title}
                href={topic.href}
                className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <topic.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold">{topic.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{topic.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-900">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              Looking for the reasoning behind the rewrite rules? Read{" "}
              <Link href="/how-it-works" className="font-semibold underline underline-offset-2">
                How it works
              </Link>
              .
            </div>
            <div className="mt-8">
              <FaqAccordion items={FAQS} defaultOpen={0} />
            </div>
            <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
              <p className="text-sm font-semibold">Still stuck?</p>
              <p className="mt-1 text-xs text-slate-600">
                Email{" "}
                <a href="mailto:help@ahumane.app" className="text-blue-600 underline underline-offset-2">
                  help@ahumane.app
                </a>{" "}
                with the page, your browser, and what you expected to happen. We read every message.
              </p>
              <Link href="/studio" className="btn btn-secondary mt-4 h-9 px-4 text-xs">
                Back to the studio <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
