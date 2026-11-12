import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { ARTICLES_SORTED } from "@/lib/content/articles";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Blog — AI Writing, Detection, and Better Drafts",
  description:
    "Research-backed guides on humanizing AI text, understanding AI detectors, editing rhythm, and writing with AI without losing your voice.",
  alternates: { canonical: "/blog" },
};

const CATEGORIES = ["All", "Product", "Detection", "Writing", "Research", "Ethics"] as const;

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const active = params.category && CATEGORIES.includes(params.category as never)
    ? params.category
    : "All";
  const filtered =
    active === "All"
      ? ARTICLES_SORTED
      : ARTICLES_SORTED.filter((article) => article.category === active);
  const [featured, ...rest] = filtered;

  return (
    <>
      <section className="border-b border-neutral-200 bg-neutral-50 py-16">
        <div className="container-page">
          <p className="eyebrow">Articles</p>
          <h1 className="display mt-4 max-w-3xl text-[2.5rem] sm:text-[3.75rem]">
            Notes on writing that still sounds human.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Practical guides, detector research, and the occasional argument about why “utilize” is
            usually the wrong word.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={category === "All" ? "/blog" : `/blog?category=${category}`}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  active === category
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                )}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-lg hover:shadow-slate-900/5 md:grid-cols-[1.1fr_0.9fr] md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {formatDate(featured.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {featured.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Read the article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-8">
                <div className="w-full max-w-[260px] rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <div className="h-2 w-20 rounded bg-white/40" />
                  <div className="mt-3 h-2 w-full rounded bg-white/20" />
                  <div className="mt-2 h-2 w-5/6 rounded bg-white/20" />
                  <div className="mt-2 h-2 w-4/6 rounded bg-white/20" />
                  <div className="mt-4 inline-flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-[10px] font-medium text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> 11% AI
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-600">
                    {article.category}
                  </span>
                  <span className="text-[11px] text-slate-600">{article.readingTime}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {article.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-[11px] text-slate-600">
                  <span>{formatDate(article.date)}</span>
                  <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {!filtered.length ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-sm font-medium text-neutral-600">No articles in this category yet.</p>
              <Link href="/blog" className="mt-2 inline-block text-sm text-blue-600">
                See all articles
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
