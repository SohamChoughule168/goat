import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ImaginarsClub Services — Mumbai";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07090E",
          color: "#EBEDF1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: "3px solid #EBEDF1",
              transform: "rotate(45deg)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>
              IMAGINARSCLUB
            </span>
            <span style={{ fontSize: 16, letterSpacing: 12, color: "#3464E6" }}>
              SERVICES
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05 }}>
            Imagination,
          </span>
          <span style={{ fontSize: 76, fontStyle: "italic", lineHeight: 1.05, color: "#3464E6" }}>
            engineered.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#7B808A",
          }}
        >
          <span>Digital studio — Mumbai, India</span>
          <span>imaginarsclubservices.com</span>
        </div>
      </div>
    ),
    size
  );
}

