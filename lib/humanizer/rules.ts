import type { HumanizerStyle } from "./types";
import type { Rng } from "../utils/seeded-random";
import { capitalizeFirst, lowercaseFirst } from "./normalize";
import { countWords } from "../utils/text";

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bit is\b/gi, "it's"],
  [/\bIt is\b/g, "It's"],
  [/\bthat is\b/gi, "that's"],
  [/\bThat is\b/g, "That's"],
  [/\bthere is\b/gi, "there's"],
  [/\bThere is\b/g, "There's"],
  [/\bwhat is\b/gi, "what's"],
  [/\bwho is\b/gi, "who's"],
  [/\bhere is\b/gi, "here's"],
  [/\bHere is\b/g, "Here's"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdo not\b/gi, "don't"],
  [/\bdid not\b/gi, "didn't"],
  [/\bis not\b/gi, "isn't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"],
  [/\bhas not\b/gi, "hasn't"],
  [/\bhave not\b/gi, "haven't"],
  [/\bhad not\b/gi, "hadn't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"],
  [/\bshould not\b/gi, "shouldn't"],
  [/\bcannot\b/gi, "can't"],
  [/\bcan not\b/gi, "can't"],
  [/\byou are\b/gi, "you're"],
  [/\bYou are\b/g, "You're"],
  [/\bwe are\b/gi, "we're"],
  [/\bWe are\b/g, "We're"],
  [/\bthey are\b/gi, "they're"],
  [/\bThey are\b/g, "They're"],
  [/\bI am\b/g, "I'm"],
  [/\bI have\b/g, "I've"],
  [/\bI will\b/g, "I'll"],
  [/\bwe have\b/gi, "we've"],
  [/\bthey have\b/gi, "they've"],
  [/\byou have\b/gi, "you've"],
  [/\bwe will\b/gi, "we'll"],
  [/\bthey will\b/gi, "they'll"],
  [/\byou will\b/gi, "you'll"],
  [/\bwould have\b/gi, "would've"],
  [/\bcould have\b/gi, "could've"],
  [/\bshould have\b/gi, "should've"],
];

const VOICE_MARKERS: Partial<Record<HumanizerStyle, string[]>> = {
  natural: ["That said, ", "In practice, ", "Honestly, ", "Here's the thing: ", "Still, "],
  casual: ["Honestly, ", "Look, ", "Here's the thing: ", "Okay, so ", "Still, "],
  professional: ["In practice, ", "That said, ", "In most cases, "],
  concise: ["In practice, ", "Still, "],
};

export function applyContractions(
  text: string,
  style: HumanizerStyle,
  strength: number,
  rng: Rng,
): string {
  if (style === "academic") return text;
  const base = style === "casual" ? 0.55 : style === "professional" ? 0.2 : 0.32;
  const probability = Math.min(0.8, base + strength * 0.03);
  let output = text;
  for (const [pattern, replacement] of CONTRACTIONS) {
    output = output.replace(pattern, (match) => (rng.chance(probability) ? replacement : match));
  }
  return output;
}

export function applyPassiveToActive(
  text: string,
  strengths: number,
  rng: Rng,
): string {
  if (strengths < 3) return text;
  return text.replace(
    /\b([A-Z][\w'-]*(?:\s+[A-Za-z][\w'-]*){0,2}) (was|were) ([a-z]+ed) by ([A-Z][\w'-]*(?:\s+[A-Za-z][\w'-]*){0,2})\b/g,
    (match, subject: string, _aux: string, verb: string, agent: string) => {
      if (!rng.chance(0.45)) return match;
      if (/\b(?:need|embed|exceed|proceed|succeed)\b/i.test(verb)) return match;
      return `${agent} ${verb} ${lowercaseFirst(subject)}`;
    },
  );
}

export function restoreSimpleSubjects(text: string): string {
  let output = text;
  output = output.replace(/\bThere (?:is|are) (?:a |an |the )?([^.,;!?]{3,70}) that\b/gi, "$1 that");
  return output;
}

