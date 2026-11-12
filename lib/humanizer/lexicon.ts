import type { HumanizerStyle } from "./types";
import type { Rng } from "../utils/seeded-random";

export type LexCategory =
  | "ai-word"
  | "transition"
  | "filler"
  | "hedge"
  | "copula"
  | "inflation"
  | "cliche"
  | "chatbot"
  | "formal"
  | "nominalization";

export interface LexEntry {
  id: string;
  pattern: RegExp;
  replacements: string[];
  category: LexCategory;
  probability: number;
  styles?: HumanizerStyle[];
  reason: string;
  verb?: boolean;
}

export const LEXICON: LexEntry[] = [
  // ── Chatbot artifacts ─────────────────────────────────────────────────────
  { id: "certainly-open", pattern: /\b(?:Certainly|Absolutely|Of course|Sure thing)[!,. ]+/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed an assistant-style opener" },
  { id: "great-question", pattern: /\b(?:Great|Excellent|Fantastic) question[!,. ]*/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed a chatbot pleasantry" },
  { id: "hope-helps", pattern: /\bI hope (?:this|that) helps[!,. ]*/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed a chatbot sign-off" },
  { id: "let-me-know", pattern: /\b(?:Please )?[Ll]et me know if you(?:'d| would)? (?:like|want|need)[^.!?]*[.!?]?/g, replacements: [""], category: "chatbot", probability: 1, reason: "Removed a chatbot follow-up" },
  { id: "as-ai", pattern: /\bAs an AI(?: language model)?,?\s*/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed an AI self-reference" },
  { id: "here-overview", pattern: /\bHere is (?:a|an|the) (?:overview|summary|breakdown) of\s*/gi, replacements: [""], category: "chatbot", probability: 0.9, reason: "Removed a generic assistant opener" },
  { id: "i-hope-this", pattern: /\bI hope (?:this|the above) (?:is|was) (?:helpful|useful)[!,. ]*/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed a chatbot sign-off" },
  { id: "feel-free", pattern: /\bFeel free to (?:reach out|ask|let me know)[^.!?]*[.!?]?/gi, replacements: [""], category: "chatbot", probability: 1, reason: "Removed a chatbot pleasantry" },

  // ── Inflated significance ────────────────────────────────────────────────
  { id: "testament", pattern: /\b(?:is|stands as|serves as) (?:a|an) (?:enduring |lasting |powerful )?testament to\b/gi, replacements: ["shows", "is proof of"], category: "inflation", probability: 1, reason: "Cut inflated significance language" },
  { id: "plays-role", pattern: /\bplays? (?:a|an) (?:crucial|vital|critical|key|significant|important|pivotal) role in\b/gi, replacements: ["shapes", "is central to", "matters for"], category: "inflation", probability: 0.95, reason: "Cut inflated significance language" },
  { id: "underscores-importance", pattern: /\b(?:underscores|highlights|emphasizes|underlines) the importance of\b/gi, replacements: ["makes the case for", "puts a spotlight on"], category: "inflation", probability: 1, reason: "Cut inflated significance language" },
  { id: "marking-moment", pattern: /\bmarking (?:a|an) (?:pivotal|key|significant|important|turning) (?:moment|point|shift) in\b/gi, replacements: ["at a turning point for", "as"], category: "inflation", probability: 0.9, reason: "Cut inflated significance language" },
  { id: "evolving-landscape", pattern: /\bin (?:the|an|today's) (?:ever-)?(?:evolving|changing|rapidly evolving) (?:landscape|world|environment) of\b/gi, replacements: ["in"], category: "inflation", probability: 1, reason: "Removed a stock AI transition" },
  { id: "digital-age", pattern: /\bin (?:today's|the modern|this) (?:digital|fast-paced|modern) (?:age|era|world)\b/gi, replacements: ["today", "now"], category: "cliche", probability: 1, reason: "Replaced a dated cliché" },
  { id: "fast-paced-landscape", pattern: /\bin today's (?:fast-paced|rapidly changing|ever-changing) (?:digital )?(?:world|landscape|environment|age|era)\b/gi, replacements: ["these days", "right now"], category: "cliche", probability: 1, reason: "Replaced a dated opening cliché" },
  { id: "broader-trend", pattern: /\bpart of a broader (?:trend|movement|shift|conversation)\b/gi, replacements: ["part of a wider change", "one example of a wider shift"], category: "inflation", probability: 0.9, reason: "Cut vague broader-trend framing" },
  { id: "sets-stage", pattern: /\bsets? the stage for\b/gi, replacements: ["makes room for", "leads to"], category: "inflation", probability: 0.9, reason: "Cut inflated significance language" },
  { id: "indelible-mark", pattern: /\b(?:left|leaves?) an indelible mark on\b/gi, replacements: ["changed", "shaped"], category: "inflation", probability: 1, reason: "Cut inflated significance language" },
  { id: "rich-tapestry", pattern: /\b(?:rich|complex|vibrant) tapestry of\b/gi, replacements: ["mix of", "web of"], category: "cliche", probability: 1, reason: "Replaced an AI cliché" },

  // ── Transitions ──────────────────────────────────────────────────────────
  { id: "furthermore", pattern: /\bFurthermore,\s*/gi, replacements: ["Also, ", "Plus, ", ""], category: "transition", probability: 0.95, reason: "Thinned a formal transition" },
  { id: "moreover", pattern: /\bMoreover,\s*/gi, replacements: ["Also, ", "And ", ""], category: "transition", probability: 0.95, reason: "Thinned a formal transition" },
  { id: "additionally", pattern: /\bAdditionally,\s*/gi, replacements: ["Also, ", "Plus, ", ""], category: "transition", probability: 0.95, reason: "Thinned a formal transition" },
  { id: "in-addition", pattern: /\bIn addition,\s*/gi, replacements: ["Also, ", "On top of that, ", ""], category: "transition", probability: 0.9, reason: "Thinned a formal transition" },
  { id: "consequently", pattern: /\bConsequently,\s*/gi, replacements: ["So ", "As a result, ", ""], category: "transition", probability: 0.9, reason: "Thinned a formal transition" },
  { id: "therefore", pattern: /\bTherefore,\s*/gi, replacements: ["So ", "That means ", ""], category: "transition", probability: 0.8, reason: "Thinned a formal transition" },
  { id: "thus", pattern: /\bThus,\s*/gi, replacements: ["So ", ""], category: "transition", probability: 0.85, reason: "Thinned a formal transition" },
  { id: "hence", pattern: /\bHence,\s*/gi, replacements: ["So ", ""], category: "transition", probability: 0.85, reason: "Thinned a formal transition" },
  { id: "nevertheless", pattern: /\b(?:Nevertheless|Nonetheless),\s*/gi, replacements: ["Still, ", "Even so, "], category: "transition", probability: 0.9, reason: "Thinned a formal transition" },
  { id: "however", pattern: /\bHowever,\s*/gi, replacements: ["But ", "That said, ", "Still, "], category: "transition", probability: 0.55, reason: "Varied a repeated contrast transition" },
  { id: "in-conclusion", pattern: /\b(?:In conclusion|To conclude|In summary|To sum up|All in all),\s*/gi, replacements: ["", "So, ", "In the end, "], category: "transition", probability: 0.95, reason: "Removed a formulaic conclusion opener" },
  { id: "overall", pattern: /\bOverall,\s*/gi, replacements: ["", "On the whole, "], category: "transition", probability: 0.7, reason: "Thinned a summary transition" },
  { id: "ultimately", pattern: /\bUltimately,\s*/gi, replacements: ["In the end, ", ""], category: "transition", probability: 0.8, reason: "Thinned a summary transition" },
  { id: "firstly", pattern: /\bFirstly,\s*/gi, replacements: ["First, ", "To start, "], category: "transition", probability: 0.9, reason: "Varied list scaffolding" },
  { id: "secondly", pattern: /\bSecondly,\s*/gi, replacements: ["Second, ", "Next, "], category: "transition", probability: 0.9, reason: "Varied list scaffolding" },
  { id: "lastly", pattern: /\bLastly,\s*/gi, replacements: ["Finally, ", "And last, "], category: "transition", probability: 0.9, reason: "Varied list scaffolding" },
  { id: "first-foremost", pattern: /\bFirst and foremost,\s*/gi, replacements: ["First, ", ""], category: "transition", probability: 1, reason: "Cut a formulaic opener" },
  { id: "last-not-least", pattern: /\bLast but not least,\s*/gi, replacements: ["Finally, ", ""], category: "transition", probability: 1, reason: "Cut a formulaic opener" },
  { id: "importantly", pattern: /\b(?:Importantly|Notably|Crucially),\s*/gi, replacements: ["", "More to the point, "], category: "transition", probability: 0.85, reason: "Thinned an emphasis marker" },
  { id: "indeed", pattern: /\bIndeed,\s*/gi, replacements: ["", "In fact, "], category: "transition", probability: 0.8, reason: "Thinned a formal transition" },
  { id: "in-fact", pattern: /\bIn fact,\s*/gi, replacements: ["Actually, ", ""], category: "transition", probability: 0.6, reason: "Varied a repeated transition" },
  { id: "as-such", pattern: /\bAs such,\s*/gi, replacements: ["So ", ""], category: "transition", probability: 0.85, reason: "Thinned a formal transition" },
  { id: "that-said", pattern: /\bThat being said,\s*/gi, replacements: ["That said, ", "Still, "], category: "transition", probability: 0.9, reason: "Shortened a formulaic transition" },
  { id: "in-this-regard", pattern: /\bIn this regard,\s*/gi, replacements: ["Here, ", ""], category: "transition", probability: 0.9, reason: "Cut a filler transition" },
  { id: "when-it-comes", pattern: /\bWhen it comes to\b/gi, replacements: ["For", "With"], category: "cliche", probability: 0.85, reason: "Replaced a stock phrase" },

  // ── Filler and hedging ───────────────────────────────────────────────────
  { id: "important-note", pattern: /\bIt is (?:important|crucial|essential|necessary) to (?:note|remember|understand|acknowledge|recognize|mention) that\s*/gi, replacements: [""], category: "filler", probability: 1, reason: "Removed a filler preamble" },
  { id: "worth-noting", pattern: /\bIt is worth (?:noting|mentioning) that\s*/gi, replacements: [""], category: "filler", probability: 1, reason: "Removed a filler preamble" },
  { id: "should-note", pattern: /\bIt should be noted that\s*/gi, replacements: [""], category: "filler", probability: 1, reason: "Removed a filler preamble" },
  { id: "needless", pattern: /\bNeedless to say,\s*/gi, replacements: [""], category: "filler", probability: 1, reason: "Removed a filler phrase" },
  { id: "at-end-day", pattern: /\bAt the end of the day,\s*/gi, replacements: ["In the end, ", ""], category: "cliche", probability: 1, reason: "Replaced a cliché" },
  { id: "could-argued", pattern: /\bIt (?:could|can|might) be argued that\s*/gi, replacements: ["Arguably, ", "Some would say "], category: "hedge", probability: 1, reason: "Cut excessive hedging" },
  { id: "one-could", pattern: /\bOne could argue that\s*/gi, replacements: ["Arguably, "], category: "hedge", probability: 1, reason: "Cut excessive hedging" },
  { id: "possible-that", pattern: /\bIt is possible that\s*/gi, replacements: ["Maybe ", "Perhaps "], category: "hedge", probability: 0.9, reason: "Cut excessive hedging" },
  { id: "may-be-case", pattern: /\bIt may be the case that\s*/gi, replacements: ["Maybe ", "Perhaps "], category: "hedge", probability: 1, reason: "Cut excessive hedging" },
  { id: "may-potentially", pattern: /\b(?:may|might|could|can) potentially\b/gi, replacements: ["may", "might", "could", "can"], category: "hedge", probability: 1, reason: "Cut a redundant hedge" },
  { id: "possibly", pattern: /\bpossibly\b/gi, replacements: [""], category: "hedge", probability: 0.25, styles: ["casual", "natural", "concise"], reason: "Cut a weak hedge" },
  { id: "to-some-extent", pattern: /\bto some extent\b/gi, replacements: ["partly", "in part"], category: "hedge", probability: 0.9, reason: "Tightened a hedge" },
  { id: "in-some-cases", pattern: /\bin some cases\b/gi, replacements: ["sometimes", "in some situations"], category: "hedge", probability: 0.7, reason: "Varied a repeated hedge" },
  { id: "generally-speaking", pattern: /\b(?:Generally|Broadly) speaking,\s*/gi, replacements: ["", "Usually, "], category: "hedge", probability: 0.9, reason: "Cut a filler hedge" },
  { id: "very-unique", pattern: /\bvery unique\b/gi, replacements: ["unique"], category: "hedge", probability: 1, reason: "Fixed an absolute modifier" },
  { id: "absolutely-essential", pattern: /\babsolutely (?:essential|critical|vital)\b/gi, replacements: ["essential", "critical"], category: "hedge", probability: 1, reason: "Cut a redundant intensifier" },

  // ── Copula avoidance and formal verbs ────────────────────────────────────
  { id: "serves-as", pattern: /\bserves? as\b/gi, replacements: ["is", "works as"], category: "copula", probability: 0.9, reason: "Restored a simple verb" },
  { id: "stands-as", pattern: /\bstands? as\b/gi, replacements: ["is"], category: "copula", probability: 0.9, reason: "Restored a simple verb" },
  { id: "represents-a", pattern: /\brepresents? (?:a|an)\b/gi, replacements: ["is a", "is an"], category: "copula", probability: 0.8, reason: "Restored a simple verb" },
  { id: "constitutes", pattern: /\bconstitut(?:e|es|ed|ing)\b/gi, replacements: ["form"], category: "formal", probability: 0.8, reason: "Simplified formal vocabulary", verb: true },
  { id: "boasts", pattern: /\bboasts?\b/gi, replacements: ["has", "offers"], category: "copula", probability: 0.9, reason: "Restored a simple verb" },
  { id: "possesses", pattern: /\bpossess(?:es|ed|ing)?\b/gi, replacements: ["own"], category: "formal", probability: 0.95, reason: "Simplified formal vocabulary", verb: true },
  { id: "characterized-by", pattern: /\bis characterized by\b/gi, replacements: ["has", "is marked by"], category: "copula", probability: 0.85, reason: "Restored a simple verb" },
  { id: "comprised-of", pattern: /\bis comprised of\b/gi, replacements: ["is made of", "includes"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary" },
  { id: "a-total-of", pattern: /\ba total of\b/gi, replacements: [""], category: "filler", probability: 0.8, reason: "Removed a filler quantifier" },

  // ── AI vocabulary ────────────────────────────────────────────────────────
  { id: "delve-into", pattern: /\bdelv(?:e|es|ed|ing) into\b/gi, replacements: ["dig into", "get into", "look closely at"], category: "ai-word", probability: 1, reason: "Replaced an AI-favoured verb" },
  { id: "delve", pattern: /\bdelv(?:e|es|ed|ing)\b/gi, replacements: ["explore"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured verb", verb: true },
  { id: "utilize", pattern: /\butiliz(?:e|es|ed|ing)\b/gi, replacements: ["use"], category: "ai-word", probability: 1, reason: "Replaced an AI-favoured word", verb: true },
  { id: "leverage", pattern: /\bleverag(?:e|es|ed|ing)\b/gi, replacements: ["use", "apply"], category: "ai-word", probability: 1, reason: "Replaced an AI-favoured word", verb: true },
  { id: "facilitate", pattern: /\bfacilitat(?:e|es|ed|ing)\b/gi, replacements: ["help", "support"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured word", verb: true },
  { id: "foster", pattern: /\bfoster(?:s|ed|ing)?\b/gi, replacements: ["support", "encourage"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured word", verb: true },
  { id: "underscore", pattern: /\bunderscor(?:e|es|ed|ing)\b/gi, replacements: ["show"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured word", verb: true },
  { id: "showcase", pattern: /\bshowcas(?:e|es|ed|ing)\b/gi, replacements: ["show"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured word", verb: true },
  { id: "garner", pattern: /\bgarner(?:s|ed|ing)?\b/gi, replacements: ["earn"], category: "ai-word", probability: 0.9, reason: "Replaced an AI-favoured word", verb: true },
  { id: "embark", pattern: /\bembark(?:s|ed|ing)? on\b/gi, replacements: ["start", "begin"], category: "ai-word", probability: 0.95, reason: "Replaced an AI-favoured phrase" },
  { id: "navigate", pattern: /\bnavigat(?:e|es|ed|ing)\b/gi, replacements: ["handle"], category: "ai-word", probability: 0.6, reason: "Replaced an overused metaphor", verb: true },
  { id: "digital-landscape", pattern: /\bdigital landscape\b/gi, replacements: ["digital world", "online world"], category: "ai-word", probability: 1, reason: "Replaced an abstract AI noun" },
  { id: "landscape", pattern: /\b(?:the )?(?:current|modern|evolving|broader|wider) landscape\b/gi, replacements: ["the current scene", "the field", "the wider picture"], category: "ai-word", probability: 0.9, reason: "Replaced an abstract AI noun" },
  { id: "realm", pattern: /\b(?:the )?(?:realm|realms) of\b/gi, replacements: ["the world of", "the area of"], category: "ai-word", probability: 0.9, reason: "Replaced an abstract AI noun" },
  { id: "myriad", pattern: /\ba myriad of\b/gi, replacements: ["many", "plenty of"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "myriad-simple", pattern: /\bmyriad\b/gi, replacements: ["many", "countless"], category: "ai-word", probability: 0.9, reason: "Replaced inflated vocabulary" },
  { id: "plethora", pattern: /\ba plethora of\b/gi, replacements: ["plenty of", "many"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "pivotal-moment", pattern: /\bpivotal (?:moment|point)\b/gi, replacements: ["turning point"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "pivotal-role", pattern: /\bpivotal role\b/gi, replacements: ["key role"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "pivotal", pattern: /\bpivotal\b/gi, replacements: ["key", "important"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "crucial", pattern: /\bcrucial\b/gi, replacements: ["important", "key"], category: "ai-word", probability: 0.95, reason: "Replaced inflated vocabulary" },
  { id: "significant", pattern: /\bsignificant\b/gi, replacements: ["major", "real", "notable"], category: "ai-word", probability: 0.9, styles: ["natural", "casual", "concise", "professional"], reason: "Replaced inflated vocabulary" },
  { id: "profound", pattern: /\bprofound\b/gi, replacements: ["deep", "major", "far-reaching"], category: "ai-word", probability: 0.7, reason: "Replaced inflated vocabulary" },
  { id: "has-potential", pattern: /\b(?:has|have) the potential to\b/gi, replacements: ["can"], category: "ai-word", probability: 0.9, reason: "Simplified wordy phrasing" },
  { id: "vital", pattern: /\bvital\b/gi, replacements: ["important", "essential"], category: "ai-word", probability: 0.5, reason: "Replaced inflated vocabulary" },
  { id: "paramount", pattern: /\bparamount\b/gi, replacements: ["essential", "vital"], category: "ai-word", probability: 0.9, reason: "Replaced inflated vocabulary" },
  { id: "robust", pattern: /\brobust\b/gi, replacements: ["strong", "solid", "reliable"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "seamless", pattern: /\bseamless\b/gi, replacements: ["smooth", "effortless"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "seamlessly", pattern: /\bseamlessly\b/gi, replacements: ["smoothly"], category: "ai-word", probability: 1, reason: "Replaced inflated vocabulary" },
  { id: "cutting-edge", pattern: /\b(?:cutting-edge|state-of-the-art|next-generation|next-gen)\b/gi, replacements: ["new", "advanced", "modern"], category: "cliche", probability: 0.95, reason: "Replaced a promo cliché" },
  { id: "revolutionize", pattern: /\brevolutioniz(?:e|es|ed|ing)\b/gi, replacements: ["change", "reshape", "upend"], category: "cliche", probability: 0.9, reason: "Replaced a promo cliché" },
  { id: "game-changing", pattern: /\bgame[- ]chang(?:er|ing)\b/gi, replacements: ["big change", "major shift"], category: "cliche", probability: 0.95, reason: "Replaced a promo cliché" },
  { id: "transformative-force", pattern: /\btransformative force\b/gi, replacements: ["major force"], category: "cliche", probability: 1, reason: "Replaced a promo cliché" },
  { id: "transformative", pattern: /\btransformative\b/gi, replacements: ["major", "far-reaching"], category: "cliche", probability: 0.95, reason: "Replaced a promo cliché" },
  { id: "groundbreaking", pattern: /\bgroundbreaking\b/gi, replacements: ["new", "original"], category: "cliche", probability: 0.9, reason: "Replaced a promo cliché" },
  { id: "innovative", pattern: /\binnovative\b/gi, replacements: ["new", "original", "fresh"], category: "cliche", probability: 0.6, reason: "Replaced a promo cliché" },
  { id: "unlock", pattern: /\bunlock(?:s|ed|ing)? (?:the )?(?:full |true |real )?(?:power|potential) of\b/gi, replacements: ["get more out of", "make better use of"], category: "cliche", probability: 0.9, reason: "Replaced a promo cliché" },
  { id: "harness", pattern: /\bharness(?:es|ed|ing)?\b/gi, replacements: ["use", "apply"], category: "ai-word", probability: 0.75, reason: "Replaced an AI-favoured word" },
  { id: "elevate", pattern: /\belevat(?:e|es|ed|ing)\b/gi, replacements: ["improve", "raise"], category: "ai-word", probability: 0.7, reason: "Replaced an AI-favoured word", verb: true },
  { id: "empower", pattern: /\bempower(?:s|ed|ing)?\b/gi, replacements: ["help"], category: "ai-word", probability: 0.7, reason: "Replaced an AI-favoured word", verb: true },
  { id: "streamline", pattern: /\bstreamlin(?:e|es|ed|ing)\b/gi, replacements: ["simplify"], category: "ai-word", probability: 0.8, reason: "Replaced an AI-favoured word", verb: true },
  { id: "optimize", pattern: /\boptimiz(?:e|es|ed|ing)\b/gi, replacements: ["improve", "tune"], category: "ai-word", probability: 0.8, reason: "Replaced an AI-favoured word", verb: true },
  { id: "illuminate", pattern: /\billuminat(?:e|es|ed|ing)\b/gi, replacements: ["show", "explain"], category: "ai-word", probability: 0.8, reason: "Replaced an AI-favoured word", verb: true },
  { id: "synthesize", pattern: /\bsynthesiz(?:e|es|ed|ing)\b/gi, replacements: ["combine"], category: "ai-word", probability: 0.8, reason: "Replaced an AI-favoured word", verb: true },
  { id: "conceptualize", pattern: /\bconceptualiz(?:e|es|ed|ing)\b/gi, replacements: ["imagine"], category: "ai-word", probability: 0.85, reason: "Replaced an AI-favoured word", verb: true },
  { id: "demonstrate", pattern: /\bdemonstrat(?:e|es|ed|ing)\b/gi, replacements: ["show"], category: "formal", probability: 0.45, reason: "Simplified formal vocabulary", verb: true },
  { id: "numerous", pattern: /\bnumerous\b/gi, replacements: ["many", "a lot of"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary" },
  { id: "individuals", pattern: /\bindividuals\b/gi, replacements: ["people"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "methodology", pattern: /\bmethodolog(?:y|ies)\b/gi, replacements: ["method", "methods", "approach"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "paradigm", pattern: /\bparadigms?\b/gi, replacements: ["model", "way of thinking"], category: "formal", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "ecosystem", pattern: /\becosystems\b/gi, replacements: ["systems", "networks"], category: "formal", probability: 0.7, reason: "Simplified abstract vocabulary" },
  { id: "ecosystem-single", pattern: /\becosystem\b/gi, replacements: ["system", "network"], category: "formal", probability: 0.6, reason: "Simplified abstract vocabulary" },
  { id: "holistic", pattern: /\bholistic\b/gi, replacements: ["complete", "balanced"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "multifaceted", pattern: /\bmultifaceted\b/gi, replacements: ["complex", "many-sided"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary" },
  { id: "intricate", pattern: /\bintricate\b/gi, replacements: ["complex", "detailed"], category: "formal", probability: 0.55, reason: "Simplified formal vocabulary" },
  { id: "comprehensive", pattern: /\bcomprehensive\b/gi, replacements: ["complete", "full", "thorough"], category: "formal", probability: 0.55, reason: "Simplified formal vocabulary" },
  { id: "optimal", pattern: /\boptimal\b/gi, replacements: ["best", "ideal"], category: "formal", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "commence", pattern: /\bcommenc(?:e|es|ed|ing)\b/gi, replacements: ["start"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary", verb: true },
  { id: "ascertain", pattern: /\bascertain(?:s|ed|ing)?\b/gi, replacements: ["confirm"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary", verb: true },
  { id: "necessitate", pattern: /\bnecessitat(?:e|es|ed|ing)\b/gi, replacements: ["need", "require"], category: "formal", probability: 0.9, reason: "Simplified formal vocabulary", verb: true },
  { id: "subsequently", pattern: /\bsubsequently\b/gi, replacements: ["later", "then"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "approximately", pattern: /\bapproximately\b/gi, replacements: ["about", "around"], category: "formal", probability: 0.7, reason: "Simplified formal vocabulary" },
  { id: "thereby", pattern: /\bthereby\b/gi, replacements: ["so", "which"], category: "formal", probability: 0.7, reason: "Simplified formal vocabulary" },
  { id: "wherein", pattern: /\bwherein\b/gi, replacements: ["where", "in which"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "whilst", pattern: /\bwhilst\b/gi, replacements: ["while"], category: "formal", probability: 0.95, reason: "Simplified formal vocabulary" },
  { id: "amongst", pattern: /\bamongst\b/gi, replacements: ["among"], category: "formal", probability: 0.95, reason: "Simplified formal vocabulary" },
  { id: "shall", pattern: /\bshall\b/gi, replacements: ["will", "should"], category: "formal", probability: 0.6, reason: "Simplified formal vocabulary" },

  // ── Filler / redundancy ──────────────────────────────────────────────────
  { id: "in-order", pattern: /\bin order to\b/gi, replacements: ["to"], category: "filler", probability: 1, reason: "Tightened a wordy phrase" },
  { id: "due-fact", pattern: /\bdue to the fact that\b/gi, replacements: ["because"], category: "filler", probability: 1, reason: "Tightened a wordy phrase" },
  { id: "at-point", pattern: /\bat (?:this|that|the present) (?:point|time)\b/gi, replacements: ["now", "then"], category: "filler", probability: 0.9, reason: "Tightened a wordy phrase" },
  { id: "has-ability", pattern: /\b(?:has|have) the ability to\b/gi, replacements: ["can"], category: "filler", probability: 1, reason: "Tightened a wordy phrase" },
  { id: "is-able", pattern: /\bis able to\b/gi, replacements: ["can"], category: "filler", probability: 0.9, reason: "Tightened a wordy phrase" },
  { id: "prior-to", pattern: /\bprior to\b/gi, replacements: ["before"], category: "filler", probability: 0.95, reason: "Tightened a wordy phrase" },
  { id: "subsequent-to", pattern: /\bsubsequent to\b/gi, replacements: ["after"], category: "filler", probability: 0.95, reason: "Tightened a wordy phrase" },
  { id: "with-regard", pattern: /\bwith (?:regard|respect) to\b/gi, replacements: ["about", "for"], category: "filler", probability: 0.9, reason: "Tightened a wordy phrase" },
  { id: "large-number", pattern: /\ba large number of\b/gi, replacements: ["many"], category: "filler", probability: 0.95, reason: "Tightened a wordy phrase" },
  { id: "majority-of", pattern: /\bthe (?:vast )?majority of\b/gi, replacements: ["most"], category: "filler", probability: 0.95, reason: "Tightened a wordy phrase" },
  { id: "despite-fact", pattern: /\bdespite the fact that\b/gi, replacements: ["although"], category: "filler", probability: 0.95, reason: "Tightened a wordy phrase" },
  { id: "wide-range", pattern: /\ba wide (?:range|variety) of\b/gi, replacements: ["many", "all kinds of"], category: "inflation", probability: 0.9, reason: "Tightened inflated language" },
  { id: "variety-of", pattern: /\ba variety of\b/gi, replacements: ["many", "several"], category: "inflation", probability: 0.8, reason: "Tightened inflated language" },
  { id: "in-close-proximity", pattern: /\bin close proximity to\b/gi, replacements: ["near", "close to"], category: "formal", probability: 1, reason: "Tightened a wordy phrase" },
  { id: "global-scale", pattern: /\bon a global scale\b/gi, replacements: ["worldwide"], category: "filler", probability: 0.9, reason: "Tightened a wordy phrase" },
  { id: "advent-of", pattern: /\bthe advent of\b/gi, replacements: ["the arrival of", "the rise of"], category: "formal", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "proliferation", pattern: /\bthe proliferation of\b/gi, replacements: ["the spread of", "the growth of"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },

  // ── Nominalisations ──────────────────────────────────────────────────────
  { id: "nom-utilization", pattern: /\bthe utilization of\b/gi, replacements: ["using"], category: "nominalization", probability: 1, reason: "Turned a noun back into a verb" },
  { id: "nom-implementation", pattern: /\bthe implementation of\b/gi, replacements: ["implementing"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-development", pattern: /\bthe development of\b/gi, replacements: ["developing"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },
  { id: "nom-analysis", pattern: /\bthe analysis of\b/gi, replacements: ["analyzing"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-creation", pattern: /\bthe creation of\b/gi, replacements: ["creating"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },
  { id: "nom-enhancement", pattern: /\bthe enhancement of\b/gi, replacements: ["improving"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-optimization", pattern: /\bthe optimization of\b/gi, replacements: ["optimizing"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-integration", pattern: /\bthe integration of\b/gi, replacements: ["integrating"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-evaluation", pattern: /\bthe evaluation of\b/gi, replacements: ["evaluating"], category: "nominalization", probability: 0.9, reason: "Turned a noun back into a verb" },
  { id: "nom-establishment", pattern: /\bthe establishment of\b/gi, replacements: ["establishing"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },
  { id: "nom-introduction", pattern: /\bthe introduction of\b/gi, replacements: ["introducing"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },
  { id: "nom-reduction", pattern: /\bthe reduction of\b/gi, replacements: ["reducing"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },
  { id: "nom-increase", pattern: /\bthe increase of\b/gi, replacements: ["increasing"], category: "nominalization", probability: 0.85, reason: "Turned a noun back into a verb" },

  // ── Negative parallelism and forced rule of three ────────────────────────
  { id: "not-only-but", pattern: /\bnot only ([^,.;]{2,60}) but also\b/gi, replacements: ["$1 and"], category: "inflation", probability: 0.85, reason: "Removed a negative parallelism" },
  { id: "not-just-but", pattern: /\b(?:It|This|That)(?:'s| is) not (?:just|merely|only) ([^,.;]{2,60}), (?:it|this|that)(?:'s| is) ([^.!?]{2,80})/gi, replacements: ["It's $1 and $2"], category: "inflation", probability: 0.8, reason: "Removed a negative parallelism" },

  // ── Clichés ──────────────────────────────────────────────────────────────
  { id: "tip-iceberg", pattern: /\bthe tip of the iceberg\b/gi, replacements: ["just the start", "a small part of it"], category: "cliche", probability: 1, reason: "Replaced a cliché" },
  { id: "double-edged", pattern: /\ba double-edged sword\b/gi, replacements: ["a trade-off", "a mixed bag"], category: "cliche", probability: 1, reason: "Replaced a cliché" },
  { id: "think-outside", pattern: /\bthink outside the box\b/gi, replacements: ["think differently", "try a different angle"], category: "cliche", probability: 1, reason: "Replaced a cliché" },
  { id: "paradigm-shift", pattern: /\bparadigm shift\b/gi, replacements: ["big change", "shift in thinking"], category: "cliche", probability: 1, reason: "Replaced a cliché" },
  { id: "synergy", pattern: /\bsynerg(?:y|ies|istic)\b/gi, replacements: ["teamwork", "combined effect"], category: "cliche", probability: 0.95, reason: "Replaced corporate jargon" },
  { id: "best-practices", pattern: /\bbest practices\b/gi, replacements: ["what works", "proven methods"], category: "cliche", probability: 0.7, reason: "Replaced corporate jargon" },
  { id: "actionable", pattern: /\bactionable insights\b/gi, replacements: ["useful takeaways"], category: "cliche", probability: 0.95, reason: "Replaced corporate jargon" },
  { id: "low-hanging", pattern: /\blow-hanging fruit\b/gi, replacements: ["easy wins"], category: "cliche", probability: 1, reason: "Replaced corporate jargon" },
  { id: "move-needle", pattern: /\bmove the needle\b/gi, replacements: ["make a difference"], category: "cliche", probability: 1, reason: "Replaced corporate jargon" },
  { id: "circle-back", pattern: /\bcircle back\b/gi, replacements: ["follow up"], category: "cliche", probability: 1, reason: "Replaced corporate jargon" },
  { id: "deep-dive", pattern: /\bdeep dive\b/gi, replacements: ["close look"], category: "cliche", probability: 0.9, reason: "Replaced corporate jargon" },
  { id: "unpack", pattern: /\bunpack(?:ing)?\b/gi, replacements: ["explain", "break down"], category: "cliche", probability: 0.5, reason: "Replaced overused metaphor" },
  { id: "collective", pattern: /\bcollective\b/gi, replacements: ["shared"], category: "formal", probability: 0.85, reason: "Simplified formal vocabulary" },
  { id: "enable", pattern: /\benabl(?:e|es|ed|ing)\b/gi, replacements: ["allow"], category: "ai-word", probability: 0.7, reason: "Replaced an AI-favoured verb", verb: true },
  { id: "ensure-base", pattern: /\bensure\b/gi, replacements: ["guarantee"], category: "ai-word", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "ensures", pattern: /\bensures\b/gi, replacements: ["guarantees"], category: "ai-word", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "ensured", pattern: /\bensured\b/gi, replacements: ["guaranteed"], category: "ai-word", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "ensuring", pattern: /\bensuring\b/gi, replacements: ["guaranteeing"], category: "ai-word", probability: 0.8, reason: "Simplified formal vocabulary" },
  { id: "prioritize", pattern: /\bprioritiz(?:e|es|ed|ing)\b/gi, replacements: ["focus on"], category: "ai-word", probability: 0.7, reason: "Replaced an AI-favoured verb", verb: true },
  { id: "cultivate", pattern: /\bcultivat(?:e|es|ed|ing)\b/gi, replacements: ["develop", "nurture"], category: "ai-word", probability: 0.85, reason: "Replaced an AI-favoured verb", verb: true },
  { id: "ever-evolving", pattern: /\bever-evolving\b/gi, replacements: ["changing", "shifting"], category: "cliche", probability: 1, reason: "Replaced a stock AI phrase" },
  { id: "mitigate", pattern: /\bmitigat(?:e|es|ed|ing)\b/gi, replacements: ["reduce", "limit"], category: "formal", probability: 0.7, reason: "Simplified formal vocabulary", verb: true },
  { id: "proliferation", pattern: /\bproliferation of\b/gi, replacements: ["spread of", "growth of"], category: "formal", probability: 0.95, reason: "Simplified formal vocabulary" },
  { id: "democratize", pattern: /\bdemocratiz(?:e|es|ed|ing)\b/gi, replacements: ["open up"], category: "cliche", probability: 0.85, reason: "Replaced a tech cliché", verb: true },
  { id: "unprecedented-levels", pattern: /\bunprecedented levels of\b/gi, replacements: ["record levels of"], category: "cliche", probability: 1, reason: "Replaced inflated language" },
  { id: "unprecedented", pattern: /\bunprecedented\b/gi, replacements: ["unusual", "extraordinary"], category: "cliche", probability: 1, reason: "Replaced inflated language" },
];

export function matchCase(source: string, replacement: string): string {
  if (!replacement) return replacement;
  if (source === source.toUpperCase() && source.length > 1) {
    return replacement.toUpperCase();
  }
  const firstLetter = source.match(/[A-Za-z]/);
  if (firstLetter && firstLetter[0] === firstLetter[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function inflect(source: string, replacement: string): string {
  if (replacement.includes(" ")) {
    const parts = replacement.split(" ");
    parts[0] = inflectWord(source, parts[0]!);
    return parts.join(" ");
  }
  return inflectWord(source, replacement);
}

function inflectWord(source: string, replacement: string): string {
  const lower = source.toLowerCase();
  if (lower.endsWith("ing")) {
    if (replacement.endsWith("ie")) return replacement.slice(0, -2) + "ying";
    if (replacement.endsWith("e")) return replacement.slice(0, -1) + "ing";
    if (replacement.length <= 4 && /[bcdfghjklmnpqrstvwxz]$/.test(replacement)) {
      return replacement + replacement.slice(-1) + "ing";
    }
    return replacement + "ing";
  }
  if (lower.endsWith("ied")) return replacement.replace(/y$/, "") + "ied";
  if (lower.endsWith("ed")) {
    if (replacement.endsWith("e")) return replacement + "d";
    if (replacement.endsWith("y")) return replacement.slice(0, -1) + "ied";
    return replacement + "ed";
  }
  if (lower.endsWith("ies")) return replacement.replace(/y$/, "") + "ies";
  if (lower.endsWith("s") && !lower.endsWith("ss")) {
    if (replacement.endsWith("s") || replacement.endsWith("sh") || replacement.endsWith("ch") || replacement.endsWith("x")) {
      return replacement + "es";
    }
    if (replacement.endsWith("y")) return replacement.slice(0, -1) + "ies";
    return replacement + "s";
  }
  return replacement;
}

export function applyLexicon(
  text: string,
  style: HumanizerStyle,
  strength: number,
  rng: Rng,
): { text: string; reasons: Set<string> } {
  let output = text;
  const reasons = new Set<string>();
  const multiplier = 0.55 + strength * 0.09;

  for (const entry of LEXICON) {
    if (entry.styles && !entry.styles.includes(style)) continue;
    if (style === "academic" && entry.category === "cliche") continue;
    const probability = Math.min(1, entry.probability * multiplier);
    output = output.replace(entry.pattern, (match, ...args) => {
      if (!rng.chance(probability)) return match;
      const replacement = rng.pick(entry.replacements);
      reasons.add(entry.reason);
      if (replacement.includes("$1")) {
        // Group-aware replacements are applied directly by String.replace.
        return replacement.replace(/\$(\d)/g, (_m, n) => String(args[Number(n) - 1] ?? ""));
      }
      const adjusted = entry.verb ? inflect(match, replacement) : replacement;
      return matchCase(match, adjusted);
    });
  }
  return { text: output, reasons };
}
