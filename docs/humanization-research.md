# Humanizing AI text: research notes

This document collects the research behind AHumane's humanizer and detector. It is a working synthesis, not a claim of scientific authority. The goal is to explain which signals we target, why, and where the approach breaks down.

## 1. What "humanizing" actually means

Humanizing is not adding typos, swapping synonyms, or hiding a watermark. It is editing a machine-generated draft so it reads like prose a person wrote for a reader: varied rhythm, specific word choices, fewer stock connectors, a voice that is present without being performed.

The useful definition for engineering is narrower: reduce the statistical regularity that detectors associate with instruction-tuned models, while preserving meaning, facts, and the writer's intent.

Three things must be separated:

1. **Style**: how the text sounds. This is what a humanizer can change.
2. **Authorship**: who produced the text. This is not recoverable from style alone.
3. **Integrity**: whether using the text is honest in a given context. This is a human and institutional judgment, not a detector score.

AHumane only claims the first. The detector is a diagnostic, not a verdict.

## 2. What detectors measure

Most AI-text detectors are classifiers trained on human and machine text. Their features vary, but the public research and vendor documentation converge on a few families.

### Perplexity

Perplexity measures how predictable a token sequence is to a language model. Low perplexity means the model expected the next word. AI output tends to be low-perplexity because it selects likely continuations; human writing contains more surprising, specific, or idiosyncratic choices.

Perplexity is not directly observable from the text without a reference model. Our detector approximates it with lexical features: generic vocabulary, repeated collocations, low specificity, and AI-favoured phrase density.

### Burstiness

Burstiness is variation in sentence length and structure. Human prose tends to alternate short and long sentences; model prose often clusters around a comfortable middle. A useful measure is the coefficient of variation (standard deviation divided by mean sentence length).

Burstiness is easy to measure and easy to fake badly. Splitting every sentence into fragments produces high variance and terrible writing. The goal is rhythm that follows the thought.

### Lexical and phrase features

AI models overuse a recognizable vocabulary: *delve*, *leverage*, *utilize*, *facilitate*, *foster*, *underscore*, *showcase*, *tapestry*, *landscape*, *realm*, *pivotal*, *robust*, *seamless*, *myriad*, *plethora*, *holistic*, *transformative*. They also overuse formal transitions (*moreover*, *furthermore*, *additionally*, *consequently*, *thus*, *hence*, *in conclusion*) and empty hedges (*it is important to note*, *it could be argued*, *may potentially*).

These words are not forbidden. They are signals. A single *important* means nothing; a cluster of *pivotal*, *robust*, *seamless*, and *transformative* in three paragraphs is a pattern.

### Structural features

Detectors and human readers notice:

- Every paragraph the same length, often four or five sentences.
- Every section a triad, every list three items.
- Balanced "on one hand / on the other hand" constructions with no actual position.
- Formulaic introductions ("In today's fast-paced world…") and conclusions ("In conclusion, the future looks bright…").
- Inline-header lists with bold labels and colons.
- Title Case Headings.
- Emojis used as bullet decoration.

### Formatting and Unicode artifacts

Some tools leave zero-width spaces, non-breaking spaces, curly quotes, or model-specific markers. These are not reliable authorship evidence, but they are easy to remove. AHumane normalizes them before processing.

### The caveats that matter

- **Detectors are probabilistic.** Published evaluations show non-trivial false-positive and false-negative rates.
- **Non-native writers are disproportionately flagged.** Liang et al. (2023) found detectors misclassified a substantial share of non-native student essays as AI-generated. The pattern has been replicated.
- **Formal human writing looks AI-like.** Academic, legal, and policy prose shares many "AI" features because those are genre conventions.
- **Scores move.** A light edit, a different model version, or a different detector can swing results by tens of points.
- **A detector is not an authorship test.** Text alone cannot prove who wrote something.

## 3. The AI-tell taxonomy used by AHumane

