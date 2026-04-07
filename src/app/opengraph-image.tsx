import { ImageResponse } from "next/og";

export const alt = "Crisis Watch — Live Iran-US War Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,59,59,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(76,141,255,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            width: "100%",
            height: "4px",
            display: "flex",
          }}
        >
          <div
            style={{
              flex: 1,
              background:
                "linear-gradient(90deg, #ff3b3b 0%, #ff8a3b 50%, #ffb800 100%)",
            }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 56px",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "36px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #dc2626, #f97316)",
                boxShadow: "0 4px 24px rgba(255,59,59,0.3)",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "20px",
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
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                }}
              >
                CRISIS WATCH
              </span>
              <span
                style={{
                  color: "#5a5a72",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Real-Time Conflict Dashboard
              </span>
            </div>

            {/* LIVE badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "auto",
                background: "rgba(255,59,59,0.1)",
                border: "1px solid rgba(255,59,59,0.25)",
                borderRadius: "999px",
                padding: "8px 18px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ff3b3b",
                  boxShadow: "0 0 12px rgba(255,59,59,0.6)",
                }}
              />
              <span
                style={{
                  color: "#ff3b3b",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "3px",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span
              style={{
                fontSize: "54px",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-1px",
                color: "#f0f0f5",
              }}
            >
              Iran-US War Dashboard
            </span>
            <span
              style={{
                fontSize: "22px",
                color: "#8888a0",
                lineHeight: 1.4,
                maxWidth: "700px",
              }}
            >
              Oil prices, Strait of Hormuz blockade, gas prices, war map &
              timeline. Updated every 60 seconds.
            </span>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <StatBox
              label="Day of Conflict"
              value="38"
              color="#ff3b3b"
              accent="rgba(255,59,59,0.08)"
            />
            <StatBox
              label="Brent Crude"
              value="$142.38"
              change="+2.3%"
              color="#ffb800"
              accent="rgba(255,184,0,0.08)"
            />
            <StatBox
              label="Strait Status"
              value="CLOSED"
              color="#ff3b3b"
              accent="rgba(255,59,59,0.08)"
            />
            <StatBox
              label="US Gas Avg"
              value="$5.89"
              change="+$0.12"
              color="#ffb800"
              accent="rgba(255,184,0,0.08)"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 56px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ color: "#5a5a72", fontSize: "13px" }}>
            crisiswatch.ca
          </span>
          <span style={{ color: "#5a5a72", fontSize: "13px" }}>
            Sources: Reuters, AP, GDELT, Al Jazeera
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function StatBox({
  label,
  value,
  change,
  color,
  accent,
}: {
  label: string;
  value: string;
  change?: string;
  color: string;
  accent: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "18px 20px",
        borderRadius: "14px",
        background: accent,
        border: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: color,
          opacity: 0.6,
        }}
      />
      <span
        style={{
          fontSize: "11px",
          color: "#8888a0",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#f0f0f5",
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </span>
        {change && (
          <span style={{ fontSize: "14px", color, fontWeight: 700 }}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
