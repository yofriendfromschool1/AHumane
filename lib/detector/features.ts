import { countWords } from "../utils/text";

export interface PhraseHit {
  term: string;
  index: number;
  weight: number;
  kind: "word" | "phrase";
}

const AI_PHRASES: Array<[string, number]> = [
  ["delve into", 1.4],
  ["delves into", 1.4],
  ["delving into", 1.4],
  ["tapestry", 1.6],
  ["pivotal", 1.3],
  ["testament to", 1.5],
  ["underscores", 1.4],
  ["underscoring", 1.4],
  ["showcases", 1.3],
  ["showcasing", 1.3],
  ["leverage", 1.2],
  ["leveraging", 1.2],
  ["utilize", 1.2],
  ["utilizing", 1.2],
  ["myriad", 1.3],
  ["plethora", 1.4],
  ["realm", 1.1],
  ["landscape", 0.9],
  ["seamless", 1.2],
  ["seamlessly", 1.2],
  ["robust", 1.0],
  ["foster", 1.1],
  ["fostering", 1.1],
  ["garner", 1.2],
  ["intricate", 1.1],
  ["interplay", 1.3],
  ["meticulous", 1.2],
  ["holistic", 1.2],
  ["paradigm", 1.2],
  ["transformative", 1.3],
  ["groundbreaking", 1.3],
  ["cutting-edge", 1.4],
  ["game-changing", 1.4],
  ["unlock the power", 1.5],
  ["navigate the complexities", 1.6],
  ["in today's fast-paced", 1.6],
  ["in the ever-evolving", 1.6],
  ["it is important to note", 1.8],
  ["it is worth noting", 1.6],
  ["in conclusion", 1.8],
  ["moreover", 1.2],
  ["furthermore", 1.2],
  ["additionally", 1.2],
  ["consequently", 1.1],
  ["thus,", 1.0],
  ["hence,", 1.0],
  ["firstly", 1.1],
  ["secondly", 1.1],
  ["lastly", 1.1],
  ["overall,", 0.9],
  ["ultimately,", 0.9],
  ["serves as", 1.3],
  ["stands as", 1.3],
  ["plays a crucial role", 1.5],
  ["plays a vital role", 1.5],
  ["plays a significant role", 1.4],
  ["not only", 0.8],
  ["but also", 0.8],
  ["a wide range of", 1.0],
  ["a variety of", 0.7],
  ["the vast majority", 0.9],
  ["in the realm of", 1.5],
  ["in the landscape of", 1.5],
  ["rich tapestry", 1.7],
  ["ever-evolving", 1.3],
  ["multifaceted", 1.3],
  ["comprehensive", 0.7],
  ["crucial", 0.8],
  ["vital", 0.6],
  ["paramount", 1.1],
  ["optimal", 0.7],
  ["actionable", 1.1],
  ["best practices", 1.0],
  ["synergy", 1.3],
  ["deep dive", 1.2],
  ["double-edged sword", 1.3],
  ["tip of the iceberg", 1.3],
  ["at the end of the day", 1.1],
  ["when it comes to", 0.9],
  ["needless to say", 1.3],
  ["it goes without saying", 1.4],
  ["in order to", 0.7],
  ["due to the fact that", 1.1],
  ["a large number of", 0.9],
  ["in the event that", 1.0],
  ["as an ai language model", 2.0],
  ["i hope this helps", 2.0],
  ["let me know if", 2.0],
];

const SORTED_PHRASES = [...AI_PHRASES].sort((a, b) => b[0].length - a[0].length);

const TRANSITION_RE =
  /\b(?:moreover|furthermore|additionally|consequently|therefore|thus|hence|nevertheless|nonetheless|in conclusion|to sum up|in summary|firstly|secondly|lastly|overall|ultimately|as such|in addition)\b/gi;

const HEDGE_RE =
  /\b(?:arguably|potentially|possibly|presumably|seemingly|apparently|it could be argued|it can be argued|it may be|it might be|to some extent|in some cases|generally speaking|broadly speaking|may suggest|might suggest|could suggest|tends? to|often considered|widely regarded)\b/gi;

