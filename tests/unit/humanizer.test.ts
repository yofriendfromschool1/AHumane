import { describe, expect, it } from "vitest";
import { humanize } from "@/lib/humanizer/pipeline";
import { detect } from "@/lib/detector/score";
import { AI_SAMPLES, FACT_SAMPLE } from "../fixtures/samples";

describe("humanize", () => {
  it("handles empty input without throwing", () => {
    const result = humanize("");
    expect(result.output).toBe("");
    expect(result.stats.wordsIn).toBe(0);
  });

  it("is deterministic for the same input and seed", () => {
    const a = humanize(AI_SAMPLES[0]!, { mode: "pro", seed: 123 });
    const b = humanize(AI_SAMPLES[0]!, { mode: "pro", seed: 123 });
    expect(a.output).toBe(b.output);
  });

  it("varies output when the seed changes", () => {
    const a = humanize(AI_SAMPLES[0]!, { mode: "basic", seed: 1 });
    const b = humanize(AI_SAMPLES[0]!, { mode: "basic", seed: 999 });
    expect(a.output).not.toBe(b.output);
  });

  it("removes strong AI phrases", () => {
    const result = humanize(AI_SAMPLES[0]!, { mode: "pro", strength: 5, seed: 42 });
    expect(result.output.toLowerCase()).not.toContain("furthermore");
    expect(result.output.toLowerCase()).not.toContain("it is important to note");
    expect(result.output.toLowerCase()).not.toContain("delve");
  });

  it("lowers the detector score on AI fixtures", () => {
    for (const sample of AI_SAMPLES.slice(0, 3)) {
      const before = detect(sample).score;
      const result = humanize(sample, { mode: "pro", strength: 4, seed: 42 });
      const after = detect(result.output).score;
      expect(after).toBeLessThan(before * 0.7);
    }
  });

  it("preserves protected facts", () => {
    const result = humanize(FACT_SAMPLE, { mode: "pro", strength: 5, seed: 7 });
    expect(result.meaning.retention).toBe(1);
    expect(result.output).toContain("March 14, 2024");
    expect(result.output).toContain("(Chen et al., 2023)");
    expect(result.output).toContain("47.2%");
    expect(result.output).toContain("1,200");
    expect(result.output).toContain("$3.5 million");
    expect(result.output).toContain("https://example.org/quiet-part");
  });

  it("keeps thousand separators intact", () => {
    const result = humanize("There were 1,200 people at the event, and 3,500 more watched online.", {
      mode: "basic",
      seed: 3,
    });
    expect(result.output).toContain("1,200");
    expect(result.output).toContain("3,500");
  });

  it("does not produce duplicate words", () => {
    const result = humanize(AI_SAMPLES[2]!, { mode: "pro", strength: 5, seed: 11 });
    expect(result.output).not.toMatch(/\b([a-z]{2,})\s+\1\b/i);
  });
});
