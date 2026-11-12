export const SITE = {
  name: "AHumane",
  domain: "ahumane.app",
  tagline: "Writing that sounds like you.",
  description:
    "A free AI humanizer, detector, and writing studio. No account, no word caps, no paywall.",
  email: "hello@ahumane.app",
  supportEmail: "help@ahumane.app",
  announcement: {
    label: "Free forever. No account, no word cap.",
    cta: "See pricing",
    href: "/pricing",
  },
};

export const PRODUCT_NAV = [
  {
    href: "/ai-humanizer",
    label: "AI Humanizer",
    description: "Turn AI text into natural writing.",
    icon: "sparkles",
  },
  {
    href: "/ai-detector",
    label: "AI Detector",
    description: "See the signals behind the score.",
    icon: "scan",
  },
  {
    href: "/plagiarism-checker",
    label: "Plagiarism Checker",
    description: "Find copied passages and sources.",
    icon: "file-search",
  },
  {
    href: "/chrome",
    label: "Chrome Extension",
    description: "Humanize text without switching tabs.",
    icon: "chrome",
  },
] as const;

export const MAIN_NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How it works" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Products",
    links: [
      { href: "/ai-humanizer", label: "AI Humanizer" },
      { href: "/ai-detector", label: "AI Detector" },
      { href: "/plagiarism-checker", label: "Plagiarism Checker" },
      { href: "/chrome", label: "Chrome Extension" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "mailto:help@ahumane.app", label: "Support" },
      { href: "/help", label: "Help Center" },
      { href: "/status", label: "Status" },
      { href: "/studio", label: "Open Studio" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Use" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms#acceptable-use", label: "Acceptable Use" },
    ],
  },
] as const;

export const PERSONAS = [
  {
    title: "Writers",
    body: "Turn AI drafts into prose that keeps your voice, your rhythm, and your point of view.",
    accent: "blue",
    icon: "pen",
  },
  {
    title: "Marketers",
    body: "Make campaign copy, emails, and social posts sound like a person wrote them. Because one did.",
    accent: "amber",
    icon: "megaphone",
  },
  {
    title: "Students & researchers",
    body: "Clean up AI-assisted notes and drafts while keeping every citation, number, and claim intact.",
    accent: "emerald",
    icon: "book",
  },
];

export const SAMPLE_RESULTS = [
  {
    before:
      "In today's fast-paced digital landscape, artificial intelligence has emerged as a pivotal force that is fundamentally reshaping the way we work.",
    after:
      "AI is changing how we work. That sounds obvious, but the day-to-day shift is stranger than the headlines suggest.",
    label: "AI → human, natural",
  },
  {
    before:
      "It is important to note that the implementation of robust data governance frameworks is crucial for organizations seeking to leverage analytics effectively.",
    after:
      "If you want analytics to be useful, start with data governance. Without it, every dashboard becomes a debate about whose numbers are right.",
    label: "AI → human, professional",
  },
  {
    before:
      "The analysis of the results demonstrates a significant correlation between the variables, underscoring the importance of further research.",
    after:
      "The results show a clear correlation between the two variables. That is a reason to keep digging, not a reason to stop.",
    label: "AI → human, academic",
  },
];

export const HOME_FAQS = [
  {
    q: "Is AHumane really free?",
    a: "Yes. Every tool on this site — including the Pro Humanizer, the AI detector, the plagiarism checker, and the writer — is free to use without an account. There is no word cap, no watermark, and no paywalled “Pro” button. The code runs on your own machine or server, so you are not paying for a subscription.",
  },
  {
    q: "Is AHumane affiliated with another humanizer?",
    a: "No. AHumane is an independent, self-hosted project. It is not affiliated with, endorsed by, or built from any other humanizer's code, prompts, or assets.",
  },
  {
    q: "How is the Pro Humanizer different from Basic?",
    a: "Basic is the local four-pass engine: it strips AI-favoured phrases, tightens filler, adds contractions, and varies rhythm. Pro adds Deep rewrite, which sends the draft to a real language model for a semantic rewrite, checks every protected fact, and then runs a second editorial pass. Both are free. Turn Deep rewrite off to keep Pro local-only.",
  },
  {
    q: "Is my text private?",
    a: "History and documents stay in your browser, and the reference server does not log your drafts. Pro's Deep rewrite sends the draft to a free public model endpoint for rewriting; switch Deep rewrite off to keep processing local. The plagiarism checker sends only short search shingles to Wikipedia, never your full document.",
  },
  {
    q: "Will this guarantee I pass an AI detector?",
    a: "No, and be suspicious of anyone who promises that. AI detectors are probabilistic and frequently wrong, especially on formal or non-native writing. AHumane is built to make writing read more naturally and to show you the signals that detectors look for. Use the result as a draft, not a certificate.",
  },
  {
    q: "Which languages are supported?",
    a: "English gets the full lexicon and rhythm engine. Spanish, French, German, Portuguese, Italian, and Dutch get structural cleanup in the browser. If you connect an OpenAI-compatible or local model, you can work in 100+ languages.",
  },
  {
    q: "Do I need an account?",
    a: "No. Open the studio and start writing. The login page exists for people who want a named workspace, but it is a local demo and never blocks the tools.",
  },
];

export const STATS = [
  { value: "0", label: "paywalls" },
  { value: "0", label: "word caps" },
  { value: "7", label: "built-in languages" },
  { value: "100%", label: "local history" },
];

export const TOOL_MARQUEE = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Grok",
  "DeepSeek",
  "Copilot",
  "Perplexity",
  "Grammarly",
  "QuillBot",
  "Notion AI",
];
