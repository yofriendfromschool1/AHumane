import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Link2 } from "lucide-react";
import {
  ARTICLES,
  getArticle,
  getRelatedArticles,
} from "@/lib/content/articles";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: ["/brand/og.png"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const headings = article.sections
    .filter((section): section is { heading: string; body: string } => Boolean(section.heading))
    .map((section) => ({ heading: section.heading, id: slugify(section.heading) }));
  const related = getRelatedArticles(article.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "AHumane" },
    mainEntityOfPage: `https://ahumane.app/blog/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> {formatDate(article.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {article.readingTime}
              </span>
            </div>
            <h1 className="display mt-4 text-[2.2rem] leading-[1.08] sm:text-[3.2rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{article.description}</p>
            <div className="mt-6 flex items-center gap-3 border-y border-neutral-200 py-4 text-xs text-slate-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                AH
              </span>
              <span>
                Written by <span className="font-medium text-neutral-700">{article.author}</span> · Reviewed for
                accuracy and sources
              </span>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  On this page
                </p>
                <nav className="mt-3 space-y-2 border-l border-neutral-200 pl-3" aria-label="Table of contents">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="block text-xs leading-5 text-slate-600 transition-colors hover:text-blue-600"
                    >
                      {heading.heading}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-semibold text-blue-900">Try the humanizer</p>
                  <p className="mt-1 text-[11px] leading-5 text-blue-900">
                    Free, no account, no word cap.
                  </p>
                  <Link
                    href="/studio/humanizer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700"
                  >
                    Open studio <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="prose-ahumane">
                {article.sections.map((section, index) => (
                  <section key={index} id={section.heading ? slugify(section.heading) : undefined}>
                    {section.heading ? <h2>{section.heading}</h2> : null}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                  </section>
                ))}
              </div>

              {article.sources?.length ? (
                <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    Sources and further reading
                  </p>
                  <ul className="mt-3 space-y-2">
                    {article.sources.map((source) => (
                      <li key={source.href}>
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-600 underline underline-offset-2"
                        >
                          <Link2 className="h-3.5 w-3.5" /> {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Put this into practice.</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Run a draft through the free Pro humanizer and see the before/after score.
                  </p>
                </div>
                <Link href="/studio/humanizer" className="btn btn-primary h-10 px-5 text-sm">
                  Open the humanizer <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="text-lg font-semibold tracking-tight">Related articles</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                    {item.category}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-snug">{item.title}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
