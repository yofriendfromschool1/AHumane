import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, FileSearch, Globe2, Quote, ShieldCheck } from "lucide-react";
import { PlagiarismWorkspace } from "@/components/studio/plagiarism-workspace";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FaqAccordion } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Free Plagiarism Checker — Find Copied Passages",
  description:
    "Check writing for copied passages against a public-domain corpus and Wikipedia. See the matching source, the shared passage, and the coverage. Free, private, no account.",
  alternates: { canonical: "/plagiarism-checker" },
};

const FAQS = [
  {
    q: "How accurate is this plagiarism checker?",
    a: "It uses exact 8-word sequence matching, which is precise for copied passages but limited in coverage. It checks a local public-domain corpus and, optionally, English Wikipedia search results. It does not crawl the entire web, academic databases, or your school's submission archive.",
  },
  {
    q: "Does it count quotes and citations?",
    a: "The current version matches any sequence of eight or more words, including quoted passages. Read the matched source before assuming misconduct: a properly quoted and cited passage is not plagiarism. A future update will add a quote-ignore toggle.",
  },
  {
    q: "Is this the same as Turnitin?",
    a: "No. Turnitin compares submissions against a large proprietary database and institutional archive. AHumane is a transparent, self-hosted checker with a small public corpus and Wikipedia. It is useful for catching obvious copying, not for replicating Turnitin's result.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "The check runs on your own server. If you enable the Wikipedia comparison, only short search shingles are sent to Wikipedia — never your full document. Nothing is stored.",
  },
  {
    q: "What is the difference between plagiarism and AI detection?",
    a: "Plagiarism is using someone else's words or ideas without credit. AI detection estimates whether text looks machine-generated. They are different questions and require different tools.",
  },
  {
    q: "Which languages are supported?",
    a: "The local corpus and Wikipedia check are English-only. The tool will still scan text in other languages, but matching coverage is limited until a multilingual source index is added.",
  },
];

const TYPES = [
  ["Direct copying", "A passage copied word for word without quotation marks or a citation."],
  ["Mosaic plagiarism", "Copied phrases mixed into your own sentences, or a paraphrase that keeps the source's structure."],
  ["Missing quotation marks", "A citation is present, but the exact wording is not marked as a quote."],
  ["Missing citation", "An idea or fact is used without crediting the source."],
  ["Self-plagiarism", "Reusing your own published or submitted work without permission or disclosure."],
  ["Accidental plagiarism", "A note loses its source, or a paraphrase stays too close to the original."],
];

export default function PlagiarismCheckerPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 pb-14 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Free plagiarism checker</p>
            <h1 className="display mt-4 text-[2.5rem] sm:text-[3.5rem]">Plagiarism Checker</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              See which passages match an existing source, where they came from, and how much of
              your text overlaps. Transparent method, honest coverage.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                Beta · limited corpus
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">8-word matching</span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">Wikipedia optional</span>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1">No sign-up</span>
            </div>
          </div>
          <div className="mt-10">
            <PlagiarismWorkspace />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="What it checks"
            title="Catch the obvious copies before someone else does"
            description="A focused checker is better than a vague percentage. Every match links to the source so you can judge it yourself."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Public-domain books", body: "Classic novels, essays, and speeches where copying is easy to verify." },
              { icon: Quote, title: "Quoted passages", body: "Exact wording is flagged even when it is properly quoted — use the source link to check." },
              { icon: Globe2, title: "Wikipedia", body: "Optional search against English Wikipedia extracts for phrases distinctive enough to query." },
              { icon: FileSearch, title: "Coverage score", body: "The share of your text that overlaps a source, not a mysterious similarity index." },
              { icon: ShieldCheck, title: "Private by design", body: "Your document stays on your server. Only short search shingles reach Wikipedia." },
              { icon: Check, title: "Honest limits", body: "No full-web crawl, no paywalled journals, no institutional archive. We say so." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Know the difference"
            title="Plagiarism is not the same as AI detection"
            description="AI-generated text can be original. Human-written text can be copied. Check both, for different reasons."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Plagiarism checker</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Compares your text to existing sources. Finds copied sequences, missing quotes, and
                unattributed passages. Needs a source corpus.
              </p>
              <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                Question: “Did someone else write this first?”
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold">AI detector</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Estimates whether text looks machine-generated by measuring style, rhythm, and
                vocabulary. Does not need a source.
              </p>
              <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                Question: “Does this read like a model wrote it?”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Types of plagiarism"
            title="Six ways a draft can go wrong"
            description="Most plagiarism is not deliberate. It is a note that lost its source or a paraphrase that stayed too close."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TYPES.map(([title, body]) => (
              <div key={title} className="rounded-xl border border-neutral-200 p-4">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="FAQ" title="Plagiarism checker questions" description="The coverage, the method, and what this tool cannot see." />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="container-page">
          <h2 className="display mx-auto max-w-2xl text-[2.25rem] sm:text-[3rem]">
            Check the draft. Then check the writing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Use the plagiarism checker for sources and the AI detector for style. Both are free.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/studio/plagiarism" className="btn btn-primary h-12 px-7 text-base">
              Open the checker <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/ai-detector" className="btn btn-secondary h-12 px-7 text-base">
              Open the AI detector
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
