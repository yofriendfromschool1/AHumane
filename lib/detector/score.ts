import {
  clamp01,
  extractFeatures,
  round,
  type DetectorFeatures,
} from "./features";

export interface DetectionSignal {
  key: string;
  label: string;
  value: number;
  contribution: number;
  detail: string;
}

export interface SentenceDetection {
  text: string;
  index: number;
  score: number;
  reasons: string[];
}

export interface DetectionResult {
  score: number;
  humanScore: number;
  verdict:
    | "Very likely human"
    | "Likely human"
    | "Uncertain"
    | "Likely AI"
    | "Very likely AI";
  confidence: "low" | "medium" | "high";
  wordCount: number;
  sentenceCount: number;
  signals: DetectionSignal[];
  sentences: SentenceDetection[];
  topPhrases: string[];
  readability: number;
  limitations: string[];
}

interface WeightedFeature {
  key: string;
  label: string;
  weight: number;
  score: (f: DetectorFeatures) => number;
  detail: (f: DetectorFeatures) => string;
}

const FEATURES: WeightedFeature[] = [
  {
    key: "burstiness",
    label: "Sentence rhythm",
    weight: 0.14,
    score: (f) => {
      if (f.sentences < 4) return 0.45;
      return clamp01((0.55 - f.sentenceStats.cv) / 0.4);
    },
    detail: (f) =>
      `Sentence length varies by ${round(f.sentenceStats.cv * 100, 0)}% (CV). Human writing usually varies more.`,
  },
  {
    key: "uniformity",
    label: "Length uniformity",
    weight: 0.08,
    score: (f) => (f.sentences < 5 ? 0.4 : clamp01((f.sentenceStats.uniformity - 0.4) / 0.5)),
    detail: (f) =>
      `${Math.round(f.sentenceStats.uniformity * 100)}% of sentences sit within four words of the average length.`,
  },
  {
    key: "aiPhrases",
    label: "AI vocabulary",
    weight: 0.19,
    score: (f) => clamp01(f.aiPhraseDensity / 2),
    detail: (f) => {
      const terms = Array.from(new Set(f.aiPhraseHits.map((h) => h.term.toLowerCase()))).slice(0, 5);
      return terms.length
        ? `AI-favoured phrasing: ${terms.join(", ")}.`
        : "No strong AI-favoured phrases were found.";
    },
  },
  {
    key: "transitions",
    label: "Transition density",
    weight: 0.07,
    score: (f) => clamp01((f.transitionDensity - 0.15) / 1.1),
    detail: (f) =>
      `${round(f.transitionDensity, 1)} formal transitions per 100 words (moreover, furthermore, thus…).`,
  },
  {
    key: "hedging",
    label: "Hedging",
    weight: 0.05,
    score: (f) => clamp01((f.hedgeDensity - 0.3) / 2.2),
    detail: (f) => `${round(f.hedgeDensity, 1)} hedges per 100 words.`,
  },
  {
    key: "contractions",
    label: "Contractions",
    weight: 0.03,
    score: (f) => (f.words > 120 ? clamp01((0.7 - f.contractionRate) / 0.7) : 0.3),
    detail: (f) =>
      `${round(f.contractionRate, 1)} contractions per 100 words. Natural writing often uses a few.`,
  },
  {
    key: "voice",
    label: "Personal voice",
    weight: 0.02,
    score: (f) => clamp01((0.8 - f.firstPersonRate - f.secondPersonRate) / 0.8),
    detail: (f) =>
      `${round(f.firstPersonRate + f.secondPersonRate, 1)} first/second-person markers per 100 words.`,
  },
  {
    key: "punctuation",
    label: "Punctuation habits",
    weight: 0.04,
    score: (f) =>
      clamp01((f.emDashDensity + f.semicolonDensity * 0.7 + f.colonDensity * 0.4) / 1.2),
    detail: (f) =>
      `${round(f.emDashDensity, 1)} dashes, ${round(f.semicolonDensity, 1)} semicolons and ${round(f.colonDensity, 1)} colons per 100 words.`,
  },
  {
    key: "passive",
    label: "Passive constructions",
    weight: 0.04,
    score: (f) => clamp01((f.passiveCount / Math.max(1, f.words)) * 100 / 2),
    detail: (f) => `${f.passiveCount} passive “was … by” constructions.`,
  },
  {
    key: "nominalization",
    label: "Nominalisations",
    weight: 0.05,
    score: (f) => clamp01((f.nominalizationDensity - 1.2) / 3.5),
    detail: (f) =>
      `${round(f.nominalizationDensity, 1)} abstract nouns ending in -tion/-ment/-ity per 100 words.`,
  },
  {
    key: "copula",
    label: "Indirect verbs",
    weight: 0.04,
    score: (f) => clamp01(f.copulaAvoidance / 3),
    detail: (f) =>
      `${f.copulaAvoidance} “serves as” / “stands as” / “represents” constructions instead of “is”.`,
  },
  {
    key: "repetition",
    label: "Repeated phrasing",
    weight: 0.05,
    score: (f) => clamp01(f.repetition * 12),
    detail: (f) => `${round(f.repetition * 100, 1)}% of three-word runs repeat.`,
  },
  {
    key: "openers",
    label: "Repeated openers",
    weight: 0.04,
    score: (f) => clamp01(f.openerRepetition * 1.4),
    detail: (f) =>
      `The most common sentence opener accounts for ${Math.round(f.openerRepetition * 100)}% of opener repeats.`,
  },
  {
    key: "length",
    label: "Long sentences",
    weight: 0.03,
    score: (f) =>
      clamp01((f.sentenceStats.mean - 22) / 14) * 0.7 +
      clamp01(f.sentenceStats.longSentences / Math.max(1, f.sentences)) * 0.3,
    detail: (f) =>
      `Average sentence length is ${round(f.sentenceStats.mean, 1)} words; ${f.sentenceStats.longSentences} sentences run 26+ words.`,
  },
  {
    key: "paragraphs",
    label: "Paragraph symmetry",
    weight: 0.03,
    score: (f) =>
      f.words > 150 ? clamp01((0.45 - f.paragraphCv) / 0.45) : 0.4,
    detail: (f) =>
      `Paragraph lengths vary by ${round(f.paragraphCv * 100, 0)}% (CV).`,
  },
  {
    key: "chatbot",
    label: "Assistant artifacts",
    weight: 0.08,
    score: (f) => clamp01(f.chatbotArtifacts),
    detail: (f) =>
      f.chatbotArtifacts > 0
        ? `${f.chatbotArtifacts} chatbot-style phrases (e.g. “I hope this helps”).`
        : "No obvious chatbot artifacts.",
  },
  {
    key: "markdown",
    label: "Formatting artifacts",
    weight: 0.02,
    score: (f) => clamp01(f.markdownArtifacts * 0.35),
    detail: (f) =>
      f.markdownArtifacts > 0
        ? `${f.markdownArtifacts} bold headings or bold list items.`
        : "No mechanical bold/list formatting.",
  },
];

