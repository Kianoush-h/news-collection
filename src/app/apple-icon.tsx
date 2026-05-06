import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #dc2626, #f97316)",
          color: "white",
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: "-4px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        CW
      </div>
    ),
    { ...size },
  );
}
