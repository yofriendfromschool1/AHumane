import type { HumanizeOptions, HumanizeResult, HumanizerStyle } from "./types";
import { buildCritiquePrompt, buildHumanizerPrompt } from "./prompt";
import {
  detectOvh,
  resolveModel,
  rewriteWithPrompt,
  type ModelInfo,
} from "../llm/provider";
import { normalizeText, normalizeDashes, fixArticles, cleanSpacing } from "./normalize";
import { protectText, findMissingProtected } from "./protect";
import { createRng, hashString } from "../utils/seeded-random";
import { countSentences, countWords } from "../utils/text";
import { removeDuplicateWords, capitalizeSentenceStarts, dedupeDiscourseMarkers } from "./rules";

const RESIDUAL: Array<[RegExp, string]> = [
  [/\bdelve(?:s|d|ing)?\b/gi, "explore"],
  [/\bleverag(?:e|es|ed|ing)\b/gi, "use"],
  [/\butiliz(?:e|es|ed|ing)\b/gi, "use"],
  [/\bfacilitat(?:e|es|ed|ing)\b/gi, "help"],
  [/\bfoster(?:s|ed|ing)?\b/gi, "support"],
  [/\bunderscor(?:e|es|ed|ing)\b/gi, "show"],
  [/\bshowcas(?:e|es|ed|ing)\b/gi, "show"],
  [/\bmyriad\b/gi, "many"],
  [/\bplethora\b/gi, "plenty"],
  [/\brobust\b/gi, "strong"],
  [/\bseamless(?:ly)?\b/gi, "smooth"],
  [/\bpivotal\b/gi, "key"],
  [/\blandscape\b/gi, "field"],
  [/\brealm\b/gi, "area"],
  [/\btestament\b/gi, "proof"],
  [/\bmoreover,\s*/gi, "Also, "],
  [/\bfurthermore,\s*/gi, "Also, "],
  [/\badditionally,\s*/gi, "Also, "],
  [/\bconsequently,\s*/gi, "So "],
  [/\bultimately,\s*/gi, "In the end, "],
  [/\bin conclusion,\s*/gi, ""],
];

function scrubResidual(text: string): string {
  let output = text;
  for (const [pattern, replacement] of RESIDUAL) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

function polish(text: string, style: HumanizerStyle): string {
  let output = normalizeText(text);
  output = output.replace(/\s+-\s+/g, ", ");
  output = normalizeDashes(output, style);
  output = scrubResidual(output);
  output = fixArticles(output);
  output = dedupeDiscourseMarkers(output);
  output = capitalizeSentenceStarts(output);
  output = removeDuplicateWords(output);
  output = cleanSpacing(output);
  return output.trim();
}

function hasFacts(output: string, values: string[]): boolean {
  return values.every((value) => output.includes(value));
}

export async function humanizeWithModel(
  input: string,
  options: HumanizeOptions = {},
): Promise<HumanizeResult> {
  const start = Date.now();
  const style = options.style ?? "natural";
  const mode = options.mode ?? "pro";
  const seed = options.seed ?? hashString(input) % 2147483647;
  const normalized = normalizeText(input);
  const wordsIn = countWords(normalized);

  if (wordsIn < 100) {
    throw new Error(
      "Deep rewrite needs at least 100 words to preserve meaning.",
    );
  }
  if (wordsIn > 2400) {
    throw new Error(
      "Deep rewrite is limited to 2,400 words per run. Switch off Deep rewrite for long drafts.",
    );
  }

  const protectionRng = createRng(0x51ed270b);
  const { tokens } = protectText(normalized, protectionRng, { singleNames: false });
  const protectedValues = tokens.map((token) => token.value);
  const primary = await resolveModel(options.provider, options.model);
  if (!primary) {
    throw new Error("No model provider is reachable. Choose a local model in Settings or start Ollama.");
  }

  const maxTokens = Math.min(4096, Math.max(600, Math.round(wordsIn * 2.4)));
  const pass1Prompt = buildHumanizerPrompt(normalized, {
    style,
    strength: options.strength ?? 4,
    language: options.language ?? "en",
  });

  const pass1 = await rewriteWithPrompt(
    primary,
    pass1Prompt.system,
    pass1Prompt.user,
    maxTokens,
  );
  if (!hasFacts(pass1, protectedValues)) {
    throw new Error("The model dropped a protected fact, so the rewrite was rejected.");
  }

  let chosen = pass1;
  let passes = 1;
  let secondModel = primary.model;

  if (mode === "pro" && primary.kind !== "ollama" && countWords(pass1) >= 50) {
    let secondary: ModelInfo | null = await detectOvh();
    if (secondary && secondary.model === primary.model) {
      // Reuse the same model only when no second model is available.
      secondary = primary;
    }
    if (secondary) secondModel = secondary.model;
    try {
      const critique = buildCritiquePrompt(normalized, pass1, style);
      const pass2 = await rewriteWithPrompt(
        secondary ?? primary,
        critique.system,
        critique.user,
        maxTokens,
      );
      if (hasFacts(pass2, protectedValues) && countWords(pass2) >= wordsIn * 0.45) {
        chosen = pass2;
        passes = 2;
      }
    } catch {
      // A failed second pass is not fatal; pass one is still usable.
    }
  }

  let polished = "";
  let finalPasses = passes;
  const candidates = chosen === pass1 ? [pass1] : [chosen, pass1];
  for (const candidate of candidates) {
    const cleaned = polish(candidate, style);
    if (!hasFacts(cleaned, protectedValues)) continue;
    const candidateWords = countWords(cleaned);
    if (candidateWords < wordsIn * 0.6 || candidateWords > wordsIn * 1.6) continue;
    polished = cleaned;
    finalPasses = candidate === chosen ? passes : 1;
    break;
  }
  if (!polished) {
    throw new Error("The model rewrite changed the length or a protected fact too much, so it was rejected.");
  }
  passes = finalPasses;

  const missing = findMissingProtected(tokens, polished);
  const meaning = {
    protectedTotal: tokens.length,
    protectedKept: tokens.length - missing.length,
    retention: tokens.length === 0 ? 1 : (tokens.length - missing.length) / tokens.length,
    missing,
  };

  return {
    output: polished,
    stats: {
      wordsIn,
      wordsOut: countWords(polished),
      sentencesIn: countSentences(normalized),
      sentencesOut: countSentences(polished),
      passes,
      ms: Date.now() - start,
      changedSentences: 0,
    },
    meaning,
    warnings: [
      `Rewritten by ${primary.label} (${primary.model})${passes > 1 ? `, then revised with ${secondModel}` : ""}.`,
      primary.kind === "ollama"
        ? "This rewrite ran through Ollama. If OLLAMA_BASE_URL points at a remote host, the draft left your machine."
        : primary.kind === "ovh"
          ? "Deep rewrite sends this draft to a free public model endpoint. Use local-only mode for sensitive text."
          : "Deep rewrite sends this draft to your configured model endpoint.",
    ],
    provider: primary.kind,
    changes: [],
    seed,
  };
}
