import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface BuildOpts {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: "red" | "amber" | "cyan" | "green" | "blue" | "purple";
  badge?: string;
}

const ACCENT_RGB: Record<NonNullable<BuildOpts["accent"]>, string> = {
  red: "255,59,59",
  amber: "255,184,0",
  cyan: "0,212,255",
  green: "0,214,143",
  blue: "76,141,255",
  purple: "167,139,250",
};

/**
 * Render a Crisis Watch branded OG/hero card. Used by every per-route
 * opengraph-image.tsx and reused as the visible hero image on articles
 * so we ship one consistent visual identity across social and on-page.
 */
export async function buildOgImage(opts: BuildOpts): Promise<ImageResponse> {
  const accent = opts.accent ?? "red";
  const rgb = ACCENT_RGB[accent];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#06060b",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgb},0.14) 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            left: "-80px",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgb},0.08) 0%, transparent 70%)`,
          }}
        />

        {/* top accent bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            display: "flex",
            background: `linear-gradient(90deg, rgba(${rgb},1) 0%, #ff8a3b 50%, #ffb800 100%)`,
          }}
        />

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 64px",
          }}
        >
          {/* brand row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #dc2626, #f97316)",
                boxShadow: `0 6px 28px rgba(${rgb},0.35)`,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                }}
              >
                CW
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#f0f0f5",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                }}
              >
                CRISIS WATCH
              </span>
              <span
                style={{
                  color: "#5a5a72",
                  fontSize: "13px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Real-Time Conflict Dashboard
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginLeft: "auto",
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.3)`,
                borderRadius: "999px",
                padding: "10px 22px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: `rgb(${rgb})`,
                  boxShadow: `0 0 16px rgba(${rgb},0.65)`,
                }}
              />
              <span
                style={{
                  color: `rgb(${rgb})`,
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "3px",
                }}
              >
                {opts.badge ?? "LIVE"}
              </span>
            </div>
          </div>

          {/* eyebrow */}
          <span
            style={{
              fontSize: "16px",
              color: `rgb(${rgb})`,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {opts.eyebrow}
          </span>

          {/* title */}
          <span
            style={{
              fontSize: opts.title.length > 60 ? "48px" : "60px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#f0f0f5",
              maxWidth: "1000px",
            }}
          >
            {opts.title}
          </span>

          {opts.subtitle && (
            <span
              style={{
                fontSize: "22px",
                color: "#8888a0",
                lineHeight: 1.45,
                maxWidth: "880px",
                marginTop: "20px",
              }}
            >
              {opts.subtitle}
            </span>
          )}

          <div style={{ flex: 1 }} />

          {/* footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "20px",
            }}
          >
            <span style={{ color: "#5a5a72", fontSize: "14px" }}>
              crisiswatch.ca
            </span>
            <span style={{ color: "#5a5a72", fontSize: "14px" }}>
              Sources: Reuters · AP · GDELT · Al Jazeera · Yahoo Finance · NASA FIRMS
            </span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
