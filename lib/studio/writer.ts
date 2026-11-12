export type WriterKind = "blog" | "essay" | "email" | "outline" | "social";
export type WriterTone = "clear" | "warm" | "professional" | "direct";

export interface WriterOptions {
  prompt: string;
  kind: WriterKind;
  tone: WriterTone;
  sections: number;
}

function titleFromPrompt(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "");
  if (!cleaned) return "Untitled draft";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function generateDraft(options: WriterOptions): string {
  const { prompt, kind, tone, sections } = options;
  const title = titleFromPrompt(prompt);
  const shortPrompt = prompt.trim() || "the topic";
  const toneLine =
    tone === "warm"
      ? "Write like a person explaining something they care about, not like a brochure."
      : tone === "professional"
        ? "Keep it clear and useful. No hype, no filler."
        : tone === "direct"
          ? "Lead with the point. Cut anything that does not earn its place."
          : "Prefer concrete examples over abstract claims.";

  if (kind === "email") {
    return `Subject: ${title}

Hi [name],

${shortPrompt.charAt(0).toUpperCase()}${shortPrompt.slice(1)}. I wanted to share a short update and get your take.

Here is what changed:
• [Point one]
• [Point two]
• [Point three]

What I need from you: [specific ask, with a date].

Thanks,
[Your name]

---
Draft notes (delete before sending)
- Tone: ${tone}.
- ${toneLine}
- Replace every bracketed placeholder with a real detail.`;
  }

  if (kind === "social") {
    return `${title}

Most people get this wrong: [the common assumption].

Here is what actually happens:
1. [Specific observation]
2. [Why it matters]
3. [What to do instead]

The part nobody mentions: [the honest caveat].

What would you add?

---
Draft notes (delete before posting)
- Tone: ${tone}. ${toneLine}
- Keep it under 220 words unless the platform rewards length.`;
  }

  const sectionTitles = [
    "The short version",
    "Why this matters",
    "What most advice gets wrong",
    "A better way to think about it",
    "What to do next",
    "The trade-offs",
    "A concrete example",
    "What we still do not know",
  ].slice(0, Math.max(2, Math.min(8, sections)));

  if (kind === "outline") {
    return `# ${title}

Thesis: [one sentence that states the argument, not the topic]

Audience: [who this is for and what they already know]

## ${sectionTitles.join("\n\n## ")}

For each section:
- Claim: [the one thing the section proves]
- Evidence: [specific example, number, or source]
- Transition: [how it connects to the next section]

## Conclusion

Do not summarize. End on the most specific consequence of the argument.

---
Draft notes (delete before writing)
- Tone: ${tone}. ${toneLine}
- Research gaps to fill: [list them]`;
  }

  if (kind === "essay") {
    return `# ${title}

[Opening: start with a specific scene, fact, or tension. No throat-clearing.]

[Thesis: state the argument in one sentence. Make it contestable.]

## ${sectionTitles[0] ?? "First point"}

[Claim. Evidence. Analysis. The analysis is the part that makes it yours.]

## ${sectionTitles[1] ?? "Second point"}

[Claim. Evidence. A counterpoint. Answer it honestly.]

## ${sectionTitles[2] ?? "Third point"}

[The strongest objection. Concede what is true, then explain what it changes.]

## Conclusion

[Return to the opening image or fact. Show how the argument changes what it means. Do not repeat the thesis word for word.]

---
Draft notes (delete before submitting)
- Tone: ${tone}. ${toneLine}
- Keep the argument, sources, and citations. Add your own examples.`;
  }

  return `# ${title}

[Opening: a specific observation that earns the reader's attention. Avoid "in today's world."]

[Context: why this matters now, in one short paragraph.]

## ${sectionTitles[0] ?? "The main idea"}

[Explain the idea in plain language. Use one concrete example.]

## ${sectionTitles[1] ?? "What to do about it"}

[Give the reader something actionable. Be specific enough to try today.]

## ${sectionTitles[2] ?? "The caveat"}

[Name the trade-off. Acknowledge what this approach does not solve.]

## Conclusion

[End with a sentence that lands, not a summary.]

---
Draft notes (delete before publishing)
- Tone: ${tone}. ${toneLine}
- Add one detail only you could know.
- Check every number and claim before publishing.`;
}
