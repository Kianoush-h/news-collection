export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 animate-slide-in">
      {/* Page heading */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-light">
          Effective date: April 12, 2026 &middot; Last updated: April 12, 2026
        </p>
      </header>

      {/* Intro */}
      <section className="space-y-3 text-sm leading-relaxed text-muted-light">
        <p>
          Crisis Watch (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates the website{" "}
          <span className="text-foreground font-medium">crisiswatch.ca</span>.
          This page explains what information we collect, how we use it, and
          your choices regarding that information.
        </p>
      </section>

      {/* Sections */}
      <Section title="1. Information We Collect">
        <p>We do not require you to create an account or provide personal information to use Crisis Watch. The information we collect is limited to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-3">
          <li>
            <strong className="text-foreground">Usage data</strong> &mdash;
            pages visited, time on site, referral source, browser type, device
            type, and approximate geographic location (country/region level).
            This is collected automatically via Google Analytics.
          </li>
          <li>
            <strong className="text-foreground">ZIP / postal code</strong>{" "}
            &mdash; only if you voluntarily enter it into the Impact Calculator.
            This data is processed locally in your browser and is{" "}
            <em>never</em> sent to our servers.
          </li>
        </ul>
      </Section>

      <Section title="2. How We Use Information">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Understand which content and features are most useful.</li>
          <li>Monitor site performance and diagnose technical issues.</li>
          <li>Improve the accuracy and relevance of our dashboards.</li>
        </ul>
        <p className="mt-3">
          We do <strong className="text-foreground">not</strong> sell, rent, or
          share your personal data with third parties for marketing purposes.
        </p>
      </Section>

      <Section title="3. Cookies &amp; Tracking Technologies">
        <p>Crisis Watch uses the following cookies and tracking technologies:</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border text-left text-foreground">
                <th className="pb-2 pr-4 font-semibold">Technology</th>
                <th className="pb-2 pr-4 font-semibold">Provider</th>
                <th className="pb-2 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-muted-light">
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">Google Analytics</td>
                <td className="py-2 pr-4">Google</td>
                <td className="py-2">Anonymized site usage analytics</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Essential cookies</td>
                <td className="py-2 pr-4">Crisis Watch</td>
                <td className="py-2">
                  Remembering your preferences (e.g., menu state)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          You can disable cookies in your browser settings. Note that some
          features may not work correctly without cookies enabled.
        </p>
      </Section>

      <Section title="4. Third-Party Data Sources">
        <p>
          Our dashboards aggregate publicly available data from third-party
          sources including Reuters, Associated Press, GDELT, Yahoo Finance, and
          Al Jazeera. We do not control or take responsibility for the content or
          accuracy of third-party data. Crisis Watch is for informational
          purposes only and should not be considered financial or legal advice.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          Google Analytics data is retained for 14 months and is then
          automatically deleted. We do not maintain any personal data
          databases of our own.
        </p>
      </Section>

      <Section title="6. Children&apos;s Privacy">
        <p>
          Crisis Watch is not directed at children under 13. We do not knowingly
          collect personal information from children. If you believe a child has
          provided us with personal data, please contact us so we can remove it.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-3">
          <li>Access the personal data we hold about you.</li>
          <li>Request deletion of your data.</li>
          <li>Opt out of analytics tracking (via browser settings).</li>
          <li>Lodge a complaint with a data protection authority.</li>
        </ul>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date. Your
          continued use of the site after changes constitutes acceptance of the
          revised policy.
        </p>
      </Section>

      <Section title="9. Contact Us">
        <p>
          If you have questions about this Privacy Policy, you can reach us at:
        </p>
        <p className="mt-2 text-foreground font-medium">
          contact@crisiswatch.ca
        </p>
      </Section>
    </div>
  );
}

/* ── Reusable section wrapper ── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-light">{children}</div>
    </section>
  );
}
