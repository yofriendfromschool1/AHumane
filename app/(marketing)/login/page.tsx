import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { LoginForm } from "@/components/marketing/login-form";

export const metadata: Metadata = {
  title: "Log in — AHumane",
  description: "Log in to the AHumane studio demo, or continue without an account.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div id="main" className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_80%,#93c5fd,transparent_30%)]" aria-hidden="true" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">A</span>
            <span className="text-xl font-semibold tracking-tight">AHumane</span>
          </Link>
          <p className="mt-16 max-w-md text-3xl font-semibold leading-tight tracking-tight">
            The most consistent humanizer on the market. Now free.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-blue-50">
            Pro mode, the detector, the plagiarism checker, and the studio. No word cap, no account
            required, no watermark.
          </p>
        </div>
        <ul className="relative space-y-3 text-sm text-blue-50">
          {[
            "Pro humanizer with meaning lock",
            "Detector with sentence-level reasons",
            "Plagiarism checks and documents",
            "Your text stays on your machine",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/15">
                <Check className="h-2.5 w-2.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 lg:justify-end">
          <Link href="/" className="text-sm font-medium text-neutral-600 lg:hidden">
            ← Back to AHumane
          </Link>
          <a href="/studio" className="text-xs font-medium text-slate-600 hover:text-blue-600">
            Skip sign-in
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <LoginForm />
        </div>
        <p className="pb-6 text-center text-[10px] text-slate-600">
          Local demo · no real authentication · no password stored
        </p>
      </div>
    </div>
  );
}
