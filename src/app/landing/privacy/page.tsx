import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#111827] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/icon-192.png" alt="AuditUs" width={32} height={32} className="w-8 h-8 rounded-xl" />
              <span className="font-extrabold text-white text-lg">AuditUs</span>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-[#7F65D0] mt-2">Last updated: May 2, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose-light space-y-8 text-base">
          <section>
            <h2>1. Information We Collect</h2>
            <p>AuditUs collects information you provide directly, including:</p>
            <ul>
              <li><strong>Account information:</strong> Email address and profile details when you sign up.</li>
              <li><strong>Group data:</strong> Questions created, answers submitted, and group membership.</li>
              <li><strong>Usage data:</strong> How you interact with the app, including polls answered, streaks maintained, and features used.</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain the AuditUs service</li>
              <li>Track streaks, points, and leaderboard rankings</li>
              <li>Generate AI-powered audit summaries for your groups</li>
              <li>Display relevant advertisements through AdMob</li>
              <li>Communicate updates and notifications</li>
            </ul>
          </section>

          <section>
            <h2>3. Advertising</h2>
            <p>AuditUs displays advertisements through Google AdMob. These ads may collect data about your device and usage patterns to provide personalized advertising. You can control ad personalization through your device settings.</p>
            <p>Advertisers may receive limited data to serve non-personalized ads. AuditUs does not sell your personal information to advertisers.</p>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>We share your information only in these circumstances:</p>
            <ul>
              <li><strong>Group members:</strong> Your answers and scores are visible to other group members.</li>
              <li><strong>Service providers:</strong> With Supabase (our database), Google (AdMob), andGemini AI (summaries).</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect rights.</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>We retain your account data until you delete your account. You can request deletion at any time by contacting us. Some data may be retained for legal or fraud prevention purposes for up to 1 year after deletion.</p>
          </section>

          <section>
            <h2>6. Children&apos;s Privacy</h2>
            <p>AuditUs is not intended for users under 16. We do not knowingly collect data from children under 16. If we discover we have collected data from a child under 16, we will delete it immediately.</p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Object to processing</li>
              <li>Export your data</li>
            </ul>
            <p>To exercise these rights, email us at privacy@auditus.fun.</p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>For privacy concerns, contact:<br />privacy@auditus.fun</p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-indigo-100">
          <Link href="/landing" className="text-[#4338CA] font-bold hover:underline">
            &larr; Back to AuditUs
          </Link>
        </div>
      </main>
    </div>
  );
}