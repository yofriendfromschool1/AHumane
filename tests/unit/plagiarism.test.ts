import { describe, expect, it } from "vitest";
import {
  buildShingles,
  distinctivePhrases,
  findInLocalCorpus,
} from "@/lib/plagiarism/local-corpus";
import { checkPlagiarism } from "@/lib/plagiarism";

const AUSTEN = `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.`;

describe("plagiarism", () => {
  it("builds 8-word shingles", () => {
    const { shingles, words } = buildShingles("one two three four five six seven eight nine ten");
    expect(words).toHaveLength(10);
    expect(shingles).toHaveLength(3);
    expect(shingles[0]).toBe("one two three four five six seven eight");
  });

  it("finds a copied passage in the local corpus", () => {
    const matches = findInLocalCorpus(AUSTEN);
    expect(matches[0]?.source.id).toBe("austen-pride");
    expect(matches[0]?.overlap).toBeGreaterThan(0.9);
  });

  it("does not flag an original passage", () => {
    const matches = findInLocalCorpus(
      "The first thing I noticed about the new office was the silence. Not the focused silence of a library, but the flat, airless quiet of a room full of people pretending to be busy.",
    );
    expect(matches).toHaveLength(0);
  });

  it("extracts distinctive phrases", () => {
    const phrases = distinctivePhrases(AUSTEN, 3);
    expect(phrases.length).toBeGreaterThan(0);
    expect(phrases[0]!.split(" ")).toHaveLength(8);
  });

  it("returns a percentage and sources without web access", async () => {
    const result = await checkPlagiarism(AUSTEN, { web: false });
    expect(result.score).toBeGreaterThan(80);
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.method).toContain("8-word");
  });
});
