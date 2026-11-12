import type {
  HumanizeOptions,
  HumanizeResult,
  HumanizerStyle,
  SentenceChange,
} from "./types";
import { normalizeText, normalizeDashes, cleanSpacing, compressWordyPhrases, fixArticles } from "./normalize";
import { protectText, restoreText, findMissingProtected } from "./protect";
import { splitParagraphs, splitSentences } from "./segment";
import { applyLexicon } from "./lexicon";
import {
  applyContractions,
  applyPassiveToActive,
  capitalizeSentenceStarts,
  dedupeDiscourseMarkers,
  injectVoice,
  mergeShortParagraphs,
  mergeShortSentences,
  polishPunctuation,
  removeDuplicateWords,
  splitIntoParagraphs,
  splitLongSentences,
  varyOpeners,
} from "./rules";
import { countSentences, countWords } from "../utils/text";
import { createRng, hashString } from "../utils/seeded-random";
import { scoreText } from "../detector/score";
import { aiPhraseDensity, sentenceLengthStats } from "../detector/features";

const DEFAULT_STYLE: HumanizerStyle = "natural";

function humanizeOnce(
  input: string,
  style: HumanizerStyle,
  strength: number,
  seed: number,
): { text: string; changes: SentenceChange[]; warnings: string[] } {
  const rng = createRng(seed);
  const protectionRng = createRng(0x51ed270b);
  let normalized = normalizeText(input);
  normalized = normalizeDashes(normalized, style);
  normalized = compressWordyPhrases(normalized);
  const protectedResult = protectText(normalized, protectionRng);
  const tokens = protectedResult.tokens;

  const paragraphs = splitParagraphs(protectedResult.text);
  const warnings: string[] = [];
  const processedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    const rawSentences = splitSentences(paragraph);
    const processedSentences: string[] = [];

    for (const rawSentence of rawSentences) {
      const sentenceTokens = tokens.filter((t) => rawSentence.includes(t.token));
      let current = rawSentence;

      const lexed = applyLexicon(current, style, strength, rng);
      current = lexed.text;
      current = applyContractions(current, style, strength, rng);
      current = applyPassiveToActive(current, strength, rng);
    
      let sentences = splitLongSentences([current], style, rng);
      sentences = mergeShortSentences(sentences, rng);
      sentences = varyOpeners(sentences, style, rng);
      const maxMarkers = Math.max(1, Math.floor(rawSentences.length / 6));
      sentences = injectVoice(sentences, style, strength, rng, maxMarkers);

      const polishedParts: string[] = [];
      for (const sentence of sentences) {
        let polished = polishPunctuation(sentence, style);
        polished = removeDuplicateWords(polished);
        polishedParts.push(polished);
      }
      const combined = polishedParts.join(" ");
      const missing = sentenceTokens.filter((t) => !combined.includes(t.token));
      if (missing.length > 0) {
        warnings.push("Reverted a sentence because a protected fact was at risk.");
        processedSentences.push(rawSentence);
      } else {
        processedSentences.push(...polishedParts);
      }
    }

    processedParagraphs.push(processedSentences.join(" ").trim());
  }

  let joined = processedParagraphs.filter(Boolean).join("\n\n");
  let resultParagraphs = splitParagraphs(joined);
  resultParagraphs = splitIntoParagraphs(resultParagraphs, rng);
  resultParagraphs = mergeShortParagraphs(resultParagraphs);
  joined = resultParagraphs.join("\n\n");

  let output = restoreText(joined, tokens);
  output = dedupeDiscourseMarkers(output);
  output = capitalizeSentenceStarts(output);
  output = fixArticles(output);
  output = cleanSpacing(output);
  output = removeDuplicateWords(output);
  output = output
    .replace(/\uE000|\uE001/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const missing = findMissingProtected(tokens, output);
  if (missing.length > 0) {
    warnings.push(
      `The rewrite would have changed ${missing.length} protected fact${missing.length === 1 ? "" : "s"}, so the original text was kept.`,
    );
    return { text: normalized, changes: [], warnings };
  }

  return {
    text: output,
    changes: buildChanges(normalized, output),
    warnings: dedupe(warnings),
  };
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items));
}

