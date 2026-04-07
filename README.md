# Crisis Watch — Real-Time Iran-US Conflict Dashboard

**Live at [crisiswatch.ca](https://crisiswatch.ca)**

A real-time dashboard tracking the Iran-US conflict with live data on oil prices, the Strait of Hormuz blockade, war impact on daily life, an interactive conflict map, and auto-updating news coverage.

---

## Dashboards

| Page | Description |
|------|-------------|
| **Overview** | Key stats, oil & gas price charts, live news ticker, breaking alerts |
| **Strait of Hormuz** | Interactive map with blockade zones, ship positions, reroute paths, oil flow data |
| **War Impact** | Gas prices by state, commodity prices, flight disruptions, personal impact calculator by ZIP code |
| **Conflict Map** | Interactive map of all strikes and events, full conflict timeline from Day 1 |
| **Oil & Energy** | Brent/WTI crude charts, natural gas, gold, energy & defense stock performance |
| **Live Blog** | Auto-updating articles every 3 minutes — breaking news, analysis, markets, diplomacy |

## Features

- **Live countdown timer** to critical deadlines
- **Share buttons** on every page, chart, stat card, and article (X, Facebook, LinkedIn, WhatsApp, Telegram)
- **Personal impact calculator** — enter your ZIP code to see local gas prices, flight disruptions, and estimated extra monthly cost
- **Dark glass morphism UI** with gradient accents and smooth animations
- **SEO optimized** — per-page metadata, Open Graph tags, structured data, sitemap, robots.txt
- **Auto-refresh** data every 60 seconds

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Maps:** Leaflet + React-Leaflet (CARTO dark tiles)
- **Deployment:** Docker / Azure App Service

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
docker build -t crisis-watch .
docker run -p 3000:3000 crisis-watch
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Overview dashboard
│   ├── hormuz/               # Strait of Hormuz tracker
│   ├── impact/               # War impact on daily life
│   ├── conflict-map/         # Live conflict map & timeline
│   ├── oil-energy/           # Oil & energy markets
│   ├── blog/                 # Auto-updating live blog
│   ├── api/                  # API routes (news, prices)
│   ├── sitemap.ts            # Auto-generated sitemap
│   └── robots.ts             # Search engine directives
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Live clock & deadline countdown
│   ├── StatCard.tsx          # Stat cards with share buttons
│   ├── LiveChart.tsx         # Recharts area/line charts
│   ├── NewsTicker.tsx        # Live news feed
│   ├── ShareButton.tsx       # Share dropdown (portal-based)
│   ├── ImpactCalculator.tsx  # ZIP code impact tool
│   ├── HormuzMap.tsx         # Hormuz Leaflet map
│   ├── ConflictMapView.tsx   # Conflict event Leaflet map
│   └── Icons.tsx             # SVG icon components
├── hooks/
│   └── useClientData.ts      # SSR-safe data generation hook
└── lib/
    └── mock-data.ts          # Simulated real-time data
```

## Connecting Real Data Sources

The dashboard currently uses realistic mock data. To connect live APIs, replace the generators in `src/lib/mock-data.ts` and the API routes in `src/app/api/`:

| Data | Suggested API |
|------|---------------|
| Oil prices | Alpha Vantage, Yahoo Finance |
| Gas prices | GasBuddy API, EIA |
| News feed | NewsAPI, GNews, GDELT |
| Ship tracking | MarineTraffic AIS |
| Stock prices | Alpha Vantage, Polygon.io |
| Conflict events | ACLED, GDELT |

## License

MIT
