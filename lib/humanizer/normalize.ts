/** Unicode and punctuation normalisation. Keeps meaning, kills invisible artifacts. */

const ZERO_WIDTH = /[\u200B-\u200D\uFEFF\u2060]/g;
const NBSP = /\u00A0/g;

export function normalizeText(input: string): string {
  let text = input.replace(/\r\n?/g, "\n");
  text = text.replace(ZERO_WIDTH, "");
  text = text.replace(NBSP, " ");

  // Normalise exotic spaces but keep line structure.
  text = text.replace(/[ \t\u2000-\u200A\u202F\u205F\u3000]+/g, " ");
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  // Straight quotes keep the text portable and remove a known AI artifact.
  text = text.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  text = text.replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  text = text.replace(/\u2026/g, "...");
  return text;
}

/** Convert em/en dashes depending on style. Natural style avoids them entirely. */
export function normalizeDashes(input: string, style: string): string {
  if (style === "academic" || style === "professional") {
    return input.replace(/\s*[—–]\s*/g, " – ");
  }
  return input.replace(/\s*[—–]\s*/g, ", ");
}

export function capitalizeFirst(input: string): string {
  const match = input.match(/^([\s"'“”‘’(\[]*)(\p{L})/u);
  if (!match) return input;
  const prefix = match[1];
  const letter = match[2];
  const index = prefix.length;
  return (
    input.slice(0, index) +
    letter.toUpperCase() +
    input.slice(index + letter.length)
  );
}

export function lowercaseFirst(input: string): string {
  const match = input.match(/^([\s"'“”‘’(\[]*)(\p{Lu})/u);
  if (!match) return input;
  const index = match[1].length;
  return (
    input.slice(0, index) +
    match[2].toLowerCase() +
    input.slice(index + match[2].length)
  );
}

export function ensureTerminalPunctuation(input: string): string {
  const trimmed = input.trimEnd();
  if (!trimmed) return trimmed;
  if (/[.!?…]["'”’)\]]*$/.test(trimmed)) return trimmed;
  return trimmed + ".";
}

export function cleanSpacing(input: string): string {
  return input
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:!?])(?=[\p{L}\p{N}])/gu, (match, _punct: string, offset: number, whole: string) => {
      const previous = whole[offset - 1] ?? "";
      const next = whole[offset + 1] ?? "";
      if (/\d/.test(previous) && /\d/.test(next)) return match;
      return `${match} `;
    })
    .replace(/\.\.\.\.+/g, "...")
    .replace(/\s+$/gm, "");
}

export function stripMarkdownEmphasis(input: string): string {
  return input
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, "$1$2");
}

const WORDY: Array<[RegExp, string]> = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bin the event that\b/gi, "if"],
  [/\bhas the ability to\b/gi, "can"],
  [/\bhave the ability to\b/gi, "can"],
  [/\bis able to\b/gi, "can"],
  [/\bare able to\b/gi, "can"],
  [/\bprior to\b/gi, "before"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bwith regard to\b/gi, "about"],
  [/\bwith respect to\b/gi, "about"],
  [/\bin terms of\b/gi, "for"],
  [/\ba large number of\b/gi, "many"],
  [/\ba small number of\b/gi, "a few"],
  [/\bthe majority of\b/gi, "most"],
  [/\bdespite the fact that\b/gi, "although"],
  [/\bfor the purpose of\b/gi, "to"],
  [/\bin the near future\b/gi, "soon"],
  [/\bon a daily basis\b/gi, "daily"],
  [/\bin the process of\b/gi, "currently"],
  [/\bit is important to note that\b/gi, ""],
  [/\bit is worth noting that\b/gi, ""],
  [/\bit should be noted that\b/gi, ""],
  [/\bneedless to say\b/gi, ""],
  [/\bin today's (?:fast-paced |rapidly changing |digital )?world\b/gi, "these days"],
  [/\bin today's (?:fast-paced |rapidly changing |digital )?age\b/gi, "these days"],
  [/\bin the realm of\b/gi, "in"],
  [/\bin the landscape of\b/gi, "in"],
  [/\bthe fact that\b/gi, "that"],
];

export function compressWordyPhrases(input: string): string {
  let text = input;
  for (const [pattern, replacement] of WORDY) {
    text = text.replace(pattern, replacement);
  }
  return text.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1");
}

const AN_EXCEPTIONS = /^(?:hour|honest|honor|honour|heir|herb)/i;
const A_EXCEPTIONS = /^(?:university|unique|uniform|union|user|use|usual|usually|European|one|once|euro|ubiquitous)/i;

export function fixArticles(input: string): string {
  let text = input;
  text = text.replace(/\ban ([bcdfghjklmnpqrstvwxz])/gi, (_m, letter: string, offset: number, whole: string) => {
    const nextWord = whole.slice(offset + 3).split(/\s+/)[0] ?? "";
    if (AN_EXCEPTIONS.test(nextWord)) return `an ${letter}`;
    return `a ${letter}`;
  });
  text = text.replace(/\ba ([aeiou])/gi, (_m, letter: string, offset: number, whole: string) => {
    const nextWord = whole.slice(offset + 2).split(/\s+/)[0] ?? "";
    if (A_EXCEPTIONS.test(nextWord)) return `a ${letter}`;
    return `an ${letter}`;
  });
  return text;
}
