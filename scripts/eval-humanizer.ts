import fs from "node:fs";
import path from "node:path";
import { AI_SAMPLES, HUMAN_SAMPLES, FACT_SAMPLE } from "../tests/fixtures/samples";
import { humanize } from "../lib/humanizer/pipeline";
import { detect } from "../lib/detector/score";
import { aiPhraseDensity, sentenceLengthStats } from "../lib/detector/features";

interface Row {
  id: string;
  words: number;
  before: number;
  after: number;
  drop: number;
  phraseBefore: number;
  phraseAfter: number;
  cvBefore: number;
  cvAfter: number;
  retention: number;
  passes: number;
  ms: number;
}

const rows: Row[] = [];
for (const [index, sample] of AI_SAMPLES.entries()) {
  const before = detect(sample);
  const result = humanize(sample, { mode: "pro", strength: 4, seed: 42 });
  const after = detect(result.output);
  const beforeStats = sentenceLengthStats(sample);
  const afterStats = sentenceLengthStats(result.output);
  rows.push({
    id: `AI-${index + 1}`,
    words: result.stats.wordsIn,
    before: before.score,
    after: after.score,
    drop: Math.round(((before.score - after.score) / Math.max(1, before.score)) * 100),
    phraseBefore: aiPhraseDensity(sample),
    phraseAfter: aiPhraseDensity(result.output),
    cvBefore: beforeStats.cv,
    cvAfter: afterStats.cv,
    retention: result.meaning.retention,
    passes: result.stats.passes,
    ms: result.stats.ms,
  });
}

const humanScores = HUMAN_SAMPLES.map((sample) => detect(sample).score);
const fact = humanize(FACT_SAMPLE, { mode: "pro", strength: 5, seed: 7 });
const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
};

const aiBefore = rows.map((row) => row.before);
const aiAfter = rows.map((row) => row.after);
const drops = rows.map((row) => row.drop);
const phraseReduction = avg(
  rows.map((row) => (row.phraseBefore === 0 ? 1 : 1 - row.phraseAfter / row.phraseBefore)),
);
const retained = rows.every((row) => row.retention === 1) && fact.meaning.retention === 1;

const checks = {
  aiMeanAbove65: avg(aiBefore) >= 65,
  aiAfterBelow40: avg(aiAfter) < 40,
  medianDropAtLeast35: median(drops) >= 35,
  phraseReductionAtLeast70: phraseReduction >= 0.7,
  humanMeanBelow40: avg(humanScores) < 40,
  factsRetained: retained,
  separationAtLeast35: avg(aiBefore) - avg(humanScores) >= 35,
};

const lines: string[] = [];
lines.push("# Humanizer evaluation");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("Engine: deterministic Pro pipeline, strength 4, seed 42. Detector: built-in AHumane detector.");
lines.push("Fixtures: six AI-style samples, five human samples (original and public-domain), one fact-dense sample.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Mean AI score before: **${avg(aiBefore).toFixed(1)}**`);
lines.push(`- Mean AI score after: **${avg(aiAfter).toFixed(1)}**`);
lines.push(`- Median relative drop: **${median(drops).toFixed(0)}%**`);
lines.push(`- Mean AI-phrase reduction: **${(phraseReduction * 100).toFixed(0)}%**`);
lines.push(`- Mean human-fixture score: **${avg(humanScores).toFixed(1)}**`);
lines.push(`- Fact retention: **${retained ? "100%" : "FAILED"}**`);
lines.push(`- Mean runtime: **${avg(rows.map((row) => row.ms)).toFixed(0)} ms**`);
lines.push("");
lines.push("## Per-sample results");
lines.push("");
lines.push("| Sample | Words | AI before | AI after | Drop | Phrases/100w before → after | Burstiness CV before → after | Fact retention | Passes |");
lines.push("|---|---:|---:|---:|---:|---|---|---|---:|");
for (const row of rows) {
  lines.push(
    `| ${row.id} | ${row.words} | ${row.before} | ${row.after} | ${row.drop}% | ${row.phraseBefore.toFixed(1)} → ${row.phraseAfter.toFixed(1)} | ${row.cvBefore.toFixed(2)} → ${row.cvAfter.toFixed(2)} | ${(row.retention * 100).toFixed(0)}% | ${row.passes} |`,
  );
}
lines.push("");
lines.push("## Checks");
lines.push("");
for (const [name, passed] of Object.entries(checks)) {
  lines.push(`- ${passed ? "PASS" : "FAIL"} — ${name}`);
}
lines.push("");
lines.push("## Notes");
lines.push("");
lines.push("- The detector is a stylistic heuristic, not a commercial detector. These numbers measure internal signal reduction, not a guarantee about GPTZero, Turnitin, or any other service.");
lines.push("- Fact retention is computed from protected tokens (numbers, dates, names, quotes, citations, URLs). It is a necessary condition, not a proof of semantic equivalence.");
lines.push("- Public-domain human samples are older prose; modern human writing may score differently.");
lines.push("- This is a local-engine benchmark. It is not a head-to-head comparison with any commercial product.");

const report = lines.join("\n");
const outputPath = path.join(process.cwd(), "docs", "humanizer-eval.md");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report + "\n", "utf8");

console.log(report);
console.log(`\nWrote ${outputPath}`);

const failed = Object.entries(checks).filter(([, passed]) => !passed);
if (failed.length) {
  console.error(`Failed checks: ${failed.map(([name]) => name).join(", ")}`);
  process.exitCode = 1;
}
