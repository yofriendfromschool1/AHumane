import type { Metadata } from "next";
import { Check, Clock, Server, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Status — AHumane",
  description: "Current status of AHumane's humanizer, detector, plagiarism checker, and studio.",
  alternates: { canonical: "/status" },
};

const SERVICES = [
  ["Humanizer", "Operational", "Deterministic Pro engine and optional model provider."],
  ["AI Detector", "Operational", "Sentence heat-map and signal breakdown."],
  ["Plagiarism Checker", "Operational", "Local corpus is always available; Wikipedia depends on network access."],
  ["Studio & Documents", "Operational", "Browser-local storage; no account service required."],
];

export default function StatusPage() {
  return (
    <>
      <section className="border-b border-neutral-200 bg-neutral-50 py-16">
        <div className="container-page">
          <p className="eyebrow">Status</p>
          <h1 className="display mt-4 text-[2.5rem] sm:text-[3.5rem]">All systems operational.</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <Check className="h-3 w-3" /> Operational
            </span>
            Last checked: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {SERVICES.map(([name, status, detail]) => (
              <div key={name} className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  <Check className="h-3 w-3" /> {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Server, title: "Self-hosted", body: "Your instance, your infrastructure. Uptime depends on your deployment." },
              { icon: Clock, title: "No maintenance window", body: "There is no central service to take offline. Updates are deployed by the operator." },
              { icon: ShieldCheck, title: "No tracking", body: "This status page is static. There is no third-party monitoring script." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-neutral-200 p-4">
                <item.icon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-slate-600">
            Third-party model providers and Wikipedia have their own status pages and may be unavailable independently.
          </p>
        </div>
      </section>
    </>
  );
}