const VERDICTS: Array<[number, DetectionResult["verdict"]]> = [
  [20, "Very likely human"],
  [40, "Likely human"],
  [62, "Uncertain"],
  [82, "Likely AI"],
  [101, "Very likely AI"],
];

function verdictFor(score: number): DetectionResult["verdict"] {
  for (const [max, verdict] of VERDICTS) if (score < max) return verdict;
  return "Very likely AI";
}

function confidenceFor(words: number, score: number): DetectionResult["confidence"] {
  if (words < 80) return "low";
  if (words < 220 || (score > 40 && score < 62)) return "medium";
  return "high";
}

function logistic(weighted: number): number {
  return 100 / (1 + Math.exp(-9 * (weighted - 0.47)));
}

function sentenceReasons(
  sentence: string,
  score: number,
  features: DetectorFeatures,
  index: number,
): string[] {
  const reasons: string[] = [];
  const local = extractFeatures(sentence);
  if (local.aiPhraseHits.length) {
    const terms = Array.from(new Set(local.aiPhraseHits.map((h) => h.term))).slice(0, 3);
    reasons.push(`AI-favoured wording: ${terms.join(", ")}`);
  }
  if (features.sentences >= 4) {
    const words = sentence.split(/\s+/).length;
    const mean = features.sentenceStats.mean;
    if (words > mean * 1.55) reasons.push("Much longer than the document average");
    if (features.sentenceStats.uniformity > 0.55) reasons.push("Fits a uniform sentence-length pattern");
  }
  if (score > 65 && local.contractionRate === 0 && features.words > 120) {
    reasons.push("No contractions in a long passage");
  }
  if (score > 70 && index % 3 === 0 && features.openerRepetition > 0.2) {
    reasons.push("Repeats a common sentence opener");
  }
  if (!reasons.length && score > 60) reasons.push("Reads as polished but statistically predictable");
  return reasons.slice(0, 3);
}

