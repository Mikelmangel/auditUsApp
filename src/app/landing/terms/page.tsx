import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#111827] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-[#4338CA] flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-extrabold text-white text-lg">AuditUs</span>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-[#7F65D0] mt-2">Last updated: May 2, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose-light space-y-8 text-base">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using AuditUs, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>AuditUs is a social polling app where friend groups answer daily questions and view aggregated results. The service includes point systems, streaks, leaderboards, and AI-generated summaries. The free version includes advertisements.</p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <ul>
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must be at least 16 years old to use AuditUs</li>
              <li>One account per person; sharing accounts is prohibited</li>
            </ul>
          </section>

          <section>
            <h2>4. Group Conduct</h2>
            <p>When creating or joining groups:</p>
            <ul>
              <li>Use your real identity — no impersonation</li>
              <li>Do not create groups for harassment or bullying</li>
              <li>Respect other members&apos; answers and opinions</li>
              <li>Group admins may remove members at their discretion</li>
            </ul>
          </section>

          <section>
            <h2>5. Content and Questions</h2>
            <p>You may submit questions to your groups. Questions must not:</p>
            <ul>
              <li>Contain hate speech, discrimination, or threats</li>
              <li>Exploit or target minors</li>
              <li>Promote illegal activities</li>
              <li>Be excessively personal about non-consenting individuals</li>
            </ul>
            <p>AuditUs reserves the right to remove content that violates these rules.</p>
          </section>

          <section>
            <h2>6. Points and Streaks</h2>
            <p>Points and streaks are earned through regular participation. They have no monetary value and cannot be transferred. AuditUs may reset or modify point systems at any time with reasonable notice.</p>
          </section>

          <section>
            <h2>7. Advertising</h2>
            <p>The free version of AuditUs displays advertisements. Ad behavior is controlled by Google AdMob. AuditUs is not responsible for the content of third-party advertisements.</p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>You retain ownership of content you create. By posting questions or answers, you grant AuditUs a license to use, store, and display that content in connection with the service.</p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>We may suspend or terminate accounts that violate these terms or engage in harmful behavior. You may delete your account at any time through the app or by contacting support.</p>
          </section>

          <section>
            <h2>10. Disclaimers</h2>
            <p>AuditUs is provided &ldquo;as is&rdquo; without warranties. We do not guarantee uninterrupted service, error-free content, or specific outcomes from using the app.</p>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>AuditUs is not liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to amounts you have paid us, if any.</p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>We may update these terms at any time. We will notify users of significant changes via email or app notification. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2>13. Contact</h2>
            <p>For questions about these terms, contact:<br />legal@auditus.fun</p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#14726e]/10">
          <Link href="/landing" className="text-[#14726e] font-bold hover:underline">
            &larr; Back to AuditUs
          </Link>
        </div>
      </main>
    </div>
  );
}