const CONTRACTION_RE = /\b(?:it's|don't|doesn't|didn't|can't|won't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|wouldn't|couldn't|shouldn't|you're|we're|they're|I'm|I've|I'll|we've|they've|you've|we'll|they'll|you'll|that's|there's|here's|what's|who's|would've|could've|should've)\b/gi;

const FIRST_PERSON_RE = /\b(?:I|me|my|mine|we|us|our|ours)\b/g;
const SECOND_PERSON_RE = /\b(?:you|your|yours)\b/gi;
const PASSIVE_RE =
  /\b(?:was|were|is|are|been|being)\s+([a-z]+ed|built|made|written|known|shown|given|taken|seen|found|held|led|done|said)\s+by\b/gi;
const NOMINALIZATION_RE =
  /\b\w{5,}(?:tion|tions|ment|ments|ness|nesses|ity|ities|ization|izations|isation|isations)\b/gi;
const COPULA_AVOID_RE = /\b(?:serves? as|stands? as|represents?|constitutes?|boasts?|possesses?)\b/gi;

export function findAiPhrases(text: string): PhraseHit[] {
  const hits: PhraseHit[] = [];
  const lower = text.toLowerCase();
  for (const [phrase, weight] of SORTED_PHRASES) {
    let from = 0;
    while (from < lower.length) {
      const index = lower.indexOf(phrase, from);
      if (index === -1) break;
      const before = lower[index - 1];
      const after = lower[index + phrase.length];
      const leftOk = !before || !/[a-z0-9]/.test(before);
      const rightOk = !after || !/[a-z0-9]/.test(after);
      if (leftOk && rightOk) {
        hits.push({
          term: text.slice(index, index + phrase.length),
          index,
          weight,
          kind: phrase.includes(" ") ? "phrase" : "word",
        });
      }
      from = index + phrase.length;
    }
  }
  return hits;
}

export function aiPhraseDensity(text: string): number {
  const words = Math.max(1, countWords(text));
  const hits = findAiPhrases(text);
  const weight = hits.reduce((sum, hit) => sum + hit.weight, 0);
  return (weight / words) * 100;
}

export interface SentenceLengthStats {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  cv: number;
  stdev: number;
  uniformity: number;
  uniqueLengths: number;
  longSentences: number;
}

export function sentenceLengthStats(text: string): SentenceLengthStats {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const lengths = sentences.map((s) => countWords(s)).filter((n) => n > 0);
  if (lengths.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      cv: 0,
      stdev: 0,
      uniformity: 0,
      uniqueLengths: 0,
      longSentences: 0,
    };
  }
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, n) => sum + (n - mean) ** 2, 0) / lengths.length;
  const stdev = Math.sqrt(variance);
  const sorted = [...lengths].sort((a, b) => a - b);
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1]! + sorted[sorted.length / 2]!) / 2
      : sorted[Math.floor(sorted.length / 2)]!;
  const within = lengths.filter((n) => Math.abs(n - mean) <= 4).length;
  const longSentences = lengths.filter((n) => n >= 26).length;
  return {
    count: lengths.length,
    mean,
    median,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    cv: mean === 0 ? 0 : stdev / mean,
    stdev,
    uniformity: within / lengths.length,
    uniqueLengths: new Set(lengths).size,
    longSentences,
  };
}

export interface DetectorFeatures {
  words: number;
  sentences: number;
  paragraphs: number;
  sentenceStats: SentenceLengthStats;
  paragraphCv: number;
  aiPhraseDensity: number;
  aiPhraseHits: PhraseHit[];
  transitionDensity: number;
  hedgeDensity: number;
  contractionRate: number;
  firstPersonRate: number;
  secondPersonRate: number;
  emDashDensity: number;
  semicolonDensity: number;
  colonDensity: number;
  passiveCount: number;
  nominalizationDensity: number;
  copulaAvoidance: number;
  repetition: number;
  openerRepetition: number;
  typeTokenRatio: number;
  longWordRate: number;
  chatbotArtifacts: number;
  markdownArtifacts: number;
  readability: number;
}