export function detect(text: string): DetectionResult {
  const cleaned = text.trim();
  if (!cleaned) {
    return {
      score: 0,
      humanScore: 100,
      verdict: "Very likely human",
      confidence: "low",
      wordCount: 0,
      sentenceCount: 0,
      signals: [],
      sentences: [],
      topPhrases: [],
      readability: 0,
      limitations: ["Paste some text to scan."],
    };
  }

  const features = extractFeatures(cleaned);
  const signals: DetectionSignal[] = [];
  let weighted = 0;

  for (const feature of FEATURES) {
    const value = feature.score(features);
    weighted += value * feature.weight;
    signals.push({
      key: feature.key,
      label: feature.label,
      value: round(value, 3),
      contribution: round(value * feature.weight * 100, 1),
      detail: feature.detail(features),
    });
  }

  // Short samples are noisy: pull toward the middle, but don't erase a
  // strong lexical signal just because the draft is only a few paragraphs.
  let score = logistic(weighted);
  if (features.words < 220) {
    score = score * 0.82 + 35 * 0.18;
    if (features.aiPhraseDensity >= 4) {
      score = Math.max(score, 55 + Math.min(12, features.aiPhraseDensity * 1.5));
    }
  }
  if (features.words < 80) score = score * 0.8 + 35 * 0.2;
  if (features.chatbotArtifacts > 0) score = Math.max(score, 78);
  score = Math.max(0, Math.min(100, score));
  const roundedScore = Math.round(score);

  const sentenceTexts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 250);

  const sentences: SentenceDetection[] = sentenceTexts.map((sentence, index) => {
    const local = extractFeatures(sentence);
    const length = sentence.split(/\s+/).length;
    let localScore = 0;
    localScore += clamp01(local.aiPhraseDensity / 2.2) * 0.4;
    localScore += clamp01((local.transitionDensity + local.hedgeDensity) / 2) * 0.12;
    localScore += clamp01((local.emDashDensity + local.semicolonDensity) / 1.5) * 0.08;
    localScore += (local.contractionRate === 0 ? 0.1 : 0) * 0.08;
    if (features.sentences >= 4) {
      const mean = features.sentenceStats.mean;
      localScore += clamp01(Math.abs(length - mean) / Math.max(4, mean)) * 0.08;
    }
    const blended = clamp01(score / 100) * 0.52 + localScore * 0.48;
    const sentenceScore = Math.round(
      Math.max(0, Math.min(100, blended * 100 + (length < 5 ? -12 : 0))),
    );
    return {
      text: sentence,
      index,
      score: sentenceScore,
      reasons: sentenceReasons(sentence, sentenceScore, features, index),
    };
  });

  const ranked = [...signals].sort((a, b) => b.contribution - a.contribution);
  const topPhrases = Array.from(
    new Set(features.aiPhraseHits.map((h) => h.term.toLowerCase())),
  ).slice(0, 8);

  const limitations = [
    "This is a transparent stylistic estimate, not a verdict. No detector — including this one — is definitive.",
    "Short samples (under 80 words) are unreliable. Aim for 150+ words.",
    "Formal, non-native, and highly edited human writing can be misclassified. Use the sentence view as guidance, not proof.",
    "Not affiliated with GPTZero, Turnitin, Originality.ai, Copilot, or any other detector.",
  ];

  return {
    score: roundedScore,
    humanScore: 100 - roundedScore,
    verdict: verdictFor(roundedScore),
    confidence: confidenceFor(features.words, roundedScore),
    wordCount: features.words,
    sentenceCount: sentences.length,
    signals: ranked,
    sentences,
    topPhrases,
    readability: Math.round(features.readability),
    limitations,
  };
}

export function scoreText(text: string): { score: number; humanScore: number } {
  const result = detect(text);
  return { score: result.score, humanScore: result.humanScore };
}

export function summarize(text: string): {
  score: number;
  verdict: string;
  wordCount: number;
} {
  const result = detect(text);
  return { score: result.score, verdict: result.verdict, wordCount: result.wordCount };
}
