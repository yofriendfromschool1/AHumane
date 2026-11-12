import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — AHumane",
  description: "The terms that govern your use of AHumane's free writing tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="py-14">
      <div className="container-page mx-auto max-w-3xl prose-ahumane">
        <p className="eyebrow not-prose">Legal</p>
        <h1 className="display mt-3 text-[2.4rem] sm:text-[3.2rem]">Terms of Use</h1>
        <p className="mt-4 text-sm text-slate-600">Last updated: October 14, 2026</p>

        <p>
          These terms govern your use of AHumane (the “Service”), a free, self-hostable writing
          toolkit. By using the Service, you agree to these terms. If you do not agree, do not use
          the Service.
        </p>

        <h2>1. The Service is free software</h2>
        <p>
          AHumane is provided as free software. There is no subscription, no seat fee, and no paid
          tier. If you self-host the Service, you are responsible for your infrastructure, security,
          backups, and any third-party model or API costs.
        </p>

        <h2>2. No account required</h2>
        <p>
          Most features work without an account. The login page is a local demo and does not create
          a hosted identity. You are responsible for the security of your own device and browser
          storage.
        </p>

        <h2 id="acceptable-use">3. Acceptable use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>violate any law, regulation, or institutional policy;</li>
          <li>infringe copyright, trademark, privacy, or other rights;</li>
          <li>misrepresent authorship in a context where disclosure is required;</li>
          <li>generate harassment, fraud, malware, or content that harms a person;</li>
          <li>attack, overload, or attempt to gain unauthorized access to the Service or another system.</li>
        </ul>
        <p>
          You are responsible for complying with the rules of your school, employer, publisher, or
          client, including any policy on AI-assisted writing and disclosure.
        </p>

        <h2>4. Your content</h2>
        <p>
          You retain ownership of the text you submit. You grant the operator only the limited
          permission needed to process that text and return a result. The Service does not claim a
          license to publish, sell, or train on your content.
        </p>

        <h2>5. AI output and detector scores</h2>
        <p>
          The Service uses statistical and rule-based methods. Output may be inaccurate, awkward,
          or unsuitable for your context. Detector scores are estimates, not statements of fact,
          and may produce false positives or false negatives. You must review all output before
          using it. The Service does not guarantee that any text will pass any detector or
          plagiarism check.
        </p>

        <h2>6. Privacy</h2>
        <p>
          The Service is designed to keep your text on your own infrastructure. History and
          documents are stored in your browser. If you connect a third-party model or enable the
          Wikipedia plagiarism comparison, limited data may be sent to those services under their
          terms. See the <a href="/privacy">Privacy Policy</a> for details.
        </p>

        <h2>7. Availability and changes</h2>
        <p>
          The Service is provided “as is” and “as available,” without warranties of any kind. The
          operator may change, suspend, or discontinue features at any time. Because the software
          is self-hosted, no central uptime commitment is made.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, the operator and contributors are not liable for
          indirect, incidental, special, consequential, or punitive damages, or for any loss of
          data, profits, or opportunity, arising from your use of the Service. Your sole remedy is
          to stop using the Service.
        </p>

        <h2>9. Intellectual property</h2>
        <p>
          The AHumane name, logo, and original site content are the property of their respective
          owners. The software may be distributed under the license included in the repository.
          Third-party names such as ChatGPT, Claude, GPTZero, Turnitin, and Wikipedia are trademarks
          of their owners and are used only for identification.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:hello@ahumane.app">hello@ahumane.app</a>.
        </p>
      </div>
    </article>
  );
}
