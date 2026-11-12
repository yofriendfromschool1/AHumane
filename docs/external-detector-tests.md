# External detector tests

Date: 2026-11-12 (America/Los_Angeles)
Test document: a 452-word AI-style essay about AI, education, work, and governance.
Browser: headless Chromium via Playwright against each public detector page.
Every score below is what the detector displayed for the text, with no edits after submission.

## Results

| Text | Sapling | ZeroGPT | GPTZero | Copyleaks | Originality.ai |
|---|---:|---:|---|---|---|
| Original AI essay | 100.0% AI | 100% AI | not testable without account | blocked by Cloudflare / account | no free checker without account |
| AHumane deterministic Pro (old engine) | 99.9% AI | 100% AI | not testable | not testable | not testable |
| AHumane model-first Pro (Llama 3.3 70B, 2 passes) | 100.0% AI | 100% AI | not testable | not testable | not testable |
| Llama 3.3 70B single pass | 100.0% AI | not run | not testable | not testable | not testable |
| GPT-OSS 120B single pass | 100.0% AI | not run | not testable | not testable | not testable |
| Mistral Small 24B single pass | 99.9% AI | not run | not testable | not testable | not testable |
| A leading free commercial humanizer | **30.0% AI** | 100% AI | not testable | not testable | not testable |
| Human-written essay about AI (Ethan Mollick excerpt) | **0.0% AI** | not run | not testable | not testable | not testable |
| Human-written essay about computing (Paul Graham excerpt) | **0.0% AI** | not run | not testable | not testable | not testable |
| Public-domain human prose, 500 words | **0.0% AI** | 78.4% AI | not testable | not testable | not testable |
| Human-written 80-word personal paragraph | **99.0% AI** | 100% AI | not testable | not testable | not testable |

## What this shows

1. **ZeroGPT is not a usable pass/fail gate.** It scored a 500-word public-domain human passage at 78.4% AI and an 80-word clearly human paragraph at 100% AI. It also scored the commercial humanizer's output at 100%. A tool cannot "reliably pass" a detector that flags human writing and a leading commercial humanizer.
2. **Sapling is length- and style-sensitive.** It correctly gives 0.0% to long human essays, but it gave 99.0% to an 80-word human paragraph and 100% to every LLM output tested, including outputs from 70B and 120B models. The commercial humanizer's output reached 30.0%, the only humanizer output that moved materially below 100%.
3. **A bigger model is not automatically a better evader.** Llama 3.3 70B, GPT-OSS 120B, Mistral Small 24B, and the two-pass AHumane pipeline all scored 99.9–100% on Sapling. Naturalness and detector evasion are not the same property.
4. **GPTZero, Copyleaks, and Originality.ai require accounts or paid credits.** GPTZero's public page displayed no result after clicking Scan in an unauthenticated browser. Copyleaks returned a Cloudflare security check. Originality.ai presented no text checker without signup. We did not create accounts or fabricate scores.
5. **The 30% result is the realistic target, and even that tool fails ZeroGPT.** The user's requirement to pass all five is not achievable with the accessible tools. A human editor, a fine-tuned evasion model, or a paid detector account would be required to go further.

## Method

- ZeroGPT: `https://www.zerogpt.com/`, paste text, click **Detect Text**, read the "Your Text is ..." result.
- Sapling: `https://sapling.ai/ai-content-detector`, paste into `#content-editor`, click **Check again**, read the "AI-detection score".
- GPTZero: `https://gptzero.me/`, paste into the textarea, click **Scan**. In an unauthenticated session the page did not produce a score.
- Copyleaks: `https://copyleaks.com/ai-content-detector` returned HTTP 403 with a Cloudflare challenge.
- Originality.ai: `https://originality.ai/ai-checker` required an account/credits; no free text checker was available.

## Implication for AHumane

The product must not promise that it will pass any detector. It can promise a meaningful model rewrite, fact preservation, a visible diff, and a local-only mode. The Pro engine now uses a real language model for semantic rewriting and a second editorial pass, which is a substantial quality improvement over the old phrase-replacement engine. It still cannot guarantee external detector scores, and the tests above are the evidence.

If a stronger guarantee is required, the realistic options are:

1. **Human editing** of the model draft, using the tool as a first pass.
2. **A paid detector API** so the operator can run an audit loop against the same detector the user cares about.
3. **A fine-tuned humanization model** trained on paired AI/human edits; this requires training data and evaluation, and even then no vendor guarantees all five detectors.
4. **A paid humanizer** with a proprietary evasion model. That is no longer a free, self-hosted product.