function sentenceTokens(input: string): Set<string> {
  const words = input.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
  return new Set(words);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const word of a) if (b.has(word)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

function buildChanges(before: string, after: string): SentenceChange[] {
  const beforeSentences = splitSentences(before);
  const afterSentences = splitSentences(after);
  if (beforeSentences.length === 0) return [];

  const changes: SentenceChange[] = [];
  const used = new Set<number>();
  for (const outputSentence of afterSentences) {
    const outputTokens = sentenceTokens(outputSentence);
    let bestIndex = -1;
    let bestScore = 0;
    for (let i = 0; i < beforeSentences.length; i++) {
      if (used.has(i)) continue;
      const score = jaccard(outputTokens, sentenceTokens(beforeSentences[i]!));
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    if (bestIndex >= 0 && bestScore >= 0.45 && bestScore < 0.98) {
      used.add(bestIndex);
      const beforeSentence = beforeSentences[bestIndex]!;
      changes.push({
        before: beforeSentence,
        after: outputSentence,
        reasons: describeChange(beforeSentence, outputSentence),
      });
    }
    if (changes.length >= 40) break;
  }
  return changes;
}

function describeChange(before: string, after: string): string[] {
  const reasons: string[] = [];
  if (countWords(after) < countWords(before) * 0.8) reasons.push("Tightened wording");
  if (countWords(after) > countWords(before) * 1.2) reasons.push("Split a long sentence");
  if (/\b(?:Moreover|Furthermore|Additionally|Thus|Hence),/.test(before) && !/\b(?:Moreover|Furthermore|Additionally|Thus|Hence),/.test(after)) {
    reasons.push("Removed a formal transition");
  }
  if (/\b(?:delve|leverage|utilize|tapestry|landscape|pivotal|seamless|robust|foster|underscore|showcase)\b/i.test(before) && !/\b(?:delve|leverage|utilize|tapestry|landscape|pivotal|seamless|robust|foster|underscore|showcase)\b/i.test(after)) {
    reasons.push("Replaced AI-style vocabulary");
  }
  if (/\b(?:it's|don't|doesn't|can't|won't|that's)\b/i.test(after) && !/\b(?:it's|don't|doesn't|can't|won't|that's)\b/i.test(before)) {
    reasons.push("Added a natural contraction");
  }
  if (!reasons.length) reasons.push("Adjusted rhythm and phrasing");
  return reasons.slice(0, 3);
}

function qualityScore(text: string): number {
  const stats = sentenceLengthStats(text);
  const phrase = aiPhraseDensity(text);
  const burstiness = Math.min(stats.cv / 0.6, 1) * 40;
  const variety = Math.min(stats.uniqueLengths / 7, 1) * 20;
  const clean = Math.max(0, 40 - phrase * 8);
  return burstiness + variety + clean;
}

export function humanize(input: string, options: HumanizeOptions = {}): HumanizeResult {
  const start = Date.now();
  const style = options.style ?? DEFAULT_STYLE;
  const strength = Math.min(5, Math.max(1, options.strength ?? 3));
  const mode = options.mode ?? "basic";
  const baseSeed = options.seed ?? hashString(input) % 2147483647;

  if (!input.trim()) {
    return {
      output: "",
      stats: {
        wordsIn: 0,
        wordsOut: 0,
        sentencesIn: 0,
        sentencesOut: 0,
        passes: 0,
        ms: 0,
        changedSentences: 0,
      },
      meaning: { protectedTotal: 0, protectedKept: 0, retention: 1, missing: [] },
      warnings: ["There was no text to humanize."],
      provider: "algorithm",
      changes: [],
      seed: baseSeed,
    };
  }

  const first = humanizeOnce(input, style, strength, baseSeed);
  let best = first;
  let passes = 1;

  if (mode === "pro") {
    const candidates = [first];
    const additional = countWords(input) > 4500 ? 1 : 2;
    for (let i = 1; i <= additional; i++) {
      const candidate = humanizeOnce(
        input,
        style,
        Math.min(5, strength + (i % 2)),
        baseSeed + i * 7919,
      );
      candidates.push(candidate);
      passes++;
    }
    let bestQuality = qualityScore(best.text);
    for (const candidate of candidates) {
      const q = qualityScore(candidate.text);
      const detector = scoreText(candidate.text).score;
      const currentDetector = scoreText(best.text).score;
      if (q > bestQuality && detector <= currentDetector + 6) {
        best = candidate;
        bestQuality = q;
      }
    }
  }

  const tokens = protectText(normalizeText(input), createRng(0x51ed270b)).tokens;
  const missing = findMissingProtected(tokens, best.text);
  const meaning = {
    protectedTotal: tokens.length,
    protectedKept: tokens.length - missing.length,
    retention: tokens.length === 0 ? 1 : (tokens.length - missing.length) / tokens.length,
    missing,
  };

  if (best.text && countWords(best.text) < countWords(input) * 0.65) {
    best.warnings.push(
      "This rewrite is much shorter than the original. Review it for lost nuance before using it.",
    );
  }

  return {
    output: best.text,
    stats: {
      wordsIn: countWords(input),
      wordsOut: countWords(best.text),
      sentencesIn: countSentences(input),
      sentencesOut: countSentences(best.text),
      passes,
      ms: Date.now() - start,
      changedSentences: best.changes.length,
    },
    meaning,
    warnings: best.warnings,
    provider: "algorithm",
    changes: best.changes,
    seed: baseSeed,
  };
}
