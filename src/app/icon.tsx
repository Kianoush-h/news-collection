import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "32px",
          color: "white",
          fontSize: 88,
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
