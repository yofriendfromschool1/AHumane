import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Lock, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Why AHumane Exists",
  description:
    "AHumane is an independent, free, self-hosted AI humanizer. Read the story behind the project and the principles that shape the engine.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    icon: Heart,
    title: "Sound like a person, not a product",
    body: "The goal is not to fool a detector. It is to write something a reader would actually want to finish. Detector scores are a side effect, not the point.",
  },
  {
    icon: Lock,
    title: "Keep the writer in control",
    body: "Every change is visible. The engine shows what it changed and why, preserves protected facts, and lets you keep the original whenever you prefer it.",
  },
  {
    icon: Users,
    title: "Be honest about the limits",
    body: "No detector is definitive. No humanizer can promise a specific score. We say that on the page instead of hiding it in a footnote.",
  },
  {
    icon: Sparkles,
    title: "Do not paywall the good part",
    body: "The Pro engine is the default engine. There is no secret better model behind a subscription. That is the entire product decision.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page">
          <p className="eyebrow">About AHumane</p>
          <h1 className="display mt-4 max-w-3xl text-[2.5rem] leading-[1.05] sm:text-[4rem]">
            Making AI writing more human.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            AHumane began as a small experiment in making AI drafts read less like a press release.
            It grew into a studio for people who use AI to draft but still care how the final
            sentence sounds.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page mx-auto max-w-3xl">
          <div className="space-y-10">
            <div>
              <p className="eyebrow">It started with a blank page</p>
              <h2 className="display mt-3 text-[1.9rem] sm:text-[2.4rem]">AI made drafting easy. Editing got harder.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                A first draft that used to take an afternoon now takes a prompt. But the draft
                arrives with a voice: polished, balanced, suspiciously even. You can spend as long
                editing the machine's cadence out as you saved by generating it.
              </p>
            </div>
            <div>
              <p className="eyebrow">Then came the detectors</p>
              <h2 className="display mt-3 text-[1.9rem] sm:text-[2.4rem]">The score became the assignment.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Schools and publishers started running drafts through AI detectors. The tools were
                inconsistent, opaque, and often wrong — especially for non-native writers. A
                generation of students learned to fear a percentage instead of learning to revise.
              </p>
            </div>
            <div>
              <p className="eyebrow">So we built the tool we wanted</p>
              <h2 className="display mt-3 text-[1.9rem] sm:text-[2.4rem]">A humanizer that shows its work.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                AHumane is the result: a humanizer, a detector that explains itself, a plagiarism
                checker, and a writing studio. The Pro engine is free because the point is to make
                the tool useful, not to sell a subscription to the useful part.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <blockquote className="text-xl font-medium leading-9 tracking-tight text-blue-950 sm:text-2xl">
              “The best writing is rewriting.”
            </blockquote>
            <p className="mt-3 text-sm font-medium text-blue-700">E. B. White</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-900/70">
              That is still the whole idea. AHumane does not write for you. It gets the draft out of
              the uncanny valley so you can make it yours.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page">
          <p className="eyebrow text-center">What we believe</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-center text-[2rem] sm:text-[2.6rem]">
            Four principles, no fine print.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <principle.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{principle.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page mx-auto max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ["2024", "The first local humanizer prototype."],
              ["2026", "The full AHumane studio launches."],
              ["Now", "Free, self-hostable, and still improving."],
            ].map(([year, body]) => (
              <div key={year} className="border-l-2 border-blue-200 pl-4">
                <p className="font-mono text-xs font-medium text-blue-600">{year}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/studio" className="btn btn-primary h-11 px-6 text-sm">
              Try the studio <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-slate-600">
              Questions?{" "}
              <a href="mailto:hello@ahumane.app" className="underline underline-offset-2">
                hello@ahumane.app
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