export function splitLongSentences(
  sentences: string[],
  style: HumanizerStyle,
  rng: Rng,
): string[] {
  const result: string[] = [];
  for (const sentence of sentences) {
    const words = countWords(sentence);
    let parts = [sentence];

    if (words > 26) {
      const next: string[] = [];
      for (const part of parts) {
        if (rng.chance(style === "academic" ? 0.25 : 0.7)) {
          const semicolon = part.replace(/;\s+/g, (m, offset: number) => {
            const head = part.slice(0, offset);
            return head.trim().length > 12 ? ". " : m;
          });
          if (semicolon !== part) {
            // Re-capitalise after each inserted full stop.
            const pieces = semicolon
              .split(/(?<=[.!?])\s+/)
              .map((p) => capitalizeFirst(p.trim()));
            next.push(...pieces);
            continue;
          }
        }
        next.push(part);
      }
      parts = next;
    }

    const expanded: string[] = [];
    for (const part of parts) {
      const pronounSplit = part.match(/^([\s\S]{18,}?), and (it|they|this|that|these|those|we|you|he|she|there)\b([\s\S]*)$/i);
      if (pronounSplit && countWords(part) > 22 && rng.chance(0.65)) {
        expanded.push(capitalizeFirst(pronounSplit[1].trim()) + ".");
        expanded.push(capitalizeFirst(`${pronounSplit[2]}${pronounSplit[3]}`.trim()));
        continue;
      }
      const butSplit = part.match(/^([\s\S]{16,}?), but\s+([\s\S]{6,})$/i);
      if (butSplit && countWords(part) > 24 && rng.chance(0.55)) {
        expanded.push(capitalizeFirst(butSplit[1].trim()) + ".");
        expanded.push("But " + lowercaseFirst(butSplit[2].trim()));
        continue;
      }
      const soSplit = part.match(/^([\s\S]{16,}?), so\s+([\s\S]{6,})$/i);
      if (soSplit && countWords(part) > 24 && rng.chance(0.45)) {
        expanded.push(capitalizeFirst(soSplit[1].trim()) + ".");
        expanded.push("So " + lowercaseFirst(soSplit[2].trim()));
        continue;
      }
      expanded.push(part);
    }
    result.push(...expanded);
  }
  return result;
}

export function mergeShortSentences(sentences: string[], rng: Rng): string[] {
  if (sentences.length < 3) return sentences;
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    const current = sentences[i]!;
    const next = sentences[i + 1];
    if (
      next &&
      countWords(current) < 9 &&
      countWords(next) < 14 &&
      /^[A-Z][\w'’-]*\b/.test(next) &&
      /^(?:It|This|That|They|He|She|We|You)\b/.test(next) &&
      rng.chance(0.2) &&
      !/[;:]$/.test(current)
    ) {
      result.push(
        `${current.replace(/[.!?]\s*$/, "")}, and ${lowercaseFirst(next)}`,
      );
      i++;
      continue;
    }
    result.push(current);
  }
  return result;
}

export function varyOpeners(
  sentences: string[],
  style: HumanizerStyle,
  rng: Rng,
): string[] {
  const result = sentences.map((s) => s.trim());
  const firstWords: string[] = [];

  for (let i = 0; i < result.length; i++) {
    const sentence = result[i]!;
    const first = sentence.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z']/g, "") ?? "";
    const repeats = firstWords.slice(-2).filter((w) => w === first).length;
    firstWords.push(first);

    if (repeats >= 1 && /^These [a-z]+ /.test(sentence)) {
      result[i] = "They " + sentence.replace(/^These [a-z]+ /i, "");
      continue;
    }
    if (repeats >= 2 && /^(This|That|It|The|These|Those) /.test(sentence)) {
      if (first === "this") {
        result[i] = "That " + sentence.slice(5);
        continue;
      }
      if (first === "it" && rng.chance(0.5)) {
        result[i] = "This " + sentence.slice(3);
        continue;
      }
      if (rng.chance(0.45)) {
        const markers = VOICE_MARKERS[style];
        if (markers && markers.length) {
          result[i] = rng.pick(markers) + lowercaseFirst(sentence);
        }
      }
    }
  }
  return result;
}

