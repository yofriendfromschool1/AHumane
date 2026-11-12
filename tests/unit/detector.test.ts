import { describe, expect, it } from "vitest";
import { detect } from "@/lib/detector/score";
import { AI_SAMPLES, HUMAN_SAMPLES, MIXED_SAMPLE } from "../fixtures/samples";

describe("detect", () => {
  it("returns an empty-state result for empty text", () => {
    const result = detect("");
    expect(result.score).toBe(0);
    expect(result.sentences).toHaveLength(0);
  });

  it("separates the AI fixtures from the human fixtures", () => {
    const aiScores = AI_SAMPLES.map((sample) => detect(sample).score);
    const humanScores = HUMAN_SAMPLES.map((sample) => detect(sample).score);
    const aiMean = aiScores.reduce((a, b) => a + b, 0) / aiScores.length;
    const humanMean = humanScores.reduce((a, b) => a + b, 0) / humanScores.length;
    expect(aiMean).toBeGreaterThan(60);
    expect(humanMean).toBeLessThan(40);
    expect(aiMean - humanMean).toBeGreaterThan(35);
  });

  it("is conservative on short text", () => {
    const result = detect("This is a short sentence about a cat.");
    expect(result.confidence).toBe("low");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("flags chatbot artifacts", () => {
    const result = detect(
      "As an AI language model, I hope this helps. Let me know if you'd like me to expand on any section.",
    );
    expect(result.score).toBeGreaterThan(70);
  });

  it("provides sentence-level results and reasons", () => {
    const result = detect(AI_SAMPLES[1]!);
    expect(result.sentences.length).toBeGreaterThan(2);
    expect(result.sentences.some((sentence) => sentence.reasons.length > 0)).toBe(true);
  });

  it("keeps mixed writing in the middle or lower bands", () => {
    const result = detect(MIXED_SAMPLE);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(90);
  });

  it("includes limitations", () => {
    const result = detect(AI_SAMPLES[0]!);
    expect(result.limitations.length).toBeGreaterThan(2);
  });
});
