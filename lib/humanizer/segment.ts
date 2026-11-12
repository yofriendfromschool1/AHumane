/** Paragraph and sentence segmentation with abbreviation guards. */

const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "mt",
  "vs",
  "etc",
  "e.g",
  "i.e",
  "fig",
  "figs",
  "no",
  "vol",
  "pp",
  "p",
  "al",
  "inc",
  "ltd",
  "co",
  "corp",
  "dept",
  "univ",
  "approx",
  "est",
  "min",
  "max",
  "jan",
  "feb",
  "mar",
  "apr",
  "jun",
  "jul",
  "aug",
  "sep",
  "sept",
  "oct",
  "nov",
  "dec",
]);

export function splitParagraphs(input: string): string[] {
  return input
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function splitSentences(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
      const parts = Array.from(segmenter.segment(trimmed), (s) => s.segment.trim());
      const merged = mergeAbbreviationSplits(parts);
      if (merged.length > 0) return merged;
    } catch {
      // fall through
    }
  }

  return mergeAbbreviationSplits(
    trimmed
      .replace(/([.!?…])(["'”’)\]]*)\s+/g, "$1$2\n")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function mergeAbbreviationSplits(parts: string[]): string[] {
  const result: string[] = [];
  for (const part of parts) {
    const previous = result[result.length - 1];
    if (previous) {
      const lastWord = previous
        .replace(/[.!?…]+["'”’)\]]*$/, "")
        .split(/\s+/)
        .pop()
        ?.toLowerCase()
        .replace(/^\(/, "");
      if (lastWord && ABBREVIATIONS.has(lastWord)) {
        result[result.length - 1] = `${previous} ${part}`;
        continue;
      }
      if (/\b[A-Z]$/.test(previous) || /\b[A-Z]\.$/.test(previous)) {
        // Initials like "J. K. Rowling"
        result[result.length - 1] = `${previous} ${part}`;
        continue;
      }
    }
    result.push(part);
  }
  return result;
}

export function joinSentences(sentences: string[]): string {
  return sentences
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitIntoChunks(text: string, maxWords: number): string[] {
  const paragraphs = splitParagraphs(text);
  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).length;
    if (current.length > 0 && currentWords + words > maxWords) {
      chunks.push(current.join("\n\n"));
      current = [];
      currentWords = 0;
    }
    if (words > maxWords) {
      const sentences = splitSentences(paragraph);
      let buffer: string[] = [];
      let bufferWords = 0;
      for (const sentence of sentences) {
        const sw = sentence.split(/\s+/).length;
        if (buffer.length > 0 && bufferWords + sw > maxWords) {
          chunks.push(buffer.join(" "));
          buffer = [];
          bufferWords = 0;
        }
        buffer.push(sentence);
        bufferWords += sw;
      }
      if (buffer.length) chunks.push(buffer.join(" "));
    } else {
      current.push(paragraph);
      currentWords += words;
    }
  }
  if (current.length) chunks.push(current.join("\n\n"));
  return chunks.filter(Boolean);
}
