export function countWords(text: string): number {
  const matches = text.trim().match(/[\p{L}\p{N}'’]+(?:[-‐][\p{L}\p{N}'’]+)*/gu);
  return matches ? matches.length : 0;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function countSentences(text: string): number {
  const matches = text.match(/[^.!?…]+[.!?…]+["'”’)\]]*|[^.!?…]+$/g);
  return matches ? matches.filter((s) => s.trim().length > 0).length : 0;
}

export function titleCase(input: string): string {
  const small = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "into",
    "nor",
    "of",
    "on",
    "or",
    "over",
    "per",
    "the",
    "to",
    "up",
    "via",
    "with",
  ]);
  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && index < input.split(/\s+/).length - 1 && small.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export function plainTextSnippet(text: string, max = 220): string {
  return truncate(text.replace(/\s+/g, " ").trim(), max);
}
