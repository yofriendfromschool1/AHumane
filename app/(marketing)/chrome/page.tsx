import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, Lock, MousePointerClick, Sparkles, Zap } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FaqAccordion } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "AHumane for Chrome — Humanize Without Switching Tabs",
  description:
    "Select AI text on any page and send it to AHumane's free Pro humanizer. Download the unpacked Chrome extension, no account required.",
  alternates: { canonical: "/chrome" },
};

const FAQS = [
  {
    q: "What is the AHumane Chrome extension?",
    a: "A small Manifest V3 extension that takes the text you have selected on a page and opens it in the AHumane studio. It does not run a model in the browser and does not read pages in the background.",
  },
  {
    q: "How do I install it?",
    a: "Download the zip, unzip it, open chrome://extensions, enable Developer mode, choose “Load unpacked,” and select the folder. Because it is self-hosted software, it is not in the Chrome Web Store.",
  },
  {
    q: "Do I need an account?",
    a: "No. The extension opens the same free studio. There is no sign-in step.",
  },
  {
    q: "Which languages does it support?",
    a: "The extension is language-agnostic: it sends whatever you select. The built-in engine is deepest in English and does structural cleanup in six more languages; a connected model can handle 100+.",
  },
  {
    q: "Is it free?",
    a: "Yes. The extension is part of the free AHumane project. There is no paid edition.",
  },
  {
    q: "What permissions does it use?",
    a: "activeTab and scripting to read the current selection on demand, storage to remember your app URL, and contextMenus for the right-click action. It does not request access to all sites.",
  },
  {
    q: "Where can I get help?",
    a: "Open the Help Center or email help@ahumane.app. Include your browser version and the page where the problem occurred.",
  },
];

export default function ChromePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 hero-glow" aria-hidden="true" />
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">AHumane for Chrome</p>
            <h1 className="display mt-4 text-[2.5rem] sm:text-[3.6rem]">
              Humanize without switching tabs.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Select a paragraph in Gmail, Docs, Notion, or any page. Send it to the free Pro
              humanizer in one click. No account, no browser history scraping, no word cap.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="/ahumane-extension.zip" download className="btn btn-primary h-12 px-6 text-base">
                <Download className="h-4 w-4" /> Download for Chrome
              </a>
              <Link href="/how-it-works" className="btn btn-secondary h-12 px-6 text-base">
                How it works
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Unpacked extension · Manifest V3 · Chrome, Edge, Brave, Arc
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-100 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl">
              <div className="flex h-9 items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3">
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                <div className="ml-2 flex-1 rounded bg-white px-2 py-1 text-[9px] text-neutral-500">
                  mail.google.com
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="h-2 w-24 rounded bg-neutral-200" />
                <div className="h-2 w-full rounded bg-neutral-100" />
                <div className="h-2 w-5/6 rounded bg-neutral-100" />
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-[10px] leading-4 text-blue-900">
                    It is important to note that our team leverages robust frameworks to facilitate
                    seamless collaboration across stakeholders.
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[9px] font-medium text-white">
                    <Sparkles className="h-2.5 w-2.5" /> Humanize selection
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-[10px] leading-4 text-emerald-950">
                    Our team uses a few simple frameworks so people can actually work together.
                    It sounds obvious. It is not.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why use the extension"
            title="One click between the draft and the studio"
            description="No copy-paste relay race. Select, click, and review in the same place you already work."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: MousePointerClick, title: "Humanize a selection", body: "Highlight text, right-click, and choose “Humanize selection with AHumane.” The studio opens with the text ready." },
              { icon: Zap, title: "Fast by design", body: "The extension only reads the selection you ask for. There are no background scrapers, content scripts, or analytics." },
              { icon: Lock, title: "No account", body: "It opens the same free studio. Nothing to sign up for, nothing to unlock, no usage counter." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Install</p>
            <h2 className="display mt-3 text-[2rem] sm:text-[2.5rem]">Four steps, about a minute.</h2>
            <ol className="mt-6 space-y-4">
              {[
                "Download and unzip the extension.",
                "Open chrome://extensions in your browser.",
                "Turn on Developer mode (top right).",
                "Choose “Load unpacked” and select the unzipped folder.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs leading-5 text-slate-600">
              The extension defaults to <code className="rounded bg-white px-1 py-0.5">http://localhost:3210</code>.
              Click “Set app URL” in the extension popup to point it at your deployment.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  A
                </span>
                <div>
                  <p className="text-sm font-semibold">AHumane</p>
                  <p className="text-[11px] text-slate-600">Manifest V3 · v1.0.0</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                Free
              </span>
            </div>
            <ul className="mt-5 space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span>Reads selected text</span>
                <span className="text-emerald-700">On demand</span>
              </li>
              <li className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span>Background page access</span>
                <span className="text-slate-600">No</span>
              </li>
              <li className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span>Analytics or tracking</span>
                <span className="text-slate-600">None</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Account required</span>
                <span className="text-slate-600">No</span>
              </li>
            </ul>
            <a href="/ahumane-extension.zip" download className="btn btn-secondary mt-5 h-10 w-full text-sm">
              <Download className="h-4 w-4" /> Download zip
            </a>
            <p className="mt-2 text-center text-[10px] text-slate-600">
              Chrome Web Store listing coming later. Unpacked install works now.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading eyebrow="FAQ" title="Extension questions" description="Permissions, install, languages, and the parts that are intentionally missing." />
          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="container-page">
          <h2 className="display mx-auto max-w-2xl text-[2.25rem] sm:text-[3rem]">
            Put the humanizer where you write.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Select a draft, right-click, and finish it in the studio. Free, no account.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/ahumane-extension.zip" download className="btn btn-primary h-12 px-7 text-base">
              <Download className="h-4 w-4" /> Download the extension
            </a>
            <Link href="/ai-humanizer" className="btn btn-secondary h-12 px-7 text-base">
              See the humanizer <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
