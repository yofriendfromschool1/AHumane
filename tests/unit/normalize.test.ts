import { describe, expect, it } from "vitest";
import { normalizeText, cleanSpacing, fixArticles } from "@/lib/humanizer/normalize";
import { protectText, restoreText } from "@/lib/humanizer/protect";
import { createRng } from "@/lib/utils/seeded-random";

describe("normalization and protection", () => {
  it("normalizes smart quotes and invisible characters", () => {
    const result = normalizeText("\u201CHello\u201D\u200B \u00A0world\u2026");
    expect(result).toBe('"Hello" world...');
  });

  it("does not split numbers in the spacing cleanup", () => {
    expect(cleanSpacing("There were 1,200 people, and 47.2% agreed.")).toBe(
      "There were 1,200 people, and 47.2% agreed.",
    );
  });

  it("fixes a/an agreement", () => {
    expect(fixArticles("an changing world")).toBe("a changing world");
    expect(fixArticles("a apple")).toBe("an apple");
    expect(fixArticles("a university")).toBe("a university");
  });

  it("round-trips protected values", () => {
    const input =
      'On March 14, 2024, Dr. Maya Chen cited (Chen et al., 2023) and said "hello". See https://example.org/x.';
    const { text, tokens } = protectText(input, createRng(1));
    expect(tokens.length).toBeGreaterThan(3);
    expect(text).not.toContain("https://example.org");
    expect(text).not.toContain("(Chen et al., 2023)");
    expect(text).not.toContain('"hello"');
    expect(restoreText(text, tokens)).toBe(input);
  });

  it("does not nest placeholders", () => {
    const input = 'A quote "with 1,200 numbers" and 47.2% more.';
    const { text, tokens } = protectText(input, createRng(1));
    expect((text.match(/\uE000/g) ?? []).length).toBe(tokens.length);
    expect((text.match(/\uE001/g) ?? []).length).toBe(tokens.length);
    expect(restoreText(text, tokens)).toBe(input);
  });
});