export function injectVoice(
  sentences: string[],
  style: HumanizerStyle,
  strength: number,
  rng: Rng,
  maxMarkers: number,
): string[] {
  const markers = VOICE_MARKERS[style] ?? [];
  if (!markers.length) return sentences;

  const result = sentences.map((s) => s.trim());
  let added = 0;
  const target = Math.min(maxMarkers, Math.floor(sentences.length / 4));
  if (target <= 0) return result;

  for (let i = 1; i < result.length && added < target; i++) {
    const sentence = result[i]!;
    if (!/^[A-Z][a-z]/.test(sentence)) continue;
    if (/^(?:And|But|So|Also|Plus|Still|That said|In practice|Honestly|Look|Okay)\b/.test(sentence)) continue;
    if (sentence.length < 35) continue;
    if (!rng.chance(0.28)) continue;
    result[i] = rng.pick(markers) + lowercaseFirst(sentence);
    added++;
  }
  return result;
}

export function polishPunctuation(text: string, style: HumanizerStyle): string {
  let output = text;
  output = output.replace(/,\s*,/g, ",");
  output = output.replace(/\.\s*,/g, ".");
  output = output.replace(/,\s*\./g, ".");
  output = output.replace(/\s+([,.;:!?])/g, "$1");
  output = output.replace(/([,;:!?])(?=[\p{L}\p{N}])/gu, "$1 ");
  output = output.replace(/([.!?]){2,}/g, "$1");
  output = output.replace(/\(\s+/g, "(");
  output = output.replace(/\s+\)/g, ")");
  output = output.replace(/"\s+([,.;:!?])/g, '"$1');
  output = output.replace(/\s{2,}/g, " ");
  if (style !== "academic" && style !== "professional") {
    output = output.replace(/\s*;\s*/g, ". ");
  }
  return output;
}

export function splitIntoParagraphs(
  paragraphs: string[],
  rng: Rng,
): string[] {
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    const sentenceCount = (paragraph.match(/[.!?](?:\s|$)/g) ?? []).length;
    if (sentenceCount >= 6 && rng.chance(0.6)) {
      const parts = paragraph.split(/(?<=[.!?])\s+/);
      const cut = Math.max(2, Math.floor(parts.length * (0.45 + rng.next() * 0.2)));
      const first = parts.slice(0, cut).join(" ");
      const second = parts.slice(cut).join(" ");
      if (countWords(first) > 20 && countWords(second) > 20) {
        result.push(first, second);
        continue;
      }
    }
    result.push(paragraph);
  }
  return result;
}

export function mergeShortParagraphs(paragraphs: string[]): string[] {
  if (paragraphs.length < 2) return paragraphs;
  const result: string[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const current = paragraphs[i]!;
    const next = paragraphs[i + 1];
    if (
      next &&
      countWords(current) < 24 &&
      !/[.!?]\s+[A-Z]/.test(current) &&
      countWords(next) < 90
    ) {
      result.push(`${current.replace(/[.!?]\s*$/, "")}. ${next}`);
      i++;
      continue;
    }
    result.push(current);
  }
  return result;
}

export function removeDuplicateWords(text: string): string {
  // Only collapse accidental function-word doubles. "had had" and "that that"
  // can be grammatical, so they are left alone.
  return text.replace(
    /\b(the|a|an|and|or|of|to|in|on|at|is|are|was|were|for|with|as|by|be|has|have)\s+\1\b/gi,
    "$1",
  );
}

export function capitalizeSentenceStarts(text: string): string {
  return text.replace(
    /(^|[.!?]\s+|\n)(["'“‘(\[]*)(\p{Ll})/gu,
    (_match, prefix: string, quotes: string, letter: string) =>
      prefix + quotes + letter.toUpperCase(),
  );
}

const DISCOURSE = /^(That said|In practice|Honestly|Still|In the end|So|But|Also|Plus|However|Look|Okay, so)[,:\s]+/i;

export function dedupeDiscourseMarkers(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let previous = "";
  return sentences
    .map((sentence) => {
      const match = sentence.match(DISCOURSE);
      const marker = match ? match[1]!.toLowerCase() : "";
      if (marker && marker === previous) {
        return sentence.replace(DISCOURSE, "");
      }
      previous = marker || previous;
      return sentence;
    })
    .join(" ");
}