function countMatches(text: string, re: RegExp): number {
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

function repetitionRatio(text: string): number {
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  if (words.length < 12) return 0;
  const trigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 2; i++) {
    const key = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    trigrams.set(key, (trigrams.get(key) ?? 0) + 1);
  }
  let repeats = 0;
  for (const value of trigrams.values()) if (value > 1) repeats += value - 1;
  return repeats / Math.max(1, words.length - 2);
}

function openerRepetition(text: string): number {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().toLowerCase().split(/\s+/)[0]?.replace(/[^a-z']/g, ""))
    .filter(Boolean) as string[];
  if (sentences.length < 5) return 0;
  const counts = new Map<string, number>();
  for (const word of sentences) counts.set(word, (counts.get(word) ?? 0) + 1);
  const max = Math.max(...counts.values());
  return (max - 1) / (sentences.length - 1);
}

function syllableCount(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length <= 3) return 1;
  const groups = cleaned
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return groups ? Math.max(1, groups.length) : 1;
}

export function readability(text: string): number {
  const sentences = Math.max(1, (text.match(/[.!?]+/g) ?? []).length);
  const words = text.match(/[\p{L}\p{N}']+/gu) ?? [];
  if (words.length === 0) return 0;
  const syllables = words.reduce((sum, word) => sum + syllableCount(word), 0);
  return 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
}

export function extractFeatures(text: string): DetectorFeatures {
  const words = countWords(text);
  const safeWords = Math.max(1, words);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const paragraphLengths = paragraphs.map((p) => countWords(p));
  const paragraphMean =
    paragraphLengths.length > 0
      ? paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length
      : 0;
  const paragraphVariance =
    paragraphLengths.length > 1
      ? paragraphLengths.reduce((sum, n) => sum + (n - paragraphMean) ** 2, 0) /
        paragraphLengths.length
      : 0;
  const paragraphCv = paragraphMean > 0 ? Math.sqrt(paragraphVariance) / paragraphMean : 0;
  const sentenceStats = sentenceLengthStats(text);
  const hits = findAiPhrases(text);
  const weight = hits.reduce((sum, hit) => sum + hit.weight, 0);
  const lower = text.toLowerCase();
  const wordTokens = lower.match(/[\p{L}\p{N}']+/gu) ?? [];
  const unique = new Set(wordTokens);
  const longWords = wordTokens.filter((w) => w.length >= 8).length;

  return {
    words,
    sentences: sentenceStats.count,
    paragraphs: paragraphs.length,
    sentenceStats,
    paragraphCv,
    aiPhraseDensity: (weight / safeWords) * 100,
    aiPhraseHits: hits,
    transitionDensity: (countMatches(text, TRANSITION_RE) / safeWords) * 100,
    hedgeDensity: (countMatches(text, HEDGE_RE) / safeWords) * 100,
    contractionRate: (countMatches(text, CONTRACTION_RE) / safeWords) * 100,
    firstPersonRate: (countMatches(text, FIRST_PERSON_RE) / safeWords) * 100,
    secondPersonRate: (countMatches(text, SECOND_PERSON_RE) / safeWords) * 100,
    emDashDensity: ((text.match(/[—–]/g) ?? []).length / safeWords) * 100,
    semicolonDensity: ((text.match(/;/g) ?? []).length / safeWords) * 100,
    colonDensity: ((text.match(/:/g) ?? []).length / safeWords) * 100,
    passiveCount: countMatches(text, PASSIVE_RE),
    nominalizationDensity: (countMatches(text, NOMINALIZATION_RE) / safeWords) * 100,
    copulaAvoidance: countMatches(text, COPULA_AVOID_RE),
    repetition: repetitionRatio(text),
    openerRepetition: openerRepetition(text),
    typeTokenRatio: unique.size / safeWords,
    longWordRate: longWords / safeWords,
    chatbotArtifacts: countMatches(
      text,
      /\b(?:as an ai|i hope this helps|let me know|great question|certainly!|of course!|here is an overview)\b/gi,
    ),
    markdownArtifacts: countMatches(text, /(?:\*\*|^#{1,6}\s+|^[-*]\s+\*\*)/gm),
    readability: readability(text),
  };
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
