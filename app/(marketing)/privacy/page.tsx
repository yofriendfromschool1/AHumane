import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AHumane",
  description: "How AHumane handles your text, browser storage, and optional third-party services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="py-14">
      <div className="container-page mx-auto max-w-3xl prose-ahumane">
        <p className="eyebrow not-prose">Legal</p>
        <h1 className="display mt-3 text-[2.4rem] sm:text-[3.2rem]">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-600">Last updated: October 14, 2026</p>

        <p>
          AHumane is built to keep your writing private. This policy explains what is processed,
          where it goes, and what choices you have. It applies to the self-hosted AHumane
          application and this website.
        </p>

        <h2>1. What we process</h2>
        <p>
          When you use the humanizer or detector, the text you submit is sent to the server that
          hosts your AHumane instance so it can be processed. The reference implementation does not
          log request bodies, does not write your text to a database, and does not use it for model
          training.
        </p>
        <p>
          Pro mode enables <strong>Deep rewrite</strong> by default. In that mode the draft is sent
          from your server to a free public model endpoint (currently an OVHcloud AI endpoint) for
          rewriting. That third party may process or retain prompts under its own terms. Switch
          Deep rewrite off to keep the draft on your own server and use the local engine.
        </p>
        <p>
          If you connect a local model, the text is sent only to that model endpoint. If the
          operator connects a third-party model provider, that provider's terms and privacy policy
          also apply.
        </p>

        <h2>2. Browser storage</h2>
        <p>
          History, documents, theme preference, and the optional demo session are stored in your
          browser's local storage or cookies. They are not uploaded to a central account. Clearing
          site data removes them. Private windows usually discard them when closed.
        </p>

        <h2>3. Plagiarism checks</h2>
        <p>
          The local plagiarism corpus is checked entirely on the server. If you enable the optional
          Wikipedia comparison, up to a few short phrases (eight-word shingles) are sent to the
          English Wikipedia API to find candidate sources. Your full document is never sent. The
          results are cached in memory for a short time and are not stored.
        </p>

        <h2>4. Cookies</h2>
        <p>
          The reference implementation uses a single optional cookie for the local demo session.
          It is HttpOnly, SameSite=Lax, and contains only a display name and email you provide. It
          is not used for advertising or cross-site tracking. The marketing site does not load
          third-party analytics or advertising pixels.
        </p>

        <h2>5. Server logs</h2>
        <p>
          A hosting provider may collect standard request metadata (IP address, user agent,
          timestamp, status code) for security and operations. The AHumane application itself does
          not log the content of your drafts. Operators should configure their infrastructure to
          avoid retaining request bodies.
        </p>

        <h2>6. Third-party services</h2>
        <p>
          If enabled by the operator, AHumane may send text to a model provider (for example, a
          local Ollama instance or an OpenAI-compatible endpoint) and short search phrases to
          Wikipedia. Those services have their own policies. The reference deployment has no
          advertising, analytics, or tracking integrations.
        </p>

        <h2>7. Children</h2>
        <p>
          The Service is not directed at children under 13, and the operator does not knowingly
          collect personal information from them. If you are a minor, use the Service with the
          permission and supervision of a parent, guardian, or teacher.
        </p>

        <h2>8. Your choices</h2>
        <ul>
          <li>Clear history and documents from the Studio settings or your browser's site data.</li>
          <li>Use the Service without signing in.</li>
          <li>Disable the Wikipedia comparison before running a plagiarism check.</li>
          <li>Self-host the Service and control all data flows yourself.</li>
        </ul>

        <h2>9. Changes</h2>
        <p>
          This policy may be updated as the software changes. The date at the top reflects the
          most recent revision. Material changes will be noted in the repository and, where
          appropriate, on the site.
        </p>

        <h2>10. Contact</h2>
        <p>
          Privacy questions: <a href="mailto:hello@ahumane.app">hello@ahumane.app</a>.
        </p>
      </div>
    </article>
  );
}
