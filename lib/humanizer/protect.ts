import type { ProtectedToken } from "./types";
import type { Rng } from "../utils/seeded-random";

/**
 * Placeholders use Unicode private-use characters so ordinary word rules and
 * regexes never touch protected facts. Values are restored verbatim.
 */
const OPEN = "\uE000";
const CLOSE = "\uE001";
const TOKEN_RE = /\uE000qzx([a-z]+)\uE001/g;

const COMMON_CAPITALIZED = new Set(
  `The This That These Those There Their They Them Then Than Thank Thanks It Its In On At By For From With Without As And But Or If When While After Before During Since Until Although Because However Moreover Furthermore Additionally Finally First Second Third Next Now Today Yesterday Tomorrow Here What Who Why How Where Which We You He She His Her Our Your My I A An Not No Yes Some Many Most More Less Few Several Each Every Both All Any One Two Three Four Five Six Seven Eight Nine Ten New Old Good Great Best Better High Low Long Short Large Small Early Late Young First Last Next Same Other Such Only Also Just Even Still Yet Already Again Ever Never Often Sometimes Usually Generally Typically Overall Thus Hence Therefore Consequently Meanwhile Instead Rather Perhaps Maybe Clearly Obviously Importantly Notably Interestingly Surprisingly Notably Indeed Of Course Ultimately Firstly Secondly Lastly Notably Importantly Conversely Alternatively Specifically Particularly Especially`.split(
    /\s+/,
  ),
);

interface ProtectRule {
  kind: string;
  pattern: RegExp;
}

const RULES: ProtectRule[] = [
  { kind: "code", pattern: /```[\s\S]*?```/g },
  { kind: "code", pattern: /`[^`\n]{1,400}`/g },
  {
    kind: "url",
    pattern: /\b(?:https?:\/\/|www\.)[^\s<>"')]+/gi,
  },
  {
    kind: "email",
    pattern: /\b[\w.+-]+@[\w-]+\.[\w.-]{2,}\b/g,
  },
  {
    kind: "citation",
    pattern:
      /\([A-Z][A-Za-z'’.-]+(?:\s+(?:et al\.|and|&)\s+[A-Z]?[A-Za-z'’.-]+)?,?\s+\d{4}[a-z]?(?:,\s*(?:p|pp)\.?\s*\d+(?:[-–]\d+)?)?\)/g,
  },
  {
    kind: "citation",
    pattern:
      /\((?=[^()]{0,120}\d{4})[A-Za-z][^()]{0,120}?\d{4}[a-z]?(?:,\s*(?:p|pp)\.?\s*\d+(?:[-–]\d+)?)?\)/g,
  },
  { kind: "citation", pattern: /\[\d+(?:\s*[,–-]\s*\d+)*\]/g },
  { kind: "quote", pattern: /"[^"\n]{1,600}"/g },
  {
    kind: "number",
    pattern:
      /(?<![\p{L}\p{N}._])(?:[$€£¥]\s?\d[\d,.]*(?:\s?(?:%|million|billion|trillion|bn|m|k))?|\d[\d,.]*(?:\s?(?:%|million|billion|trillion|bn|m|k))?)(?![\p{L}\p{N}])/gu,
  },
  {
    kind: "name",
    pattern:
      /\b(?:[A-Z][a-zA-Z'’.-]+(?:\s+(?:of|the|de|van|von|der|da|di|del|la|le)\s+)?){2,5}\b/g,
  },
];

const SINGLE_NAME = /\b[A-Z][a-z][a-zA-Z'’.-]{1,24}\b/g;

export interface ProtectionResult {
  text: string;
  tokens: ProtectedToken[];
}

function encodeIndex(index: number): string {
  let n = index + 1;
  let code = "";
  while (n > 0) {
    n -= 1;
    code = String.fromCharCode(97 + (n % 26)) + code;
    n = Math.floor(n / 26);
  }
  return code;
}

function decodeIndex(code: string): number {
  let n = 0;
  for (const char of code) n = n * 26 + (char.charCodeAt(0) - 96);
  return n - 1;
}

export function protectText(
  input: string,
  _rng: Rng,
  options: { singleNames?: boolean } = {},
): ProtectionResult {
  const tokens: ProtectedToken[] = [];
  let text = input;

  const store = (value: string, kind: string) => {
    const token = `${OPEN}qzx${encodeIndex(tokens.length)}${CLOSE}`;
    tokens.push({ token, value, kind });
    return token;
  };

  for (const rule of RULES) {
    text = text.replace(rule.pattern, (match) => {
      // Don't create nested placeholders.
      if (match.includes(OPEN) || match.includes(CLOSE)) return match;
      return store(match, rule.kind);
    });
  }

  // Single capitalised words are only protected for the deterministic engine.
  // For model rewrites this over-protects sentence-initial common words and
  // produces false "dropped fact" failures.
  if (options.singleNames !== false) {
    text = text.replace(SINGLE_NAME, (match) => {
      if (match.includes(OPEN)) return match;
      if (COMMON_CAPITALIZED.has(match)) return match;
      return store(match, "name");
    });
  }

  return { text, tokens };
}

export function restoreText(input: string, tokens: ProtectedToken[]): string {
  return input.replace(TOKEN_RE, (_match, code: string) => {
    const token = tokens[decodeIndex(code)];
    return token ? token.value : "";
  });
}

export function protectedValues(tokens: ProtectedToken[]): string[] {
  return tokens.map((token) => token.value);
}

export function findMissingProtected(
  before: ProtectedToken[],
  output: string,
): string[] {
  const missing: string[] = [];
  for (const token of before) {
    if (!output.includes(token.value)) missing.push(token.value);
  }
  return missing;
}

export function containsPlaceholder(input: string): boolean {
  return input.includes(OPEN) || input.includes(CLOSE);
}

export const PLACEHOLDER_OPEN = OPEN;
export const PLACEHOLDER_CLOSE = CLOSE;
