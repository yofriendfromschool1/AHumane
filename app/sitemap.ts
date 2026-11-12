import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";

const BASE = "https://ahumane.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/ai-humanizer",
    "/ai-detector",
    "/plagiarism-checker",
    "/chrome",
    "/pricing",
    "/about",
    "/how-it-works",
    "/blog",
    "/help",
    "/status",
    "/login",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/blog" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));

  const articles = ARTICLES.map((article) => ({
    url: `${BASE}/blog/${article.slug}`,
    lastModified: new Date(`${article.date}T12:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...articles];
}
