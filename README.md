# Crisis Watch — Real-Time Iran-US Conflict Dashboard

**Live at [crisiswatch.ca](https://crisiswatch.ca)**

A real-time dashboard tracking the Iran-US conflict with live data on oil prices, the Strait of Hormuz blockade, war impact on daily life, an interactive conflict map, evergreen explainer articles, and an auto-updating news feed.

---

## Dashboards

| Page | Description |
|------|-------------|
| **Overview** (`/`) | Key stats, oil & gas charts, breaking-news ticker, quick nav, featured explainers |
| **Strait of Hormuz** (`/hormuz`) | Interactive Leaflet map, blockade status, ship rerouting, oil flow |
| **War Impact** (`/impact`) | Gas prices by state, commodity prices, flight disruptions, ZIP code calculator, FAQ |
| **Conflict Map** (`/conflict-map`) | Interactive map of strikes/events plus full timeline |
| **Oil & Energy** (`/oil-energy`) | Brent / WTI / RBOB / NG / gold charts, defense & energy stocks |
| **Live Blog** (`/blog`) | Auto-updating GDELT feed every 3 minutes plus permanent explainer articles |
| **About** (`/about`) | Methodology, data sources, refresh cadence, editorial policy |
| **Privacy** (`/privacy`) | Cookie / GA disclosure, retention, contact |

## Static endpoints

| Endpoint | Purpose |
|----------|---------|
| `/sitemap.xml` | Auto-generated sitemap covering dashboards, articles, llms files, RSS |
| `/robots.txt` | Search engine directives |
| `/feed.xml` | RSS 2.0 of evergreen articles + recent live-blog posts |
| `/llms.txt` | Site index in the llms.txt format |
| `/llms-full.txt` | Full plain-text article corpus for LLM ingestion |
| `/manifest.webmanifest` | PWA manifest |
| `/icon`, `/apple-icon`, `/opengraph-image`, `/twitter-image` | Dynamic image routes |

## API routes (internal — read from the in-process cache)

| Route | Refresh | Description |
|-------|---------|-------------|
| `/api/prices` | 5 min server / 60s client | Yahoo Finance quotes (oil, gas, gold, stocks, VIX) |
| `/api/history?symbol=…` | 5 min | 60-day price series for charts |
| `/api/news` | 5 min server / 3 min client | GDELT-derived live blog & ticker |
| `/api/meta` | 5 min server / 1 hr client | Day counts, derived metrics, gas-by-state, fires |

All API routes set `Cache-Control` with `stale-while-revalidate`.

## Features

- **Live data** from Yahoo Finance, GDELT, NASA FIRMS — refreshed server-side every 5 minutes into a single in-memory store with disk persistence (`.data/cache.json`)
- **Per-page metadata, OpenGraph, Twitter cards, JSON-LD structured data**
- **GDPR-style consent banner** — analytics blocked until the user opts in (Google Consent Mode v2 default-deny)
- **Custom 404, error boundary, and skeleton loading states**
- **Personal impact calculator** — enter a US ZIP, get local gas, flights, and monthly cost delta (computed in-browser; never sent to the server)
- **Share buttons** (X, Facebook, LinkedIn, WhatsApp, Telegram) on every page and chart
- **Dark glass-morphism UI** with Tailwind v4 and gradient accents
- **PWA-installable** via `manifest.ts`

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, standalone output)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Maps:** Leaflet + React-Leaflet (CARTO dark tiles)
- **Data:** Yahoo Finance (`yahoo-finance2`), GDELT, NASA FIRMS
- **Deployment:** Docker / Azure App Service

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build & Run

```bash
npm run build
npm start
```

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
│   ├── layout.tsx            # Root layout, metadata, JSON-LD, GA consent default-deny
│   ├── loading.tsx           # Skeleton fallback
│   ├── error.tsx             # Route-level error boundary
│   ├── not-found.tsx         # Custom 404
│   ├── globals.css           # Tailwind theme + glass-card + animations
│   ├── hormuz/               # Strait of Hormuz tracker
│   ├── impact/               # War impact & ZIP calculator
│   ├── conflict-map/         # Live map & timeline
│   ├── oil-energy/           # Energy markets
│   ├── blog/                 # Live blog index + [slug] for evergreen articles
│   ├── about/                # Methodology
│   ├── privacy/              # Privacy policy
│   ├── api/                  # prices, news, meta, history
│   ├── llms.txt/             # llms.txt index route
│   ├── llms-full.txt/        # Full article corpus
│   ├── feed.xml/             # RSS 2.0
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # Search engine directives
│   ├── manifest.ts           # PWA manifest
│   ├── icon.tsx              # Dynamic 192x192 icon
│   ├── apple-icon.tsx        # Dynamic apple-touch-icon
│   ├── opengraph-image.tsx   # Dynamic OG image
│   └── twitter-image.tsx     # Dynamic Twitter card
├── components/
│   ├── Sidebar.tsx           # Nav (Overview, Hormuz, Impact, Map, Energy, Blog, About)
│   ├── Header.tsx            # Live badge, day counter, version (from package.json)
│   ├── LayoutShell.tsx       # Mobile drawer + cookie banner mount
│   ├── CookieBanner.tsx      # GDPR consent — drives Google Consent Mode v2
│   ├── StatCard.tsx
│   ├── LiveChart.tsx         # Recharts area/line
│   ├── NewsTicker.tsx
│   ├── ShareButton.tsx
│   ├── ImpactCalculator.tsx  # ZIP code → local impact
│   ├── HormuzMap.tsx
│   ├── ConflictMapView.tsx
│   └── Icons.tsx
├── hooks/
│   ├── useLiveData.ts        # Polling fetcher
│   └── useClientData.ts      # SSR-safe data hook
└── lib/
    ├── db.ts                 # In-memory store + disk persistence + 5min refresh loop
    ├── fetchers.ts           # Yahoo Finance / GDELT / FIRMS clients
    ├── cache.ts              # Per-call memo wrapper
    ├── curated.ts            # Editorially curated lookup data
    ├── articles.tsx          # Evergreen explainer articles (JSX bodies)
    └── articles-markdown.ts  # Plain-Markdown bodies for /llms-full.txt
```

## Data Sources

| Data | Provider | Refresh |
|------|----------|---------|
| Crude / gasoline / NG / gold / stocks | Yahoo Finance via `yahoo-finance2` | 5 min |
| Live blog & ticker | GDELT | 5 min |
| Active fires (corroborating signal) | NASA FIRMS | 5 min |
| Conflict timeline & curated stats | Editorial in `lib/curated.ts` | Manual |

## License

MIT
