import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

const editorialTeam = [
  {
    role: "Markets Editor",
    desk: "Energy desk",
    responsibility:
      "Daily review of crude, gasoline, natural gas, and equity data; sanity-check thresholds for the news ticker.",
  },
  {
    role: "Geopolitics Analyst",
    desk: "Conflict desk",
    responsibility:
      "GDELT triage, conflict-event categorisation, and the timeline on the Conflict Map page.",
  },
  {
    role: "Maritime Analyst",
    desk: "Hormuz desk",
    responsibility:
      "AIS vessel-tracking, Hormuz blockade status, and the alternative shipping routes table.",
  },
  {
    role: "Standards Editor",
    desk: "Editorial",
    responsibility:
      "Corrections log, source attribution, and the editorial-policy checks before any explainer is published.",
  },
];

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Crisis Watch",
  url: "https://crisiswatch.ca/about",
  description:
    "How Crisis Watch tracks the Iran-US conflict in real time. Data sources, refresh cadence, methodology, editorial policy, and contact information.",
  publisher: {
    "@type": "Organization",
    "@id": "https://crisiswatch.ca/#organization",
    name: "Crisis Watch",
    url: "https://crisiswatch.ca",
    email: "contact@crisiswatch.ca",
    logo: {
      "@type": "ImageObject",
      url: "https://crisiswatch.ca/icon",
    },
    member: editorialTeam.map((m) => ({
      "@type": "Role",
      roleName: m.role,
      member: {
        "@type": "OrganizationRole",
        name: m.desk,
      },
      description: m.responsibility,
    })),
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 animate-slide-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />

      <header>
        <h1 className="text-3xl font-bold tracking-tight">About Crisis Watch</h1>
        <p className="mt-2 text-sm text-muted-light">
          A real-time, independently operated dashboard tracking the Iran-US
          conflict and its global ripple effects.
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed text-muted-light">
        <p>
          Crisis Watch (<span className="text-foreground font-medium">crisiswatch.ca</span>)
          is an independent, free-to-use crisis monitoring platform launched in
          early 2026 to give the public direct access to the same data feeds that
          financial analysts, journalists, and policy researchers rely on. We
          aggregate and visualize publicly available data from established news
          wires, market data providers, and open conflict-event datasets so that
          anyone can understand the situation in real time.
        </p>
        <p>
          The site is built and maintained by a small independent team. We are
          not affiliated with any government, political party, news organization,
          or financial institution. We do not accept payment for editorial
          coverage. See our{" "}
          <Link href="/privacy" className="text-accent-blue hover:underline">
            Privacy Policy
          </Link>{" "}
          for full disclosure of what we collect and why.
        </p>
      </section>

      <Section title="Our Mission">
        <p>
          During fast-moving crises, accurate information is fragmented across
          dozens of news sites, market terminals, and government feeds. Crisis
          Watch consolidates that information into a single, live dashboard that
          updates around the clock — so a parent checking gas prices, a small
          business owner watching shipping rates, and a researcher tracking
          escalation can all start from the same factual baseline.
        </p>
      </Section>

      <Section title="Data Sources">
        <p>
          Every figure on Crisis Watch comes from a publicly attributable
          third-party source. We do not generate original reporting. Our
          confirmed sources are:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border text-left text-foreground">
                <th className="pb-2 pr-4 font-semibold">Source</th>
                <th className="pb-2 pr-4 font-semibold">Data Provided</th>
                <th className="pb-2 font-semibold">Refresh</th>
              </tr>
            </thead>
            <tbody className="text-muted-light">
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">Yahoo Finance</td>
                <td className="py-2 pr-4">
                  Brent / WTI crude, gasoline, natural gas, gold, wheat, copper,
                  defense and energy stock quotes
                </td>
                <td className="py-2">60 seconds</td>
              </tr>
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">GDELT</td>
                <td className="py-2 pr-4">
                  Global news events, conflict-event coding, source attribution
                </td>
                <td className="py-2">3 minutes</td>
              </tr>
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">Reuters / AP</td>
                <td className="py-2 pr-4">
                  Wire-service breaking news referenced in our live blog feed
                </td>
                <td className="py-2">Continuous</td>
              </tr>
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">Al Jazeera</td>
                <td className="py-2 pr-4">
                  Regional Middle East coverage and analysis
                </td>
                <td className="py-2">Continuous</td>
              </tr>
              <tr className="border-b border-card-border/50">
                <td className="py-2 pr-4">NASA FIRMS</td>
                <td className="py-2 pr-4">
                  Active fire / hotspot detections in the Middle East theater
                  (used as a corroborating signal for kinetic activity)
                </td>
                <td className="py-2">Hourly</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">MarineTraffic / AIS</td>
                <td className="py-2 pr-4">
                  Vessel positions and rerouting patterns near the Strait of
                  Hormuz
                </td>
                <td className="py-2">Continuous</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          When data from these sources conflicts, we display the most recent
          numeric value and label the source. We do not silently average or
          smooth competing figures.
        </p>
      </Section>

      <Section title="Update Cadence">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-foreground">Market data</strong> — refreshed
            every 60 seconds during market hours, last-known close otherwise.
          </li>
          <li>
            <strong className="text-foreground">Live blog</strong> — refreshed
            every 3 minutes from GDELT.
          </li>
          <li>
            <strong className="text-foreground">Conflict timeline & strait
            status</strong> — re-validated hourly against wire reports.
          </li>
          <li>
            <strong className="text-foreground">Evergreen explainer
            articles</strong> — updated when underlying facts change. Each
            article carries a visible <code>dateModified</code>.
          </li>
        </ul>
      </Section>

      <Section title="Editorial Policy">
        <p>
          Crisis Watch is built around three editorial commitments:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 mt-3">
          <li>
            <strong className="text-foreground">Attribution.</strong> Every
            non-trivial claim is traceable to a public source. We link out
            wherever feasible.
          </li>
          <li>
            <strong className="text-foreground">Correction.</strong> Errors are
            corrected in place with a visible note. We do not silently re-write
            history. Material corrections are flagged in the live blog.
          </li>
          <li>
            <strong className="text-foreground">No financial advice.</strong>{" "}
            Our market data is informational only. Crisis Watch is not an
            investment advisor and nothing on this site constitutes a
            recommendation to buy, sell, or hold any security.
          </li>
        </ol>
      </Section>

      <Section title="What We Cover">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <Link href="/" className="text-accent-blue hover:underline">
              Conflict Overview
            </Link>{" "}
            — day counter, headline market figures, breaking-news ticker.
          </li>
          <li>
            <Link href="/hormuz" className="text-accent-blue hover:underline">
              Strait of Hormuz Tracker
            </Link>{" "}
            — IRGC blockade status, ship rerouting, oil-flow disruption.
          </li>
          <li>
            <Link href="/conflict-map" className="text-accent-blue hover:underline">
              Conflict Map &amp; Timeline
            </Link>{" "}
            — geolocated strikes, retaliations, diplomatic milestones.
          </li>
          <li>
            <Link href="/oil-energy" className="text-accent-blue hover:underline">
              Oil &amp; Energy
            </Link>{" "}
            — Brent, WTI, natural gas, gold, defense and energy equities.
          </li>
          <li>
            <Link href="/impact" className="text-accent-blue hover:underline">
              War Impact
            </Link>{" "}
            — gas prices by state, flight disruptions, shipping delays, ZIP-code
            impact calculator.
          </li>
          <li>
            <Link href="/blog" className="text-accent-blue hover:underline">
              Live Blog
            </Link>{" "}
            — auto-updating headline feed plus permanent explainer articles.
          </li>
        </ul>
      </Section>

      <Section title="Editorial Team">
        <p>
          Crisis Watch is staffed by a small team operating four editorial
          desks. We do not currently publish individual bylines for safety and
          operational reasons during this conflict, but every figure on the
          site is traceable to a named public source via the methodology table
          above. Corrections and source tips reach the team via{" "}
          <span className="text-foreground font-medium">
            contact@crisiswatch.ca
          </span>
          .
        </p>
        <ul className="mt-4 space-y-3">
          {editorialTeam.map((m) => (
            <li key={m.role} className="flex flex-col">
              <span className="text-foreground font-semibold text-[15px]">
                {m.role}{" "}
                <span className="text-muted-light font-normal text-xs">
                  · {m.desk}
                </span>
              </span>
              <span className="text-[13px] mt-0.5">{m.responsibility}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Independence">
        <p>
          Crisis Watch is not paid by any government, political action
          committee, news organization, or financial firm. The site is
          self-funded by its operators. If we ever take outside funding (grants,
          sponsorships, investment, advertising), we will disclose it on this
          page before any change to the site.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions, corrections, source tips, and press inquiries are welcome:
        </p>
        <p className="mt-2 text-foreground font-medium">contact@crisiswatch.ca</p>
        <p className="mt-3">
          For corrections, please include the URL of the page in question and
          (where possible) a citation for the corrected figure. We aim to
          acknowledge corrections within 24 hours.
        </p>
      </Section>
    </div>
  );
}

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