We group tells into five layers. The engine targets them in order, because some fixes make others easier.

### Content layer

- Inflated significance ("marks a pivotal moment", "is a testament to").
- Vague attributions ("experts argue", "industry reports suggest").
- Formulaic "challenges and future prospects" sections.
- Generic positive conclusions.
- Promotional language in neutral contexts.

### Language layer

- AI-favoured vocabulary and nominalizations.
- Copula avoidance (*serves as*, *stands as*, *represents*).
- Negative parallelism (*not only X but also Y*; *it's not just X, it's Y*).
- Rule-of-three overuse.
- Elegant variation (synonym cycling).
- Excessive hedging and filler.

### Style layer

- Em-dash overuse.
- Semicolon and colon tics.
- Boldface and emoji decoration.
- Title case headings.
- Uniform sentence length.

### Voice layer

- No first or second person where it would be natural.
- No contractions in conversational prose.
- No opinions, uncertainty, or asides.
- A neutral, encyclopedic distance from the reader.

### Structure layer

- Uniform paragraph lengths.
- Metronome sentence openings.
- Every idea introduced with a formal transition.
- Lists where prose would be more natural.

## 4. What commercial humanizers do

The leading commercial humanizers converge on a similar product shape: a Basic/Pro model selector, language options, a built-in detector, a diff or history view, and a subscription. Their stronger modes typically use a language model rather than a thesaurus, and several recommend running a draft through more than once.

We did not have access to any competitor's proprietary prompts or model weights, and we did not copy them. AHumane implements the same general workflow independently: a model-first Pro mode, a second editorial pass, a fact check, and a local fallback. The differentiators are free access, self-hosting, visible changes, and a fact-preservation report.

### The prompt-based workflow

The research archive recommends high burstiness, high perplexity, no em dashes, simple vocabulary, and dramatic sentence-length variation. A representative prompt:

> Rewrite the text below in a natural human voice. Do not use hedging phrases like "may suggest", "could be argued", or "it is worth considering". Vary sentence length dramatically — mix 6-word sentences with 30-word sentences. Use one contraction per paragraph. Do not open paragraphs with meta-organizational language. Keep all factual claims intact.

AHumane's Pro prompt encodes these constraints and adds a hard fact-preservation rule and a machine-readable audit.

## 5. The AHumane pipeline

### Pass 1: protect

Before any rewrite, the engine replaces URLs, emails, code, numbers, dates, currencies, percentages, citations, quoted spans, and proper nouns with placeholders. The token format uses private-use characters and a non-word code so later rules cannot match inside it.

This was a real bug we fixed: an early digit-based token format allowed the number rule to wrap the digits inside another token, producing nested placeholders and losing facts. The current format round-trips exactly, and a regression test covers it.

### Pass 2: lexical and syntactic cleanup

A curated lexicon of hundreds of patterns removes AI-favoured vocabulary, formal transitions, filler, empty hedges, copula avoidance, nominalizations, and chatbot artifacts. Replacements are context-aware and inflection-aware: *fostering* becomes *supporting*, not *support*; *democratized* becomes *opened up*, not *open up*.

The engine also corrects article agreement after replacements ("an changing" → "a changing"), preserves thousand separators ("1,200" is not split), and de-duplicates repeated discourse markers.

### Pass 3: rhythm and voice

The engine splits long sentences at safe boundaries, merges short adjacent sentences when grammar allows, varies repeated openings, adds contractions by style, and inserts a small number of safe discourse markers. It also breaks up paragraphs that are suspiciously uniform.

This is the most subjective pass. Over-editing is worse than under-editing, so each transformation is validated and can be reverted.

### Pass 4: audit and repair

The Pro engine generates several candidates with different seeds and strengths, scores them with the built-in detector, and keeps the best candidate that preserves facts and improves the signal. The "run again" button changes the seed, matching the research workflow's "run it twice" advice.

