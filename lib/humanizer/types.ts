export type HumanizerMode = "basic" | "pro";
export type HumanizerStyle =
  | "natural"
  | "academic"
  | "professional"
  | "casual"
  | "concise";

export const STYLE_LABELS: Record<HumanizerStyle, string> = {
  natural: "Natural",
  academic: "Academic",
  professional: "Professional",
  casual: "Casual",
  concise: "Concise",
};

export const STYLE_DESCRIPTIONS: Record<HumanizerStyle, string> = {
  natural: "Warm, varied and conversational without losing the point.",
  academic: "Formal and precise, with light structural cleanup.",
  professional: "Clear and polished for work email, reports and proposals.",
  casual: "Relaxed rhythm, contractions and direct address.",
  concise: "Tighter sentences and fewer filler words.",
};

export interface HumanizeOptions {
  mode?: HumanizerMode;
  style?: HumanizerStyle;
  strength?: number; // 1..5
  language?: string;
  seed?: number;
  useModel?: boolean;
  provider?: "auto" | "ovh" | "ollama" | "openai-compatible";
  model?: string;
}

export interface MeaningReport {
  protectedTotal: number;
  protectedKept: number;
  retention: number;
  missing: string[];
}

export interface HumanizeStats {
  wordsIn: number;
  wordsOut: number;
  sentencesIn: number;
  sentencesOut: number;
  passes: number;
  ms: number;
  changedSentences: number;
}

export interface SentenceChange {
  before: string;
  after: string;
  reasons: string[];
}

export interface HumanizeResult {
  output: string;
  stats: HumanizeStats;
  meaning: MeaningReport;
  warnings: string[];
  provider: "algorithm" | "ollama" | "openai-compatible" | "ovh";
  changes: SentenceChange[];
  seed: number;
}

export interface ProtectedToken {
  token: string;
  value: string;
  kind: string;
}
