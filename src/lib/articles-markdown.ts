/**
 * Plain-Markdown bodies of the evergreen articles, for /llms-full.txt.
 * Keep in sync with the JSX bodies in articles.tsx.
 */

export const articleMarkdown: Record<string, string> = {
  "strait-of-hormuz-oil-chokepoint": `The Strait of Hormuz is a 21-mile-wide waterway separating Iran from Oman's Musandam exclave. It is the only sea route from the Persian Gulf to the open ocean — which means every barrel of oil loaded in Saudi Arabia, the UAE, Kuwait, Qatar, Iraq, Bahrain, and Iran has to pass through it. Roughly one out of every five barrels of oil consumed worldwide travels through that narrow channel, alongside about a third of all seaborne liquefied natural gas (LNG). When headlines say a Strait closure would be a global economic emergency, this is why.

## Where exactly is the Strait?

At its narrowest point, the navigable shipping channel is just two miles wide in each direction — inbound and outbound — separated by a two-mile buffer. The channel hugs Omani waters on the southern side to keep clear of Iranian territorial claims to the north. Iran controls the long northern coastline, the islands of Greater and Lesser Tunb, and Abu Musa, all of which sit close to the shipping lanes. The Iranian coast is mountainous, deeply indented, and dotted with naval bases at Bandar Abbas, Bandar-e-Jask, and Chabahar, giving the Islamic Revolutionary Guard Corps (IRGC) Navy excellent shore-to-ship missile, mine-laying, and small-boat options.

## How much oil actually moves through it?

Pre-conflict, the Strait carried about 20–21 million barrels of oil per day in liquid form, roughly 20% of global oil consumption and close to a third of all seaborne crude. On the gas side, Qatar — the world's second-largest LNG exporter — sends nearly all of its output through Hormuz. There is no full-volume bypass: Saudi Arabia operates the East-West Petroline (5 million bpd), and the UAE has the Habshan-Fujairah pipeline (~1.5 million bpd) that exits to the Gulf of Oman. Combined, those alternatives can replace less than a third of the Strait's daily flow.

## Why a small chokepoint matters globally

Modern oil markets are highly substitutable in normal conditions — but only at the margin. A 5–10% global supply shock cannot be replaced overnight, because there is very little spare capacity that is both unsold and physically deliverable. Strategic petroleum reserves help, but releases take weeks to reach refineries. Even the rumor of a Strait closure typically adds $10–25 to a barrel of Brent crude inside 48 hours, which translates into 25–60 cents per gallon of gasoline at US pumps within 7–14 days.

## How a closure actually works

A "closure" doesn't require Iran to physically block the lanes. It only requires shipping insurance markets — primarily the London-based International Group of P&I Clubs and Lloyd's syndicates — to suspend coverage for transits, which they do quickly when state actors begin laying mines or firing on tankers. Without insurance, no major oil major or large bank will charter or finance a transit. The 2026 IRGC blockade combined three classical tools: naval mines (cheap, hard to clear), fast-attack craft and shore-based anti-ship missiles (Noor, Qader, Hoot torpedoes), and electronic warfare against vessel transponders.

## Reroute options

When the Strait closes, ships have to take the long way around the Cape of Good Hope. From Ras Tanura to Rotterdam, the diversion adds about 14 days and roughly 3,500 nautical miles each way. Daily charter rates for Very Large Crude Carriers (VLCCs) doubled within a week of the 2026 closure, and clean-product tankers serving Asia jumped 70% in the same period.

## What stops a permanent closure?

Three forces pull against a sustained shutdown. First, Iran itself depends on Hormuz to export its own crude — sustained closure starves Tehran's budget. Second, China, Iran's largest oil customer, applies private diplomatic pressure because its own refiners need the Persian Gulf flow. Third, the US Fifth Fleet, based in Bahrain, is structured specifically around mine-clearing, escort operations, and surface-warfare capacity in the Gulf. In previous Strait incidents (1987–88 "Tanker War" reflagging, 2019 Gulf of Oman attacks), reopening came within weeks rather than months once those forces aligned.

## Bottom line

The Strait of Hormuz is unique because there is no substitute for it at scale, no near-term replacement infrastructure, and no geographically neutral path around it. That gives Iran disproportionate coercive leverage during a crisis and makes every twitch of the blockade — a single mine, a single missile launch — a global price event.

## Related live data

- Strait of Hormuz tracker: https://crisiswatch.ca/hormuz
- Oil & Energy dashboard: https://crisiswatch.ca/oil-energy
- Conflict timeline: https://crisiswatch.ca/conflict-map
`,

  "how-iran-us-war-affects-gas-prices": `When the Strait of Hormuz closes or even looks like it might, the chain reaction at your local gas station is faster than most people expect. This article walks through how a Persian Gulf event turns into a higher number on the pump display — and why some states feel it more than others.

## Step 1: Brent crude reprices in minutes

The first market to move is the global crude oil benchmark, Brent. Inside an hour of credible Strait disruption, traders bid Brent up $5–$25 per barrel as a risk premium. WTI, the US benchmark, follows but typically rises less because more US barrels are landlocked. In the current 2026 conflict, Brent has run in the $130–$145 range, versus a pre-conflict $76 baseline.

## Step 2: Wholesale gasoline follows, with a delay

Crude oil is the dominant input to refined gasoline, but it is not the only input. The RBOB (Reformulated Blendstock for Oxygenate Blending) gasoline futures contract is what refiners and wholesalers settle against. RBOB usually moves the same direction as Brent within hours, but the magnitude is dampened by refinery margins and gasoline-specific inventory. As a rough rule of thumb, every $10 rise in Brent translates to about 25 cents per gallon at wholesale within one to two weeks.

## Step 3: Retail margins squeeze, then expand

When wholesale gas spikes, retail stations have a problem: their tanks are still full of cheaper fuel, but their next delivery will be at the new price. Most stations don't raise prices the minute futures move — they raise them when the next truck shows up. That's why retail typically lags wholesale by 3–7 days. On the downside, retail tends to fall slower than wholesale (sometimes called "rockets and feathers"), because stations want to recover the margin they lost on the way up.

## Step 4: State-by-state divergence

Not every state feels the same shock. Three factors dominate the variance:

- **Refinery dependency.** States like California and Hawaii rely on local refiners that run on imported crude. They tend to overshoot the national average move.
- **State and federal taxes.** Higher-tax states see a smaller percentage move because the tax portion is fixed in cents per gallon.
- **Boutique fuel blends.** California, the Pacific Northwest, and parts of the Midwest require specialty summer blends. Disruption to any one refinery serving those markets creates regional spikes.

## Step 5: Diesel, jet fuel, and downstream effects

Gasoline isn't the whole story. Diesel and jet fuel often rise more in percentage terms than gasoline during a Persian Gulf shock, because the underlying crude grade (medium-sour) feeds those products preferentially. Higher diesel raises the cost of trucking, which raises grocery and consumer-good prices three to six weeks later — a separate consumer impact we track on the impact page's commodity table.

## How long does the spike last?

History suggests three patterns. A short crisis with rapid de-escalation (under two weeks) typically reverses about 70% of the gas price increase within one to two months. A medium crisis (1–3 months) can keep prices elevated for a full quarter even after de-escalation, because inventories have been drawn down. A structural disruption (more than 3 months) reshapes refining patterns entirely and can create a permanently higher floor for the next 12+ months.

## What can consumers actually do?

- **Time fill-ups.** If wholesale futures spiked yesterday, retail will likely catch up in 3–7 days. Filling up today — not tomorrow — frequently saves real money.
- **Use price aggregators.** GasBuddy, Waze, and Google Maps gas-price overlays surface dispersion of 30–60 cents per gallon between stations within a single ZIP code.
- **Pay attention to grade differentials.** During shocks, the spread between regular and premium often widens. Premium-only vehicles get squeezed harder.
- **Watch policy responses.** Federal and state gas-tax holidays, SPR releases, and fuel-blend waivers each typically knock 8–25 cents per gallon off the average.

## Bottom line

Gas prices during a Persian Gulf conflict are a downstream product of three things: the Brent crude risk premium, refinery slate flexibility, and local market structure. The Brent move happens in minutes, the wholesale move happens in days, and the retail move happens in weeks — which is why patient consumers and regional dispersion both matter.

## Related live data

- War Impact dashboard (gas prices by state): https://crisiswatch.ca/impact
- Oil & Energy dashboard (Brent + RBOB futures): https://crisiswatch.ca/oil-energy
- Strait of Hormuz tracker: https://crisiswatch.ca/hormuz
`,

  "world-oil-percentage-strait-of-hormuz": `**Short answer:** roughly 20% of global oil consumption and about 30% of seaborne liquefied natural gas pass through the Strait of Hormuz on a typical day. The rest of this article breaks that figure down — by exporter, by destination, and by what pipelines can actually replace if the Strait closes.

## The headline numbers

- ~20.5 million barrels of oil per day in liquid crude and condensate (pre-conflict average).
- ~5.5 million barrels per day in refined products on top of that.
- ~110 billion cubic meters per year of LNG, almost entirely from Qatar.
- 20.4% of total global liquid-fuel consumption, including both crude and refined products.

## By exporter (typical day, pre-conflict)

| Country | Daily flow through Hormuz | % of country's exports |
|---|---|---|
| Saudi Arabia | ~6.3 mbpd | ~88% |
| Iraq | ~3.3 mbpd | ~98% |
| UAE | ~2.8 mbpd | ~78% |
| Kuwait | ~2.0 mbpd | ~100% |
| Iran | ~1.4 mbpd | ~100% |
| Qatar (LNG-equivalent) | ~1.0 mbpd oil-equivalent | ~100% |

## By destination

The flow direction is overwhelmingly Asia, not Europe or North America. About 82% of Hormuz crude lands in Asia. China, India, Japan, and South Korea together take more than two-thirds of every barrel that exits the Strait. Europe takes around 12%. The United States imports very little — typically 4–6% of Hormuz volume — which is why a Strait disruption hurts US consumers via global prices rather than via direct supply loss.

## What pipelines can replace if the Strait closes?

- **Saudi East-West Petroline:** ~5.0 mbpd capacity to Yanbu on the Red Sea.
- **UAE Habshan-Fujairah:** ~1.5 mbpd to the Gulf of Oman, bypassing Hormuz.
- **Iraq-Turkey pipeline (Kirkuk-Ceyhan):** nominally ~1.6 mbpd, but operating at a fraction of capacity in 2026.

Combined feasible bypass capacity is around 7–8 mbpd — roughly a third of normal Hormuz flow. The rest is stranded if the Strait closes, which is the structural reason a closure cannot be fully offset.

## Why the percentage drifts year to year

The 20% figure is not constant. It moved between 17% (during the 2020 demand collapse) and 24% (during the post-2021 demand recovery). Three drivers:

- **OPEC+ production decisions.** When Saudi Arabia and the UAE add barrels, Hormuz throughput rises.
- **Asian demand.** Higher Chinese and Indian imports push more barrels through Hormuz because both countries source heavily from the Persian Gulf.
- **US shale.** When US exports rise, they substitute for some Persian Gulf barrels in Europe — modestly reducing Hormuz dependence.

## How to track the live number

Throughput is estimated using satellite-derived AIS vessel tracking, port-call data, and tanker-storage indicators.

## Citation-ready summary

If you need a single sentence: "Roughly one out of every five barrels of oil consumed worldwide and about one third of seaborne LNG transits the Strait of Hormuz, with no full-scale alternative available."

## Related live data

- Strait of Hormuz tracker: https://crisiswatch.ca/hormuz
- Oil & Energy dashboard: https://crisiswatch.ca/oil-energy
`,
};