Pro is now model-first. The draft is sent to a language model (Llama 3.3 70B by default, through a free public OVHcloud endpoint), fact-checked, and then revised by a second editorial pass. If the model loses a protected fact or is unavailable, the local four-pass engine runs instead. The model path produces genuinely different sentences; the local engine remains the privacy-preserving fallback.

This matters because the old engine was a phrase-replacement system. Even after it removed our own detector signals, external detectors still flagged its output. A real model rewrite is necessary for meaningful variation, though it is not sufficient for detector evasion.

## 6. Mapping rules to signals

| Signal | Engine response |
|---|---|
| AI vocabulary | Curated lexicon with inflection and context |
| Formal transitions | Thin, replace, or delete |
| Filler/hedging | Strip empty phrases; keep meaningful uncertainty |
| Copula avoidance | Restore *is/has* |
| Nominalizations | Turn nouns back into verbs |
| Uniform sentence length | Split/merge, vary openings |
| Metronome rhythm | Paragraph reshaping, short sentences |
| Em-dash/semicolon tics | Punctuation policy by style |
| Low contraction rate | Contraction injection by style |
| Chatbot artifacts | Remove before anything else |
| Repeated openers | Alternate *This/That/It*, add markers |
| Formulaic conclusions | Remove scaffolding |

## 7. What we deliberately do not do

- **No random synonym swaps.** They damage meaning and do not change rhythm.
- **No deliberate typos or grammar errors.** They are a bad trade and do not make writing better.
- **No watermark removal claims.** We normalize invisible characters, but we cannot know what a provider embeds.
- **No guarantees about detector scores.** Detectors are inconsistent and often wrong.
- **No training on user text.** History stays in the browser; the reference server does not log drafts.

## 8. Evaluation

The reproducible evaluation is in [`humanizer-eval.md`](./humanizer-eval.md). On six AI-style fixtures and five human fixtures, the current Pro pipeline (strength 4, seed 42) produces:

- mean AI score 65.7 → 16.7;
- median relative drop 76%;
- mean AI-phrase reduction 100%;
- mean human-fixture score 12.0;
- 100% protected-fact retention;
- mean runtime 24 ms.

These are internal metrics against our own detector. They are not a guarantee about GPTZero, Turnitin, Originality, or any other service. We do not claim a head-to-head win against any commercial product.

## 9. External detector tests

We tested the public detector pages directly. Full method and results are in [`external-detector-tests.md`](./external-detector-tests.md). The short version:

- ZeroGPT scored a 500-word public-domain human passage at **78.4% AI** and an 80-word human paragraph at **100% AI**.
- Sapling scored long human essays at **0.0%**, but it scored every LLM output we tested (Llama 70B, GPT-OSS 120B, Mistral 24B, our two-pass pipeline) at **99.9–100%**.
- A leading free commercial humanizer's output scored **30.0%** on Sapling and **100%** on ZeroGPT.
- GPTZero did not return an unauthenticated scan result; Copyleaks was blocked by Cloudflare; Originality.ai required an account/credits.

This is the central limitation. Naturalness and detector evasion are different properties. A larger model writes better prose but does not automatically evade a classifier trained on model output. No tool can honestly guarantee all five detectors, and the user's request to "ensure" a pass is not achievable with the accessible tools.

## 10. Sources

- Wikipedia, *Signs of AI writing*: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Liang et al., *GPT detectors are biased against non-native English writers*: https://arxiv.org/abs/2304.02819
- GPTZero, detection methodology and product documentation: https://gptzero.me/
- Originality.ai, AI detection research: https://originality.ai/
- The AI Detector Bypassers research archive: https://github.com/yofriendfromschool1/ai-detector-bypassers-and-school-cheating2
- *deai-ify* humanization skill (Wikipedia-derived pattern list): https://github.com/LeoYeAI/agent-master-skills
- *humanize-writing* skill (vocabulary and rhythm framework): https://github.com/aaaronmiller/humanize-writing
