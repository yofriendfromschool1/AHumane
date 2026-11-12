import { buildShingles, distinctivePhrases, findInLocalCorpus } from "./local-corpus";

export interface PlagiarismMatch {
  id: string;
  title: string;
  url: string;
  domain: string;
  coverage: number;
  snippets: string[];
}

export interface PlagiarismResult {
  score: number;
  matched: number;
  original: number;
  sources: PlagiarismMatch[];
  words: number;
  method: string;
  warnings: string[];
}

async function wikipediaSearch(phrase: string): Promise<Array<{ title: string; pageid: number }>> {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", `"${phrase}"`);
  url.searchParams.set("srlimit", "3");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": "AHumanePlagiarism/1.0 (https://ahumane.app)" },
  });
  if (!response.ok) throw new Error(`Wikipedia search ${response.status}`);
  const data = (await response.json()) as {
    query?: { search?: Array<{ title: string; pageid: number }> };
  };
  return data.query?.search ?? [];
}

async function wikipediaExtract(pageid: number): Promise<string> {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("pageids", String(pageid));
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": "AHumanePlagiarism/1.0 (https://ahumane.app)" },
  });
  if (!response.ok) throw new Error(`Wikipedia extract ${response.status}`);
  const data = (await response.json()) as {
    query?: { pages?: Record<string, { extract?: string }> };
  };
  const page = data.query?.pages?.[String(pageid)];
  return page?.extract ?? "";
}

export async function checkPlagiarism(
  text: string,
  options: { web?: boolean } = {},
): Promise<PlagiarismResult> {
  const warnings: string[] = [];
  const { words } = buildShingles(text);
  const wordCount = words.length;
  const matches = new Map<string, PlagiarismMatch>();
  const local = findInLocalCorpus(text);

  for (const match of local) {
    const coverage = Math.min(100, Math.round(match.overlap * 100));
    if (coverage < 2) continue;
    matches.set(match.source.id, {
      id: match.source.id,
      title: match.source.title,
      url: match.source.url,
      domain: new URL(match.source.url).hostname.replace(/^www\./, ""),
      coverage,
      snippets: [match.matchedText].filter(Boolean),
    });
  }

  if (options.web && wordCount >= 60) {
    try {
      const phrases = distinctivePhrases(text, 3);
      const seen = new Set<number>();
      for (const phrase of phrases) {
        const results = await wikipediaSearch(phrase);
        for (const result of results.slice(0, 2)) {
          if (seen.has(result.pageid)) continue;
          seen.add(result.pageid);
          const extract = await wikipediaExtract(result.pageid);
          if (!extract) continue;
          const sourceShingles = new Set(buildShingles(extract.slice(0, 12000)).shingles);
          const userShingles = buildShingles(text).shingles;
          const matched = userShingles.filter((shingle) => sourceShingles.has(shingle));
          if (matched.length === 0) continue;
          const coverage = Math.min(
            100,
            Math.round((matched.length / Math.max(1, userShingles.length)) * 100),
          );
          if (coverage < 2) continue;
          matches.set(`wiki-${result.pageid}`, {
            id: `wiki-${result.pageid}`,
            title: result.title,
            url: `https://en.wikipedia.org/?curid=${result.pageid}`,
            domain: "en.wikipedia.org",
            coverage,
            snippets: matched.slice(0, 3),
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      warnings.push(
        error instanceof Error
          ? `Web check unavailable: ${error.message}. Local corpus results are still shown.`
          : "Web check unavailable; local corpus results are still shown.",
      );
    }
  } else if (options.web) {
    warnings.push("Web check skipped: add at least 60 words for a Wikipedia comparison.");
  }

  const sources = Array.from(matches.values()).sort((a, b) => b.coverage - a.coverage);
  const primary = sources[0]?.coverage ?? 0;
  const secondary = sources.slice(1).reduce((sum, source) => sum + source.coverage, 0);
  const combined = Math.min(100, Math.round(primary + secondary * 0.15));

  return {
    score: combined,
    matched: combined,
    original: 100 - combined,
    sources,
    words: wordCount,
    method:
      "8-word shingle overlap against a local public-domain corpus" +
      (options.web ? " and English Wikipedia search results" : ""),
    warnings,
  };
}
