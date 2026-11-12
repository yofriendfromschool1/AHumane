export interface ArticleSection {
  heading?: string;
  body: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "Product" | "Detection" | "Writing" | "Ethics" | "Research";
  readingTime: string;
  author: string;
  sections: ArticleSection[];
  sources?: Array<{ label: string; href: string }>;
}

export const ARTICLES: Article[] = [
  {
    slug: "introducing-ahumane",
    title: "Introducing AHumane",
    description:
      "A free, self-hosted AI humanizer with a model-first Pro engine, a local four-pass fallback, and a detector that shows its work. Here is what it is and how to run it.",
    date: "2026-08-12",
    category: "Product",
    readingTime: "4 min read",
    author: "The AHumane team",
    sections: [
      {
        body: `AHumane is a free, self-hosted writing studio built around one idea: AI-assisted drafts should still sound like a person wrote them.

Paste a draft, choose a model or the local engine, and get a rewrite you can review. The output keeps your numbers, names, quotes, citations, and URLs intact. The diff shows what changed. Nothing is hidden behind an account or a word counter.`,
      },
      {
        heading: "Model-first, with a local fallback",
        body: `Pro starts with a real semantic rewrite from a language model, then runs a second editorial pass. By default it uses a free public model endpoint; you can point it at Ollama, an Unsloth fine-tune served through Ollama or vLLM, or any OpenAI-compatible provider.

If no model is reachable, or the draft is too short or too long for the model, the local four-pass engine takes over. It removes AI-favoured phrasing, rebuilds sentence rhythm, and validates every protected fact. Nothing needs to leave your machine in local-only mode.`,
      },
      {
        heading: "What is free",
        body: `Everything: the humanizer, the detector, the plagiarism checker, the writer, and the document library. There is no paid tier and no watermark. The software is self-hostable, so hosting is the only cost.

There is also no account requirement. The studio works immediately, and history stays in your browser.`,
      },
      {
        heading: "How to run it",
        body: `Clone the repository, install dependencies with pnpm, and start the app. For local AI, install Ollama, pull a model, and select it in the studio settings. The README includes the full setup, including the Unsloth fine-tuning and GGUF export path.

If you want a hosted model instead, set an OpenAI-compatible endpoint in the environment. The app will list it as a provider.`,
      },
      {
        heading: "What we do not claim",
        body: `AHumane does not guarantee a detector score. AI detectors are inconsistent, and our own tests found human writing being flagged by public tools. The humanizer is a writing tool, not a certificate of authorship. Use the review tab, keep your drafts, and follow your institution or client's disclosure rules.`,
      },
    ],
  },
  {
    slug: "why-ai-detectors-flag-writing",
    title: "Why AI Detectors Flag Your Writing",
    description:
      "Detectors are not reading a hidden watermark. They are measuring statistical regularity. Here is what that means for your draft — and what actually helps.",
    date: "2026-09-02",
    category: "Detection",
    readingTime: "7 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `You paste a draft into an AI detector. It says 87% AI. You wrote every word. Or you used AI to draft it, edited it heavily, and the result still sounds like you. Either way, the number feels less like an analysis and more like an accusation.

It helps to understand what the detector is actually doing. In most cases, it is not looking for a hidden signature. It is comparing your text to patterns that are common in machine-generated writing. When those patterns dominate, the score goes up.`,
      },
      {
        heading: "The signals detectors look for",
        body: `**Perplexity** is a measure of how predictable each word is. A model trained to produce the most likely next word tends to choose safe, common continuations. Human writing is bumpier: unusual verbs, specific nouns, a sentence that takes a detour.

**Burstiness** is variation in sentence length. AI text often clusters around a comfortable 18–24 words. Human prose swings from four words to forty. A detector that sees a metronome notices.

**Transition density** matters too. Words like *moreover*, *furthermore*, *additionally*, *thus*, and *consequently* are not wrong. They are just overrepresented in model output, especially in academic and professional modes.

**Punctuation habits** are a smaller signal. Em dashes, semicolons, and colons appear at different rates in different writers, but some models use them in a recognizably tidy pattern.

**Structure** can give a draft away before a single sentence is read: every paragraph the same length, every section a triad, every conclusion a summary of the introduction.`,
      },
      {
        heading: "Why human writing gets flagged",
        body: `Formal human writing often looks AI-like. A thesis chapter, a legal memo, and a policy brief all use long sentences, hedges, nominalizations, and repeated transitions because those are the conventions of the genre. Non-native English writers are flagged at higher rates for related reasons: the prose may be more formal and less idiomatic, which the detector reads as “model-like.”

That is a false positive problem, and it is not solved by adding typos. A detector is not measuring soul. It is measuring distance from a statistical center. You can move away from that center by writing with more specificity and variation — or you can leave the text alone and argue with the result.`,
      },
      {
        heading: "What actually helps",
        body: `The first fix is structural: vary sentence length and openings. Read the draft aloud. If every sentence lands with the same weight, break some and merge others.

The second fix is lexical: replace abstract, high-frequency verbs with plain, specific ones. *Utilize* becomes *use*. *Delve into* becomes *dig into* or, better, a sentence that says something only this draft could say.

The third fix is punctuation: remove the em dashes and semicolons you did not intend. Do not strip all of them; just stop using them as default connectors.

The fourth fix is honesty: keep your notes, drafts, and version history. If a detector wrongly flags your work, a process trail is more useful than a lower score.`,
      },
      {
        heading: "What does not help",
        body: `Swapping random synonyms creates awkward prose that still has the same rhythm. Adding deliberate typos is a bad trade: you lose clarity and still may not move the score. Running text through three different humanizers until it passes one detector is a recipe for a draft nobody wants to read.

A humanizer is useful when it improves the writing. If it only improves the number, it has failed.`,
      },
    ],
    sources: [
      { label: "Wikipedia: Signs of AI writing", href: "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing" },
      { label: "GPTZero: How AI detection works", href: "https://gptzero.me/" },
    ],
  },
  {
    slug: "ai-vocabulary-blacklist",
    title: "The AI Vocabulary Blacklist",
    description:
      "The words and phrases that make a draft sound machine-written, why they spread, and what to use instead. A practical list, not a ban.",
    date: "2026-08-23",
    category: "Writing",
    readingTime: "8 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `There is no single word that makes a sentence sound like AI. There is a cluster of words that co-occur so reliably in model output that readers now notice them before they notice the argument.

This is not a list of forbidden words. It is a list of words worth a second look. If a word is doing real work, keep it. If it is there because the sentence needed a verb and the model reached for the statistically safest one, cut it.`,
      },
      {
        heading: "The core offenders",
        body: `**Verbs:** delve, leverage, utilize, facilitate, foster, underscore, showcase, garner, navigate, harness, streamline, optimize, illuminate, synthesize, conceptualize, embark, elevate, empower.

**Adjectives:** pivotal, crucial, vital, robust, seamless, comprehensive, multifaceted, intricate, holistic, transformative, groundbreaking, cutting-edge, game-changing, unparalleled, invaluable.

**Abstract nouns:** landscape, realm, tapestry, paradigm, ecosystem, framework, interplay, nuance, synergy, proliferation.

**Openers and connectors:** moreover, furthermore, additionally, consequently, therefore, thus, hence, firstly, secondly, lastly, in conclusion, overall, ultimately, it is important to note, it is worth noting.

**Inflated phrases:** serves as a testament to, plays a crucial role in, underscores the importance of, in today's fast-paced world, in the ever-evolving landscape of, a myriad of, a plethora of, unlock the full potential of.`,
      },
      {
        heading: "Why these words spread",
        body: `Language models are trained to produce likely continuations. In a large corpus of edited, professional prose, certain words are statistically safe: they fit many contexts, carry a positive valence, and rarely offend. Reinforcement learning from human feedback pushes the model further toward broadly acceptable, helpful-sounding language.

The result is a dialect. It is not wrong, exactly. It is just frictionless. And friction is where voice lives.`,
      },
      {
        heading: "What to use instead",
        body: `The replacement is usually shorter and more specific:

- *utilize* → use
- *leverage* → use, apply, draw on
- *facilitate* → help, make easier
- *foster* → support, encourage
- *underscore* → show
- *delve into* → dig into, look closely at, get into
- *pivotal* → key, central
- *crucial* → important
- *robust* → strong, reliable
- *seamless* → smooth
- *landscape* → field, scene, world
- *realm* → area, world
- *tapestry* → mix
- *myriad* → many
- *plethora* → plenty of

For connectors, the best replacement is often nothing. Let the next sentence follow. If you need a bridge, use *also*, *but*, *so*, *still*, or *that said*.`,
      },
      {
        heading: "Do not overcorrect",
        body: `A draft with no abstract nouns and no formal connectors is not automatically human. It can read like a blog post from 2012. The goal is not to ban the vocabulary; it is to make sure every word is chosen rather than defaulted to.

Read the sentence aloud. If the word feels like it came from a press release, replace it. If it is the precise word, keep it and move on.`,
      },
    ],
  },
  {
    slug: "burstiness-perplexity-rhythm",
    title: "Burstiness, Perplexity, and the Rhythm of Human Writing",
    description:
      "A plain-English guide to the two statistics behind most AI detection — and the practical edits that change them without making the writing worse.",
    date: "2026-09-10",
    category: "Research",
    readingTime: "6 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `Two words show up in almost every explanation of AI detection: perplexity and burstiness. They sound technical. The ideas are simple, and understanding them is more useful than memorizing a list of banned words.`,
      },
      {
        heading: "Perplexity: how surprised is the model?",
        body: `Perplexity measures how predictable a sequence of words is to a language model. Low perplexity means the model saw the next word coming. High perplexity means the word was less expected.

Human writing tends to have higher perplexity because people make odd, specific choices: a concrete image, an unusual verb, a digression that pays off later. AI writing tends to have lower perplexity because it selects likely continuations.

This is why “just add a typo” is bad advice. A typo is surprising, but it does not make the surrounding prose more specific or more human. It just makes it wrong.`,
      },
      {
        heading: "Burstiness: how uneven is the rhythm?",
        body: `Burstiness measures variation in sentence length and structure. A bursty paragraph might run: eleven words. Then a long sentence that winds through a qualification, a concrete example, and a turn. Then four words. Then a medium sentence that lands the point.

AI paragraphs often settle into a rhythm: similar lengths, similar openings, similar shapes. The prose is competent and strangely flat. Increasing burstiness is not about writing randomly. It is about letting the thought dictate the sentence length.`,
      },
      {
        heading: "How to edit for rhythm",
        body: `Read the draft aloud and mark every sentence that starts the same way. Combine two short sentences that are making one point. Split a long sentence at the hinge where the idea turns. Move a qualifying clause to the end. Delete the transition that is only there to signal that a transition is happening.

Then check the paragraph shape. If every paragraph is five sentences, change one. A one-sentence paragraph can do more work than a summary paragraph.

Finally, check the punctuation. If the draft is full of em dashes and semicolons, it may be defaulting to a tidy connector instead of letting the sentence end.`,
      },
      {
        heading: "What the numbers cannot tell you",
        body: `A high burstiness score does not make a paragraph good. A low perplexity score does not prove a text was generated. These are statistical descriptions, not aesthetic judgments.

Use them as diagnostics. If a draft feels flat, rhythm is a useful place to look. If a detector flags a draft that you wrote, the score is a claim about style, not a claim about authorship.`,
      },
    ],
  },
  {
    slug: "humanize-chatgpt-text",
    title: "How to Humanize ChatGPT Text Without Making It Worse",
    description:
      "A practical workflow for turning a ChatGPT draft into prose you would actually publish — including what to fix by hand and what to let the tool handle.",
    date: "2026-09-18",
    category: "Writing",
    readingTime: "7 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `ChatGPT is good at producing a complete draft. That is also the problem. The draft arrives with a shape: a broad opening, three balanced points, a transitional phrase before each one, and a conclusion that restates the introduction. It reads like a summary of an essay rather than an essay.

Humanizing it is not one button. It is a short editing workflow.`,
      },
      {
        heading: "1. Cut the opening",
        body: `Most ChatGPT drafts start with a sentence that could open any article on the topic: “In today's rapidly evolving digital landscape…” Delete it. Start with the most specific sentence in the first paragraph, even if it was originally third. The draft will immediately sound less generic.`,
      },
      {
        heading: "2. Find the real claim",
        body: `Highlight the sentence that actually says something arguable. If there isn't one, the draft is a summary, not an argument. Add a claim in your own words before you run any tool. A humanizer can change the rhythm of a claim; it cannot invent one.`,
      },
      {
        heading: "3. Break the triad habit",
        body: `ChatGPT loves groups of three: three benefits, three challenges, three recommendations. Sometimes three is right. Often the third item is filler. Delete it, or replace the list with a sentence that explains the relationship between the first two.

The same applies to “not only X but also Y” and “it's not just X; it's Y.” These constructions feel emphatic and say less than they appear to.`,
      },
      {
        heading: "4. Run the humanizer, then read it",
        body: `Use Pro mode with the Natural style. The engine will remove the stock transitions, replace the AI-favoured vocabulary, vary the sentence lengths, and add contractions where they fit. It will also protect names, numbers, quotes, and citations.

Then read the output. Do not publish it unseen. A humanizer can produce a sentence that is grammatically fine and slightly off in context. You are the context.`,
      },
      {
        heading: "5. Put one thing back",
        body: `The best humanized drafts contain something a model would not have chosen: a specific detail, a mild opinion, a parenthetical aside, a sentence that admits uncertainty. Add one thing that only you could add. That is the difference between “not obviously AI” and “actually yours.”`,
      },
    ],
  },
  {
    slug: "humanize-claude-text",
    title: "How to Humanize Claude Text",
    description:
      "Claude's prose is warmer and more varied than ChatGPT's, but it has its own tells. Here is how to keep the voice and lose the assistant cadence.",
    date: "2026-09-22",
    category: "Writing",
    readingTime: "6 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `Claude is often the most pleasant model to read. It uses longer sentences, more hedges, and a conversational warmth that feels less like a press release than ChatGPT. That is also why humanizing Claude output is a different job.

The goal is not to flatten the warmth. It is to remove the assistant-specific habits that survive into the final draft.`,
      },
      {
        heading: "The tells that survive",
        body: `Claude tends to open with a qualification: “The question of X is not merely technical.” It likes to acknowledge complexity before making a point. It uses “not just X, but Y” and “it's worth noting” as rhythmic bridges. It often ends with a sentence that zooms out to a broader implication.

None of these are bad writing on their own. In a draft, they become a pattern.`,
      },
      {
        heading: "Keep the warmth, cut the scaffolding",
        body: `Do not remove every hedge. A little uncertainty is human. Remove the hedges that are doing no work: “it could potentially be argued that,” “one might say,” “it is worth considering.” Replace them with a direct claim or a specific qualification.

Keep the longer sentences that carry a real qualification. Split the ones that are long because the model did not want to commit.`,
      },
      {
        heading: "Check the conclusion",
        body: `Claude often ends by widening the frame: “Ultimately, this raises broader questions about…” If the essay has already raised those questions, the sentence is redundant. End on the most specific point instead. A conclusion does not have to summarize; it can simply stop.`,
      },
      {
        heading: "Use the right humanizer setting",
        body: `Natural or Professional style works best for Claude drafts. Academic style preserves more of the hedging and formal structure, which is useful for a thesis but not for a blog post. Pro mode will audit the result and rework the sentences that still read like an assistant.`,
      },
    ],
  },
  {
    slug: "ai-detector-vs-plagiarism-checker",
    title: "AI Detector vs. Plagiarism Checker",
    description:
      "They answer different questions. Confusing them can get you into trouble in either direction. Here is the difference, with examples.",
    date: "2026-09-26",
    category: "Detection",
    readingTime: "5 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `An AI detector asks: does this text look machine-generated? A plagiarism checker asks: does this text match an existing source? The two questions are independent.

A passage can be AI-generated and completely original. It can also be human-written and copied. It can be both. It can be neither.`,
      },
      {
        heading: "What each tool actually compares",
        body: `An AI detector compares stylistic features against patterns associated with human and machine writing. It does not need a source document. It is looking at rhythm, vocabulary, structure, and similar signals.

A plagiarism checker compares your text against a corpus of sources — websites, books, papers, and previously submitted work. It is looking for overlapping sequences of words. It does not care who wrote them.`,
      },
      {
        heading: "Why the distinction matters",
        body: `If a school runs only an AI detector, a copied human essay can pass. If it runs only a plagiarism checker, an original AI essay can pass. Many institutions now run both, which is why “it passed the AI check” is not the same as “it is safe to submit.”

For writers, the practical lesson is to check both before publishing or submitting. Fixing an AI score does nothing for a missing citation. Fixing a citation does nothing for a robotic rhythm.`,
      },
      {
        heading: "How AHumane handles it",
        body: `The AI detector is built into the humanizer, so you can see the score before and after. The plagiarism checker is a separate tool because it needs a different kind of comparison. It currently checks a local reference corpus and Wikipedia, and it says so on the page instead of implying a full web crawl.

Neither tool is a substitute for your own judgment or your institution's process.`,
      },
    ],
  },
  {
    slug: "non-native-english-writers",
    title: "Why AI Detectors Flag Non-Native English Writers",
    description:
      "The research is consistent: detectors make more false-positive errors on non-native writing. Here is why, and what to do about it.",
    date: "2026-09-29",
    category: "Ethics",
    readingTime: "6 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `AI detectors are not neutral. Several studies have found that they are more likely to flag writing by non-native English speakers as AI-generated, even when the writing is entirely human.

The reason is structural, not malicious. Detectors are trained to separate human and machine text using statistical patterns. Non-native writing often shares some of those patterns: more formal register, fewer contractions, more explicit transitions, and less idiomatic variation. The detector reads distance from idiomatic English as distance from human writing.`,
      },
      {
        heading: "What the research shows",
        body: `A 2023 study by Liang et al. found that AI detectors misclassified a substantial share of non-native student essays as AI-generated. Subsequent work has repeated the finding across detectors and datasets. The error rate varies, but the direction is consistent.

This is a false-positive problem with real consequences: accusations, lost grades, and damaged trust. It is also a reminder that a detector score is not evidence of misconduct.`,
      },
      {
        heading: "What writers can do",
        body: `First, do not try to write like a native speaker if that is not your voice. The goal is clarity, not mimicry. Specific examples, direct claims, and varied sentence length help every writer.

Second, keep your process. Drafts, notes, outlines, and version history are more persuasive than a detector score.

Third, use tools that show their reasoning. If a detector says “uniform sentence rhythm” and “formal transitions,” you can decide whether those are genuine problems in your draft. If it just says “87% AI,” you cannot.`,
      },
      {
        heading: "What institutions should do",
        body: `Treat detector output as a conversation starter, not a verdict. Require process evidence. Use multiple reviewers. And be explicit about the known error rates, especially for multilingual writers. A tool that cannot explain itself should not be the basis for an accusation.`,
      },
      {
        heading: "How AHumane tries to help",
        body: `Our detector shows the sentence-level reasons behind a score and states its limitations on the page. It is still a heuristic, and it can still be wrong. The difference is that you can see why.`,
      },
    ],
    sources: [
      { label: "Liang et al., GPT detectors are biased against non-native English writers", href: "https://arxiv.org/abs/2304.02819" },
      { label: "Wikipedia: Signs of AI writing", href: "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing" },
    ],
  },
  {
    slug: "how-many-words-ai-detectors",
    title: "How Many Words Do AI Detectors Need?",
    description:
      "Short samples are noisy. Here is how much text different detectors ask for, and why our confidence label drops under 150 words.",
    date: "2026-10-02",
    category: "Detection",
    readingTime: "4 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `A one-sentence scan is not a detection. It is a guess with a percentage sign.

Most AI detectors need a few hundred words to have enough signal. Some publish minimums; others do not. Turnitin has historically required a substantial word count for its AI writing indicator. GPTZero accepts short samples but warns that accuracy drops. Many free tools will happily score a paragraph and present the number with false confidence.`,
      },
      {
        heading: "Why length matters",
        body: `The features detectors use are statistical. Sentence-length variation, transition density, repetition, and vocabulary distribution all need a sample. With five sentences, a single long sentence can dominate the average. With two paragraphs, one unusual word can swing a lexical score.

Short text also gives the detector fewer chances to be wrong in a way that cancels out. The result is noisier, not more precise.`,
      },
      {
        heading: "Our rule of thumb",
        body: `Under 80 words: low confidence, score pulled toward the middle. 80–220 words: medium confidence. Over 220 words: high confidence, assuming the text is coherent.

If you are checking an essay, scan the whole essay, not the introduction. If you are checking an email, accept that the result is a rough signal.`,
      },
      {
        heading: "What to do with a short-text score",
        body: `Use it as a prompt to read the draft, not as a verdict. Look at the sentence heat-map. If one sentence is flagged, ask whether the sentence is genuinely generic. If the whole draft is flagged, look at the structural signals first.

And remember: a confident-sounding number is not the same as a reliable one.`,
      },
    ],
  },
  {
    slug: "ai-humanizer-vs-paraphraser",
    title: "AI Humanizer vs. AI Paraphraser",
    description:
      "A paraphraser changes words. A humanizer changes rhythm, structure, and voice. Here is when each one is the right tool.",
    date: "2026-10-06",
    category: "Writing",
    readingTime: "5 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `The two tools are often mentioned together, and they are not the same. A paraphraser rewrites a sentence with different words. A humanizer rewrites a draft so it reads like a person wrote it. The difference matters when the problem is not vocabulary.`,
      },
      {
        heading: "What a paraphraser does",
        body: `A paraphraser preserves the sentence's structure and swaps words or reorders clauses. It is useful for avoiding repetition, simplifying jargon, or producing an alternative phrasing. It is not designed to fix rhythm, and it can make AI tells worse by replacing one generic word with another.`,
      },
      {
        heading: "What a humanizer does",
        body: `A humanizer looks at the draft as a whole: sentence length, openings, transitions, punctuation, paragraph shape, and voice. It may split a long sentence, merge two short ones, remove a formal connector, add a contraction, or replace a cluster of AI-favoured words. The goal is a different reading experience, not a different synonym.`,
      },
      {
        heading: "Which should you use?",
        body: `If the sentence is clear but the word is wrong, paraphrase. If the draft feels flat, uniform, or generic, humanize. If you need both, humanize first and paraphrase the specific sentences that still bother you.

And if the draft has no argument, neither tool will save it. Editing can improve prose. It cannot invent a point.`,
      },
      {
        heading: "A note on “undetectable”",
        body: `Paraphrasers are often marketed as humanizers, and humanizers are often marketed as detector bypasses. The honest version: both can change the signals detectors look at, and neither can guarantee a result. Use the tool that improves the writing, and verify with more than one method.`,
      },
    ],
  },
  {
    slug: "ethics-of-humanizing",
    title: "The Ethics of Humanizing AI Text",
    description:
      "When is it legitimate to use a humanizer, and when is it a way to hide something you should disclose? A practical framework, not a lecture.",
    date: "2026-10-10",
    category: "Ethics",
    readingTime: "6 min read",
    author: "AHumane Research",
    sections: [
      {
        body: `A humanizer is a writing tool. Like any writing tool, it can be used well or badly. The tool does not decide the ethics; the context does.

Here is a framework that is more useful than “AI bad” or “AI fine.”`,
      },
      {
        heading: "The disclosure question",
        body: `Ask what the reader is entitled to know. A blog post does not usually need a disclosure that AI helped with a draft. A academic submission usually does. A client deliverable may depend on the contract. A published article may depend on the outlet's policy.

The relevant question is not “did AI touch this?” It is “is the reader being misled about how this was made or what it claims?”`,
      },
      {
        heading: "The accuracy question",
        body: `Humanizing changes style, not facts. If the draft contains a fabricated citation, a wrong number, or a claim the model invented, a humanizer will preserve the error in nicer prose. Check facts before you polish.`,
      },
      {
        heading: "The voice question",
        body: `If the goal is to make a draft sound like you, a humanizer can help remove generic phrasing. If the goal is to make a draft sound like someone else, or to pass off a machine's work as a person's without disclosure, that is a different choice. Be honest with yourself about which one you are making.`,
      },
      {
        heading: "The detector question",
        body: `Detectors are unreliable. Using a humanizer solely to beat a detector is a bad optimization target, because the score is not a measure of quality or authorship. Using it to make the writing clearer, more varied, and more like your own voice is a legitimate editing goal.

If you are accused of misconduct, a humanizer will not prove you wrote something. Your drafts and process will.`,
      },
      {
        heading: "Our position",
        body: `AHumane is built for people who want to write better with AI, not for people who want to hide that they used it. We do not claim to make text undetectable, and we do not promise a score. We do make the editing visible, preserve the facts, and keep your text private. What you do with the result is your call.`,
      },
    ],
  },
  {
    slug: "how-pro-humanizer-works",
    title: "Inside the Pro Humanizer: Four Passes, One Detector",
    description:
      "A transparent look at how AHumane's Pro mode turns a flat AI draft into varied prose — and why it checks its own work.",
    date: "2026-10-14",
    category: "Product",
    readingTime: "6 min read",
    author: "AHumane Engineering",
    sections: [
      {
        body: `Most humanizers do one thing: send the text to a model with a prompt and return whatever comes back. AHumane's Pro mode is a pipeline. It makes several passes, scores the result, and repairs what still looks machine-made.

Here is what happens when you press Humanize.`,
      },
      {
        heading: "Pass 1: protect the facts",
        body: `Before any rewrite, the engine replaces URLs, emails, numbers, dates, citations, quoted text, and proper nouns with protected tokens. The rewrite can move them around, but it cannot change them. At the end, every token is restored and checked. If a sentence would lose one, that sentence is reverted.`,
      },
      {
        heading: "Pass 2: remove the tells",
        body: `The first rewrite pass targets vocabulary and scaffolding: AI-favoured words, formal transitions, filler phrases, hedges, copula avoidance, nominalizations, and chatbot artifacts. It uses a curated lexicon of hundreds of patterns, with context-sensitive replacements rather than blind synonym swaps.`,
      },
      {
        heading: "Pass 3: rebuild the rhythm",
        body: `The second pass works on sentence and paragraph shape. It splits sentences that run too long, merges short ones when the grammar allows, varies openings, adds contractions by style, thins repeated discourse markers, and breaks up paragraphs that are suspiciously uniform.`,
      },
      {
        heading: "Pass 4: audit and repair",
        body: `The result is scored with the same detector you see in the studio. Sentences above the threshold are identified, and the engine makes a targeted repair pass: stronger splits, different openings, fewer AI phrases. The engine keeps the best-scoring candidate that still passes the fact check.

If a local or remote model is connected, Pro can use it for a deeper rewrite, then run the same audit and repair loop on the model's output. If the model is unavailable, the deterministic pipeline runs instead.`,
      },
      {
        heading: "Why show the changes?",
        body: `Because a black box is not trustworthy. The review tab lists each changed sentence with the reason: removed a formal transition, replaced AI-style vocabulary, tightened wording, added a contraction. You can read the before and after and decide whether the edit improved the sentence.

A humanizer should be a writing tool, not a slot machine. The mechanics should be boring and visible.`,
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug);
  if (!current) return ARTICLES.slice(0, limit);
  const sameCategory = ARTICLES.filter(
    (article) => article.slug !== slug && article.category === current.category,
  );
  const rest = ARTICLES.filter(
    (article) => article.slug !== slug && article.category !== current.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export const ARTICLES_SORTED = [...ARTICLES].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
