import Link from "next/link";
import type { ReactNode } from "react";

export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  category: "Explainer" | "Analysis" | "Reference";
  keywords: string[];
  body: () => ReactNode;
}

const dl = (href: string, label: string) => (
  <Link href={href} className="text-accent-blue hover:underline">
    {label}
  </Link>
);

export const articles: Article[] = [
  {
    slug: "strait-of-hormuz-oil-chokepoint",
    title:
      "Strait of Hormuz: Why It's the World's Most Critical Oil Chokepoint",
    description:
      "A definitive explainer on the Strait of Hormuz — why roughly 20% of global oil and a third of seaborne LNG passes through this 21-mile waterway, and why a closure is treated as a global economic emergency.",
    datePublished: "2026-04-15",
    dateModified: "2026-05-04",
    readingTime: "9 min read",
    category: "Explainer",
    keywords: [
      "Strait of Hormuz",
      "Hormuz oil chokepoint",
      "world oil chokepoint",
      "Persian Gulf shipping",
      "IRGC blockade",
      "global oil supply",
    ],
    body: () => (
      <>
        <p>
          The Strait of Hormuz is a 21-mile-wide waterway separating Iran from
          Oman&apos;s Musandam exclave. It is the only sea route from the
          Persian Gulf to the open ocean — which means every barrel of oil
          loaded in Saudi Arabia, the UAE, Kuwait, Qatar, Iraq, Bahrain, and
          Iran has to pass through it. Roughly one out of every five barrels of
          oil consumed worldwide travels through that narrow channel, alongside
          about a third of all seaborne liquefied natural gas (LNG). When
          headlines say a Strait closure would be a global economic emergency,
          this is why. You can follow the live blockade status on our{" "}
          {dl("/hormuz", "Strait of Hormuz tracker")} and watch the spillover
          effect on prices on the {dl("/oil-energy", "Oil & Energy dashboard")}.
        </p>

        <h2>Where exactly is the Strait?</h2>
        <p>
          At its narrowest point, the navigable shipping channel is just two
          miles wide in each direction — inbound and outbound — separated by a
          two-mile buffer. The channel hugs Omani waters on the southern side
          to keep clear of Iranian territorial claims to the north. Iran
          controls the long northern coastline, the islands of Greater and
          Lesser Tunb, and Abu Musa, all of which sit close to the shipping
          lanes. The Iranian coast is mountainous, deeply indented, and dotted
          with naval bases at Bandar Abbas, Bandar-e-Jask, and Chabahar, giving
          the Islamic Revolutionary Guard Corps (IRGC) Navy excellent shore-to-
          ship missile, mine-laying, and small-boat options.
        </p>

        <h2>How much oil actually moves through it?</h2>
        <p>
          Pre-conflict, the Strait carried about 20–21 million barrels of oil
          per day in liquid form, roughly 20% of global oil consumption and
          close to a third of all seaborne crude. On the gas side, Qatar — the
          world&apos;s second-largest LNG exporter — sends nearly all of its
          output through Hormuz. There is no full-volume bypass: Saudi Arabia
          operates the East-West Petroline (5 million bpd), and the UAE has the
          Habshan-Fujairah pipeline (~1.5 million bpd) that exits to the Gulf
          of Oman. Combined, those alternatives can replace less than a third
          of the Strait&apos;s daily flow.
        </p>

        <h2>Why a small chokepoint matters globally</h2>
        <p>
          Modern oil markets are highly substitutable in normal conditions —
          but only at the margin. A 5–10% global supply shock cannot be
          replaced overnight, because there is very little spare capacity that
          is both unsold and physically deliverable. Strategic petroleum
          reserves help, but releases take weeks to reach refineries. Even the
          rumor of a Strait closure typically adds $10–25 to a barrel of Brent
          crude inside 48 hours, which translates into 25–60 cents per gallon
          of gasoline at US pumps within 7–14 days. For a deeper look at the
          consumer-side effect, see{" "}
          {dl(
            "/blog/how-iran-us-war-affects-gas-prices",
            "How the Iran-US War Affects Gas Prices at the Pump",
          )}
          .
        </p>

        <h2>How a closure actually works</h2>
        <p>
          A &quot;closure&quot; doesn&apos;t require Iran to physically block
          the lanes. It only requires shipping insurance markets — primarily
          the London-based International Group of P&amp;I Clubs and Lloyd&apos;s
          syndicates — to suspend coverage for transits, which they do quickly
          when state actors begin laying mines or firing on tankers. Without
          insurance, no major oil major or large bank will charter or finance
          a transit. The 2026 IRGC blockade combined three classical tools:
          naval mines (cheap, hard to clear), fast-attack craft and shore-based
          anti-ship missiles (Noor, Qader, Hoot torpedoes), and electronic
          warfare against vessel transponders.
        </p>

        <h2>Reroute options</h2>
        <p>
          When the Strait closes, ships have to take the long way around the
          Cape of Good Hope. From Ras Tanura to Rotterdam, the diversion adds
          about 14 days and roughly 3,500 nautical miles each way. Daily
          charter rates for Very Large Crude Carriers (VLCCs) doubled within a
          week of the 2026 closure, and clean-product tankers serving Asia
          jumped 70% in the same period. We track the route shift continuously
          on the {dl("/oil-energy", "Oil & Energy dashboard")} under
          &quot;Alternative Shipping Routes.&quot;
        </p>

        <h2>What stops a permanent closure?</h2>
        <p>
          Three forces pull against a sustained shutdown. First, Iran itself
          depends on Hormuz to export its own crude — sustained closure
          starves Tehran&apos;s budget. Second, China, Iran&apos;s largest oil
          customer, applies private diplomatic pressure because its own
          refiners need the Persian Gulf flow. Third, the US Fifth Fleet,
          based in Bahrain, is structured specifically around mine-clearing,
          escort operations, and surface-warfare capacity in the Gulf. In
          previous Strait incidents (1987–88 &quot;Tanker War&quot; reflagging,
          2019 Gulf of Oman attacks), reopening came within weeks rather than
          months once those forces aligned.
        </p>

        <h2>Bottom line</h2>
        <p>
          The Strait of Hormuz is unique because there is no substitute for it
          at scale, no near-term replacement infrastructure, and no
          geographically neutral path around it. That gives Iran disproportionate
          coercive leverage during a crisis and makes every twitch of the
          blockade — a single mine, a single missile launch — a global price
          event. Bookmark the {dl("/hormuz", "live tracker")} and the{" "}
          {dl("/conflict-map", "conflict timeline")} to watch how the situation
          develops.
        </p>
      </>
    ),
  },

  {
    slug: "how-iran-us-war-affects-gas-prices",
    title: "How the Iran-US War Affects Gas Prices at the Pump",
    description:
      "A practical breakdown of how the Iran-US conflict moves US gas prices — from the Brent crude shock to refinery margins to the cents-per-gallon reality at your local station.",
    datePublished: "2026-04-18",
    dateModified: "2026-05-04",
    readingTime: "8 min read",
    category: "Explainer",
    keywords: [
      "Iran war gas prices",
      "gas prices Iran conflict",
      "oil price war",
      "gas pump cost",
      "Brent crude gas prices",
      "Strait of Hormuz gas prices",
    ],
    body: () => (
      <>
        <p>
          When the Strait of Hormuz closes or even looks like it might, the
          chain reaction at your local gas station is faster than most people
          expect. This article walks through how a Persian Gulf event turns
          into a higher number on the pump display — and why some states feel
          it more than others. Live numbers update every 60 seconds on the{" "}
          {dl("/impact", "War Impact dashboard")} (gas prices by state) and the{" "}
          {dl("/oil-energy", "Oil & Energy dashboard")} (Brent and gasoline
          futures). For the underlying geography, see our explainer on{" "}
          {dl(
            "/blog/strait-of-hormuz-oil-chokepoint",
            "the Strait of Hormuz",
          )}
          .
        </p>

        <h2>Step 1: Brent crude reprices in minutes</h2>
        <p>
          The first market to move is the global crude oil benchmark, Brent.
          Inside an hour of credible Strait disruption, traders bid Brent up
          $5–$25 per barrel as a risk premium. WTI, the US benchmark, follows
          but typically rises less because more US barrels are landlocked. In
          the current 2026 conflict, Brent has run in the $130–$145 range,
          versus a pre-conflict $76 baseline.
        </p>

        <h2>Step 2: Wholesale gasoline follows, with a delay</h2>
        <p>
          Crude oil is the dominant input to refined gasoline, but it is not
          the only input. The RBOB (Reformulated Blendstock for Oxygenate
          Blending) gasoline futures contract is what refiners and wholesalers
          settle against. RBOB usually moves the same direction as Brent
          within hours, but the magnitude is dampened by refinery margins and
          gasoline-specific inventory. As a rough rule of thumb, every $10
          rise in Brent translates to about 25 cents per gallon at wholesale
          within one to two weeks.
        </p>

        <h2>Step 3: Retail margins squeeze, then expand</h2>
        <p>
          When wholesale gas spikes, retail stations have a problem: their
          tanks are still full of cheaper fuel, but their next delivery will
          be at the new price. Most stations don&apos;t raise prices the
          minute futures move — they raise them when the next truck shows up.
          That&apos;s why retail typically lags wholesale by 3–7 days. On the
          downside, retail tends to fall slower than wholesale (sometimes
          called &quot;rockets and feathers&quot;), because stations want to
          recover the margin they lost on the way up.
        </p>

        <h2>Step 4: State-by-state divergence</h2>
        <p>
          Not every state feels the same shock. Three factors dominate the
          variance:
        </p>
        <ul>
          <li>
            <strong>Refinery dependency.</strong> States like California and
            Hawaii rely on local refiners that run on imported crude. They
            tend to overshoot the national average move.
          </li>
          <li>
            <strong>State and federal taxes.</strong> Higher-tax states see a
            smaller percentage move because the tax portion is fixed in cents
            per gallon.
          </li>
          <li>
            <strong>Boutique fuel blends.</strong> California, the Pacific
            Northwest, and parts of the Midwest require specialty summer
            blends. Disruption to any one refinery serving those markets
            creates regional spikes.
          </li>
        </ul>
        <p>
          The {dl("/impact", "War Impact dashboard")} shows the current
          top-10 highest-price states with the change since the conflict
          started.
        </p>

        <h2>Step 5: Diesel, jet fuel, and downstream effects</h2>
        <p>
          Gasoline isn&apos;t the whole story. Diesel and jet fuel often rise
          more in percentage terms than gasoline during a Persian Gulf shock,
          because the underlying crude grade (medium-sour) feeds those
          products preferentially. Higher diesel raises the cost of trucking,
          which raises grocery and consumer-good prices three to six weeks
          later — a separate consumer impact we track on the impact page&apos;s
          commodity table.
        </p>

        <h2>How long does the spike last?</h2>
        <p>
          History suggests three patterns. A short crisis with rapid
          de-escalation (under two weeks) typically reverses about 70% of the
          gas price increase within one to two months. A medium crisis
          (1–3 months) can keep prices elevated for a full quarter even after
          de-escalation, because inventories have been drawn down. A
          structural disruption (more than 3 months) reshapes refining
          patterns entirely and can create a permanently higher floor for the
          next 12+ months. We are currently in month two of the 2026
          conflict — see the {dl("/conflict-map", "live timeline")} for
          escalation milestones.
        </p>

        <h2>What can consumers actually do?</h2>
        <ul>
          <li>
            <strong>Time fill-ups.</strong> If wholesale futures spiked
            yesterday, retail will likely catch up in 3–7 days. Filling up
            today — not tomorrow — frequently saves real money.
          </li>
          <li>
            <strong>Use price aggregators.</strong> GasBuddy, Waze, and Google
            Maps gas-price overlays surface dispersion of 30–60 cents per
            gallon between stations within a single ZIP code.
          </li>
          <li>
            <strong>Pay attention to grade differentials.</strong> During
            shocks, the spread between regular and premium often widens.
            Premium-only vehicles get squeezed harder.
          </li>
          <li>
            <strong>Watch policy responses.</strong> Federal and state gas-tax
            holidays, SPR releases, and fuel-blend waivers each typically
            knock 8–25 cents per gallon off the average.
          </li>
        </ul>

        <h2>Bottom line</h2>
        <p>
          Gas prices during a Persian Gulf conflict are a downstream product of
          three things: the Brent crude risk premium, refinery slate
          flexibility, and local market structure. The Brent move happens in
          minutes, the wholesale move happens in days, and the retail move
          happens in weeks — which is why patient consumers and regional
          dispersion both matter. Bookmark the{" "}
          {dl("/impact", "War Impact dashboard")} for live state-by-state
          tracking and the {dl("/oil-energy", "Oil & Energy dashboard")} for
          the underlying market data.
        </p>
      </>
    ),
  },

  {
    slug: "world-oil-percentage-strait-of-hormuz",
    title:
      "What Percentage of World Oil Passes Through the Strait of Hormuz?",
    description:
      "The short answer is roughly 20% of global oil and about a third of seaborne LNG. Here is the exact breakdown by exporter, by destination, and by alternative pipeline capacity.",
    datePublished: "2026-04-22",
    dateModified: "2026-05-04",
    readingTime: "6 min read",
    category: "Reference",
    keywords: [
      "Strait of Hormuz oil percentage",
      "world oil percentage Hormuz",
      "Hormuz oil flow",
      "Persian Gulf oil exports",
      "Strait of Hormuz LNG",
    ],
    body: () => (
      <>
        <p>
          <strong>Short answer:</strong> roughly 20% of global oil consumption
          and about 30% of seaborne liquefied natural gas pass through the
          Strait of Hormuz on a typical day. The rest of this article breaks
          that figure down — by exporter, by destination, and by what
          pipelines can actually replace if the Strait closes. For why the
          Strait matters geopolitically, see{" "}
          {dl(
            "/blog/strait-of-hormuz-oil-chokepoint",
            "Strait of Hormuz: Why It's the World's Most Critical Oil Chokepoint",
          )}
          .
        </p>

        <h2>The headline numbers</h2>
        <ul>
          <li>
            <strong>~20.5 million barrels of oil per day</strong> in liquid
            crude and condensate (pre-conflict average).
          </li>
          <li>
            <strong>~5.5 million barrels per day</strong> in refined products
            on top of that.
          </li>
          <li>
            <strong>~110 billion cubic meters per year</strong> of LNG, almost
            entirely from Qatar.
          </li>
          <li>
            <strong>20.4%</strong> of total global liquid-fuel consumption,
            including both crude and refined products.
          </li>
        </ul>

        <h2>By exporter (typical day, pre-conflict)</h2>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Daily flow through Hormuz</th>
              <th>% of country&apos;s exports</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Saudi Arabia</td>
              <td>~6.3 mbpd</td>
              <td>~88%</td>
            </tr>
            <tr>
              <td>Iraq</td>
              <td>~3.3 mbpd</td>
              <td>~98%</td>
            </tr>
            <tr>
              <td>UAE</td>
              <td>~2.8 mbpd</td>
              <td>~78%</td>
            </tr>
            <tr>
              <td>Kuwait</td>
              <td>~2.0 mbpd</td>
              <td>~100%</td>
            </tr>
            <tr>
              <td>Iran</td>
              <td>~1.4 mbpd</td>
              <td>~100%</td>
            </tr>
            <tr>
              <td>Qatar (LNG-equivalent)</td>
              <td>~1.0 mbpd oil-equivalent</td>
              <td>~100%</td>
            </tr>
          </tbody>
        </table>

        <h2>By destination</h2>
        <p>
          The flow direction is overwhelmingly Asia, not Europe or North
          America. About 82% of Hormuz crude lands in Asia. China, India,
          Japan, and South Korea together take more than two-thirds of every
          barrel that exits the Strait. Europe takes around 12%. The United
          States imports very little — typically 4–6% of Hormuz volume —
          which is why a Strait disruption hurts US consumers via global
          prices rather than via direct supply loss.
        </p>

        <h2>What pipelines can replace if the Strait closes?</h2>
        <ul>
          <li>
            <strong>Saudi East-West Petroline:</strong> ~5.0 mbpd capacity to
            Yanbu on the Red Sea.
          </li>
          <li>
            <strong>UAE Habshan-Fujairah:</strong> ~1.5 mbpd to the Gulf of
            Oman, bypassing Hormuz.
          </li>
          <li>
            <strong>Iraq-Turkey pipeline (Kirkuk-Ceyhan):</strong> nominally
            ~1.6 mbpd, but operating at a fraction of capacity in 2026.
          </li>
        </ul>
        <p>
          Combined feasible bypass capacity is around 7–8 mbpd — roughly a
          third of normal Hormuz flow. The rest is stranded if the Strait
          closes, which is the structural reason a closure cannot be
          fully offset.
        </p>

        <h2>Why the percentage drifts year to year</h2>
        <p>
          The 20% figure is not constant. It moved between 17% (during the
          2020 demand collapse) and 24% (during the post-2021 demand recovery).
          Three drivers:
        </p>
        <ul>
          <li>
            <strong>OPEC+ production decisions.</strong> When Saudi Arabia and
            the UAE add barrels, Hormuz throughput rises.
          </li>
          <li>
            <strong>Asian demand.</strong> Higher Chinese and Indian imports
            push more barrels through Hormuz because both countries source
            heavily from the Persian Gulf.
          </li>
          <li>
            <strong>US shale.</strong> When US exports rise, they substitute
            for some Persian Gulf barrels in Europe — modestly reducing
            Hormuz dependence.
          </li>
        </ul>

        <h2>How to track the live number</h2>
        <p>
          Throughput is estimated using satellite-derived AIS vessel
          tracking, port-call data, and tanker-storage indicators. We
          surface the daily reading on the{" "}
          {dl("/hormuz", "Strait of Hormuz tracker")} along with the rerouted
          ship count and the spillover to oil prices on the{" "}
          {dl("/oil-energy", "Oil & Energy dashboard")}.
        </p>

        <h2>Citation-ready summary</h2>
        <p>
          If you need a single sentence: &quot;Roughly one out of every five
          barrels of oil consumed worldwide and about one third of seaborne
          LNG transits the Strait of Hormuz, with no full-scale alternative
          available.&quot;
        </p>
      </>
    ),
  },
];

export const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return articlesBySlug.get(slug);
}
