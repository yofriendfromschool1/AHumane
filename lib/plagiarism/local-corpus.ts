export interface CorpusSource {
  id: string;
  title: string;
  url: string;
  kind: "book" | "speech" | "document" | "reference";
  text: string;
}

export const LOCAL_CORPUS: CorpusSource[] = [
  {
    id: "darwin-origin",
    title: "On the Origin of Species — Charles Darwin",
    url: "https://www.gutenberg.org/ebooks/1228",
    kind: "book",
    text: `When on board H.M.S. Beagle, as naturalist, I was much struck with certain facts in the distribution of the inhabitants of South America, and in the geological relations of the present to the past inhabitants of that continent. These facts seemed to me to throw some light on the origin of species that mystery of mysteries, as it has been called by one of our greatest philosophers. On my return home, it occurred to me, after much consideration, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts which could possibly have any bearing on it.`,
  },
  {
    id: "thoreau-walden",
    title: "Walden — Henry David Thoreau",
    url: "https://www.gutenberg.org/ebooks/205",
    kind: "book",
    text: `I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary. I wanted to live deep and suck out all the marrow of life, to live so sturdily and Spartan-like as to put to rout all that was not life.`,
  },
  {
    id: "austen-pride",
    title: "Pride and Prejudice — Jane Austen",
    url: "https://www.gutenberg.org/ebooks/1342",
    kind: "book",
    text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.`,
  },
  {
    id: "melville-moby",
    title: "Moby-Dick — Herman Melville",
    url: "https://www.gutenberg.org/ebooks/2701",
    kind: "book",
    text: `Call me Ishmael. Some years ago never mind how long precisely having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off then, I account it high time to get to sea as soon as I can.`,
  },
  {
    id: "gettysburg",
    title: "The Gettysburg Address — Abraham Lincoln",
    url: "https://www.loc.gov/item/2002695537/",
    kind: "speech",
    text: `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live.`,
  },
  {
    id: "dickens-tale",
    title: "A Tale of Two Cities — Charles Dickens",
    url: "https://www.gutenberg.org/ebooks/98",
    kind: "book",
    text: `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`,
  },
  {
    id: "shakespeare-hamlet",
    title: "Hamlet — William Shakespeare",
    url: "https://www.gutenberg.org/ebooks/1524",
    kind: "book",
    text: `To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them. To die, to sleep No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd.`,
  },
  {
    id: "common-ai-boilerplate",
    title: "Common AI boilerplate (reference)",
    url: "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing",
    kind: "reference",
    text: `In today's rapidly evolving digital landscape, it is important to note that organizations must leverage robust frameworks to unlock the full potential of their teams. Moreover, the implementation of comprehensive strategies facilitates seamless collaboration and fosters a culture of continuous improvement. Consequently, stakeholders should prioritize actionable insights that align with best practices and drive meaningful outcomes across the organization.`,
  },
];

export function findInLocalCorpus(text: string): Array<{
  source: CorpusSource;
  overlap: number;
  matchedText: string;
}> {
  const { shingles, words } = buildShingles(text);
  if (shingles.length === 0) return [];

  return LOCAL_CORPUS.map((source) => {
    const sourceShingles = buildShingles(source.text).shingles;
    const set = new Set(sourceShingles);
    const matched = shingles.filter((shingle) => set.has(shingle));
    const overlap = matched.length / Math.max(1, words.length - 7);
    return { source, overlap, matchedText: matched[0] ?? "" };
  })
    .filter((match) => match.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 5);
}

export function buildShingles(text: string): { shingles: string[]; words: string[] } {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const size = 8;
  const shingles: string[] = [];
  for (let i = 0; i <= words.length - size; i++) {
    shingles.push(words.slice(i, i + size).join(" "));
  }
  return { shingles, words };
}

export function distinctivePhrases(text: string, count = 4): string[] {
  const { shingles } = buildShingles(text);
  if (!shingles.length) return [];
  const scored = shingles
    .map((shingle) => ({
      shingle,
      score: shingle.split(" ").filter((word) => word.length > 5).length,
    }))
    .sort((a, b) => b.score - a.score);
  const phrases: string[] = [];
  for (const item of scored) {
    if (phrases.some((phrase) => phrase.includes(item.shingle) || item.shingle.includes(phrase))) {
      continue;
    }
    phrases.push(item.shingle);
    if (phrases.length >= count) break;
  }
  return phrases;
}
