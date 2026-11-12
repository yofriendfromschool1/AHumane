import type { HumanizerStyle } from "@/lib/humanizer/types";

const STYLE_INSTRUCTIONS: Record<HumanizerStyle, string> = {
  natural:
    "Warm, varied, conversational. Contractions are welcome. Let some sentences be short and blunt; let others unwind.",
  academic:
    "Formal and precise, but still written by a person. No slang or contractions. Keep real uncertainty, remove empty hedging.",
  professional:
    "Clear, direct workplace prose. No corporate jargon and no motivational-poster endings.",
  casual:
    "Relaxed and direct. Short sentences are fine. Do not overdo slang or filler.",
  concise:
    "Tight and specific. Cut every word that does not earn its place. Prefer concrete verbs and short clauses.",
};

const BANNED = `delve, leverage, utilize, facilitate, foster, underscore, showcase, tapestry, landscape, realm, pivotal, robust, seamless, myriad, plethora, testament, paramount, holistic, transformative, groundbreaking, cutting-edge, game-changing, moreover, furthermore, additionally, consequently, thus, hence, ultimately, in conclusion, it is important to note, it is worth noting, in today's fast-paced, unlock, harness, streamline, proliferation, democratize, significant, crucial, essential, AI-powered, not just, not only, when you think about it, at the end of the day`;

export function buildHumanizerPrompt(
  text: string,
  options: { style: HumanizerStyle; strength: number; language: string },
): { system: string; user: string } {
  const words = text.trim().split(/\s+/).length;
  const depth =
    words < 100
      ? "This is a short draft. Preserve the sentence order and roughly one output sentence per input sentence. Do not merge, cut, or add sentences."
      : options.strength >= 4
        ? "Rewrite deeply. You may restructure sentences and paragraphs, but keep the argument, every fact, and the author's point of view."
        : options.strength === 3
          ? "Rewrite at a moderate depth. Keep the structure recognizable but change the rhythm and vocabulary."
          : "Make a light edit. Preserve most sentences and remove only the clearest AI tells.";

  const system = `You are a human editor, not an AI assistant. Rewrite the draft below so it reads like a specific person wrote it.

Non-negotiable:
- Preserve every name, number, date, statistic, quotation, citation, URL, and technical term exactly.
- Preserve the original language (${options.language}) and roughly the original length.
- Do not add facts, examples, statistics, studies, attributions, experts, opinions, headings, notes, or commentary. Do not answer the text. Every sentence must correspond to something in the original; do not invent a new sentence.
- Return only the rewritten text. No preamble, no markdown fences, no quotation marks around the whole output.
- Never use these words or phrases: ${BANNED}.
- Do not use em dashes, en dashes, or a spaced hyphen as a dash. Use commas, periods, or parentheses.
- Do not use boldface, bullet lists, emojis, or title case unless the original used them.
- Do not introduce typos or grammatical errors.

Craft:
- Vary sentence length sharply. Avoid a metronome.
- Vary paragraph length. A short paragraph is allowed.
- Prefer concrete subjects and plain verbs. Cut nominalizations and empty hedges.
- Do not write a summary conclusion or a "challenges and future" section.
- Do not use "not only X but also Y", forced triads, or balanced "on one hand / on the other hand" filler.
- Let the argument have a voice. A little skepticism, hesitation, or a direct aside is human. Do not invent facts to get it.
- ${depth}

Style: ${STYLE_INSTRUCTIONS[options.style]}`;

  return {
    system,
    user: `Rewrite the following draft. Preserve all facts and quotes.\n\n---\n${text}\n---`,
  };
}

export function buildCritiquePrompt(
  original: string,
  draft: string,
  style: HumanizerStyle,
): { system: string; user: string } {
  return {
    system: `You are a demanding human line editor. The draft below was produced by a language model and still carries an AI cadence: balanced sentences, generic transitions, summary phrasing, and a polite distance from the reader.

Rewrite it once more so it reads like a person with a point of view. Keep every fact from the original. Do not add new facts, examples, statistics, names, or claims. Do not use em dashes, bullet points, headings, or bold. Never use: ${BANNED}.
Vary sentence and paragraph length. Cut any sentence that only announces what the next sentence will do. End on a specific point, not a summary.
Style: ${STYLE_INSTRUCTIONS[style]}
Return only the rewritten text.`,
    user: `ORIGINAL FACTS:\n${original}\n\nDRAFT TO REVISE:\n${draft}`,
  };
}

export function stripModelWrapping(output: string): string {
  let text = output.trim();
  text = text.replace(/^```(?:markdown|text)?\s*/i, "").replace(/\s*```$/i, "").trim();
  text = text.replace(/^(?:Here(?:'s| is) the (?:rewritten|humanized) (?:text|version)[:.]\s*)/i, "");
  text = text.replace(/^["“]([\s\S]*)["”]$/u, "$1").trim();
  // Some reasoning models put a short plan before the answer. If the answer is
  // fenced or clearly separated, keep the last substantial block.
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  if (blocks.length > 2 && /^(?:we need|the user|thinking|analysis|okay|first,)/i.test(blocks[0]!.trim())) {
    text = blocks.slice(1).join("\n\n").trim();
  }
  return text;
}
