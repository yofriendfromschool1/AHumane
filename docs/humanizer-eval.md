# Humanizer evaluation

Generated: 2026-11-12T08:51:21.606Z

Engine: deterministic Pro pipeline, strength 4, seed 42. Detector: built-in AHumane detector.
Fixtures: six AI-style samples, five human samples (original and public-domain), one fact-dense sample.

## Summary

- Mean AI score before: **65.7**
- Mean AI score after: **16.7**
- Median relative drop: **76%**
- Mean AI-phrase reduction: **100%**
- Mean human-fixture score: **12.0**
- Fact retention: **100%**
- Mean runtime: **25 ms**

## Per-sample results

| Sample | Words | AI before | AI after | Drop | Phrases/100w before → after | Burstiness CV before → after | Fact retention | Passes |
|---|---:|---:|---:|---:|---|---|---|---:|
| AI-1 | 194 | 67 | 18 | 73% | 11.2 → 0.0 | 0.16 → 0.24 | 100% | 3 |
| AI-2 | 110 | 67 | 23 | 66% | 12.4 → 0.0 | 0.15 → 0.15 | 100% | 3 |
| AI-3 | 132 | 67 | 20 | 70% | 9.8 → 0.0 | 0.17 → 0.08 | 100% | 3 |
| AI-4 | 113 | 65 | 12 | 82% | 6.7 → 0.0 | 0.36 → 0.31 | 100% | 3 |
| AI-5 | 120 | 63 | 14 | 78% | 5.2 → 0.0 | 0.30 → 0.26 | 100% | 3 |
| AI-6 | 125 | 65 | 13 | 80% | 6.4 → 0.0 | 0.19 → 0.30 | 100% | 3 |

## Checks

- PASS — aiMeanAbove65
- PASS — aiAfterBelow40
- PASS — medianDropAtLeast35
- PASS — phraseReductionAtLeast70
- PASS — humanMeanBelow40
- PASS — factsRetained
- PASS — separationAtLeast35

## Notes

- The detector is a stylistic heuristic, not a commercial detector. These numbers measure internal signal reduction, not a guarantee about GPTZero, Turnitin, or any other service.
- Fact retention is computed from protected tokens (numbers, dates, names, quotes, citations, URLs). It is a necessary condition, not a proof of semantic equivalence.
- Public-domain human samples are older prose; modern human writing may score differently.
- This is a local-engine benchmark. It is not a head-to-head comparison with any commercial product.
