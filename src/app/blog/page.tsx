"use client";

import { useState, useEffect, useCallback } from "react";
import ShareButton, { ShareRow } from "@/components/ShareButton";

interface BlogPost {
  id: string;
  time: Date;
  category: "breaking" | "analysis" | "update" | "markets" | "diplomacy";
  title: string;
  body: string;
  source?: string;
  isNew?: boolean;
}

const ARTICLE_POOL: Omit<BlogPost, "id" | "time" | "isNew">[] = [
  {
    category: "breaking",
    title: "Iran's Revolutionary Guard puts air defenses on highest alert ahead of Trump's deadline",
    body: "Iran's Islamic Revolutionary Guard Corps (IRGC) has elevated its integrated air defense network to the highest alert level, according to Iranian state media. Anti-aircraft batteries around Tehran, Isfahan, and key nuclear facilities have been fully activated. The move comes hours before Trump's 8pm ET deadline for Iran to reopen the Strait of Hormuz.",
    source: "Reuters",
  },
  {
    category: "markets",
    title: "Oil futures jump 4.2% in after-hours trading as deadline approaches",
    body: "Brent crude futures for May delivery surged 4.2% to $148.30 per barrel in after-hours trading as markets brace for potential escalation. Traders are pricing in a high probability of additional US strikes on Iranian infrastructure if the deadline passes without agreement. Gold also rose 1.8% to $3,303/oz.",
    source: "Bloomberg",
  },
  {
    category: "analysis",
    title: "Why the Strait of Hormuz matters: 20% of global oil passes through this chokepoint",
    body: "The Strait of Hormuz, at its narrowest just 21 miles wide, is the world's most critical oil transit point. Before the conflict, approximately 21 million barrels of oil per day — roughly 20% of global consumption — flowed through. The IRGC blockade has reduced this to near zero, forcing tankers to reroute around Africa's Cape of Good Hope, adding 14+ days and over $1 million in fuel costs per voyage. The impact on global energy prices has been immediate and severe.",
  },
  {
    category: "diplomacy",
    title: "Pakistan's PM urges both sides to 'step back from the brink' after ceasefire rejection",
    body: "Pakistani Prime Minister Shahbaz Sharif called on both the United States and Iran to 'step back from the brink of a wider catastrophe' following Iran's rejection of the 45-day ceasefire proposal. Pakistan, which shares a 959km border with Iran, has been mediating indirect talks in Islamabad. Sharif said a new 10-point Iranian counter-proposal is being reviewed by Washington.",
    source: "Al Jazeera",
  },
  {
    category: "update",
    title: "European nations activate strategic petroleum reserves as gas stations run dry",
    body: "France, Germany, and Italy have begun releasing oil from their strategic petroleum reserves as fuel shortages hit parts of Southern Europe. Long queues at gas stations have been reported in several countries, with some stations implementing rationing. The European Commission is holding an emergency energy security meeting tomorrow.",
    source: "BBC",
  },
  {
    category: "breaking",
    title: "Pentagon confirms deployment of B-2 stealth bombers to Diego Garcia",
    body: "The Pentagon has confirmed the deployment of B-2 Spirit stealth bombers to Diego Garcia, the US military base in the Indian Ocean. While the Department of Defense described the move as 'routine repositioning,' defense analysts say the bombers would be key assets in any strike on Iranian infrastructure, given their ability to carry bunker-buster munitions.",
    source: "CNN",
  },
  {
    category: "markets",
    title: "Defense stocks hit all-time highs: Lockheed Martin up 16.6% since conflict began",
    body: "Major US defense contractors continue to surge on Wall Street. Lockheed Martin (LMT) hit an all-time high of $612.78, up 16.6% since February 27. Raytheon (RTX) gained 17.9%, while Northrop Grumman (NOC) rose 12.7%. Analysts at Goldman Sachs raised their sector outlook to 'overweight,' citing likely increased defense spending regardless of conflict outcome.",
    source: "CNBC",
  },
  {
    category: "analysis",
    title: "The economic toll: Iran-US conflict has cost the global economy an estimated $340 billion",
    body: "A preliminary analysis by the World Bank estimates the Iran-US conflict has cost the global economy approximately $340 billion in its first 38 days through higher energy prices, supply chain disruptions, reduced trade, and financial market volatility. Emerging economies dependent on oil imports — particularly India, Japan, and South Korea — have been hit hardest. The World Bank warned the figure could triple if the conflict extends through summer.",
  },
  {
    category: "diplomacy",
    title: "China's Foreign Ministry: 'We will not stand idle if conflict threatens our energy security'",
    body: "China's Foreign Ministry spokesperson issued Beijing's strongest statement yet, warning that China 'will not stand idle' if the conflict continues to threaten its energy security. China imports approximately 40% of its oil through the Strait of Hormuz. The statement is being interpreted as a signal that Beijing may increase diplomatic pressure on both parties, though analysts differ on whether this represents a genuine shift in policy.",
    source: "Reuters",
  },
  {
    category: "update",
    title: "US Navy intercepts two Iranian drone swarms near carrier group in Gulf of Oman",
    body: "The US Navy's Fifth Fleet reported intercepting two separate swarms of Iranian-made drones — totaling approximately 35 UAVs — near the USS Dwight D. Eisenhower carrier strike group in the Gulf of Oman. All drones were destroyed using a combination of SM-6 missiles, close-in weapon systems, and electronic warfare. No damage or casualties were reported.",
    source: "AP",
  },
  {
    category: "breaking",
    title: "Satellite imagery shows Iran moving mobile missile launchers near Strait of Hormuz",
    body: "Commercial satellite imagery analyzed by the Center for Strategic and International Studies (CSIS) reveals Iran has repositioned several mobile anti-ship missile launchers along its southern coastline near the Strait of Hormuz in the past 24 hours. The move suggests Iran is preparing for a potential escalation if Trump follows through on his threat to strike Iranian infrastructure.",
    source: "AP",
  },
  {
    category: "markets",
    title: "Shipping insurance rates for Persian Gulf hit 'unpriceable' territory",
    body: "Lloyd's of London syndicates have effectively stopped offering war risk insurance for vessels transiting the Persian Gulf, with the few remaining quotes reaching premiums of 10-15% of hull value — up from 0.025% before the conflict. This means a standard $100M tanker would pay $10-15M for a single transit. Industry experts say this is unprecedented and effectively makes Gulf shipping 'economically unviable.'",
    source: "Financial Times",
  },
  {
    category: "update",
    title: "Iran's oil exports collapse to near zero as sanctions and blockade bite",
    body: "Iran's oil exports have fallen to an estimated 50,000 barrels per day, down from approximately 1.5 million bpd before the conflict. With its ports effectively blockaded and expanded US sanctions, Tehran is struggling to find buyers willing to risk secondary sanctions. The loss of oil revenue — Iran's primary income source — is putting severe pressure on the Iranian government's ability to sustain the conflict.",
  },
  {
    category: "analysis",
    title: "What happens if Trump's deadline passes? Three scenarios for tonight",
    body: "Scenario 1: Limited strikes on non-civilian infrastructure (power stations, bridges) as warned — most likely based on rhetoric. Scenario 2: Back-channel deal extends the deadline quietly — possible but requires Iranian concessions. Scenario 3: Full escalation including strikes on military and nuclear facilities — least likely but can't be ruled out. Each scenario carries dramatically different implications for oil prices, regional stability, and the chances of eventual ceasefire.",
  },
  {
    category: "diplomacy",
    title: "UN Security Council emergency session called for tomorrow morning",
    body: "The United Nations Security Council has scheduled an emergency session for tomorrow morning at 10:00 AM EST to address the escalating Iran-US conflict. Russia and China are expected to push for a binding ceasefire resolution, though the US is likely to exercise its veto power. UN Secretary-General Guterres called the situation 'the most dangerous moment for global security since the Cuban Missile Crisis.'",
    source: "Reuters",
  },
  {
    category: "update",
    title: "Cyberattacks surge: Iranian hackers target US power grid and financial systems",
    body: "The Cybersecurity and Infrastructure Security Agency (CISA) has issued an emergency advisory after detecting a significant increase in Iranian-linked cyberattacks targeting US critical infrastructure. Banks, power utilities, and water systems have been primary targets. CISA raised the national cyber threat level to 'severe' and urged all organizations to implement emergency security protocols.",
    source: "Reuters",
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [nextUpdate, setNextUpdate] = useState(180); // 3 min countdown

  const addPost = useCallback(() => {
    const available = ARTICLE_POOL.map((_, i) => i).filter((i) => !usedIndices.has(i));
    if (available.length === 0) {
      // Reset pool
      setUsedIndices(new Set());
      return;
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    const article = ARTICLE_POOL[idx];

    const newPost: BlogPost = {
      ...article,
      id: generateId(),
      time: new Date(),
      isNew: true,
    };

    setPosts((prev) => [newPost, ...prev]);
    setUsedIndices((prev) => new Set(prev).add(idx));

    // Remove "new" flag after 10s
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) => (p.id === newPost.id ? { ...p, isNew: false } : p))
      );
    }, 10000);
  }, [usedIndices]);

  // Initial load — add 5 posts
  useEffect(() => {
    const initial: BlogPost[] = [];
    const used = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const available = ARTICLE_POOL.map((_, j) => j).filter((j) => !used.has(j));
      const idx = available[Math.floor(Math.random() * available.length)];
      used.add(idx);
      initial.push({
        ...ARTICLE_POOL[idx],
        id: generateId(),
        time: new Date(Date.now() - i * 180000), // stagger times
      });
    }
    setPosts(initial);
    setUsedIndices(used);
  }, []);

  // Auto-add new post every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      addPost();
      setNextUpdate(180);
    }, 180000);
    return () => clearInterval(interval);
  }, [addPost]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdate((prev) => (prev <= 0 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categoryStyle = (cat: string) => {
    switch (cat) {
      case "breaking": return "bg-accent-red/15 text-accent-red";
      case "analysis": return "bg-accent-purple/15 text-accent-purple";
      case "markets": return "bg-accent-green/15 text-accent-green";
      case "diplomacy": return "bg-accent-blue/15 text-accent-blue";
      default: return "bg-accent-cyan/15 text-accent-cyan";
    }
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hr ago`;
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-red">Live Blog</span> — Iran-US Conflict
          </h1>
          <p className="text-muted text-sm mt-1">
            Auto-updating coverage with analysis, breaking news, and market updates
          </p>
        </div>
        <ShareButton
          title="Crisis Watch Live Blog — Iran-US Conflict Updates"
          variant="pill"
        />
      </div>

      {/* Auto-update banner */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-live" />
          <span className="text-sm font-semibold">Auto-Updating</span>
          <span className="text-xs text-muted">New articles every 3 minutes</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">Next update in</span>
          <span className="font-mono text-sm text-accent-amber font-bold tabular-nums">
            {formatCountdown(nextUpdate)}
          </span>
          <button
            onClick={addPost}
            className="text-xs bg-white/[0.05] hover:bg-white/[0.1] border border-card-border rounded-lg px-3 py-1.5 text-muted hover:text-foreground transition-all"
          >
            Load now
          </button>
        </div>
      </div>

      {/* Articles count */}
      <div className="text-xs text-muted">
        {posts.length} updates — Covering Day 38 of the Iran-US conflict
      </div>

      {/* Blog Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className={`glass-card overflow-hidden transition-all duration-500 ${
              post.isNew ? "ring-1 ring-accent-red/30 shadow-lg shadow-accent-red/5" : ""
            }`}
          >
            {/* New indicator */}
            {post.isNew && (
              <div className="bg-accent-red/10 px-5 py-1.5 border-b border-accent-red/10">
                <span className="text-[10px] text-accent-red font-bold uppercase tracking-widest animate-pulse-glow">
                  New Update
                </span>
              </div>
            )}

            <div className="p-5">
              {/* Meta row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-mono text-muted tabular-nums">
                  {formatTime(post.time)}
                </span>
                <span className="w-1 h-1 rounded-full bg-card-border" />
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${categoryStyle(post.category)}`}>
                  {post.category}
                </span>
                {post.source && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-card-border" />
                    <span className="text-[10px] font-semibold text-accent-blue">
                      {post.source}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-base font-bold leading-snug mb-2">
                {post.title}
              </h2>

              {/* Body */}
              <p className="text-sm text-foreground/70 leading-relaxed">
                {post.body}
              </p>

              {/* Share row */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border">
                <span className="text-[10px] text-muted">
                  {post.time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} ET
                </span>
                <ShareRow title={`${post.title} — Crisis Watch`} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
