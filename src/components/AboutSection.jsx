import React from "react";
import { Sparkles, Recycle, Scissors, HeartHandshake } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: "8rem 0", backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", borderTop: "1px solid var(--color-border)" }}>
      <div className="site-container">
        {/* Eyebrow */}
        <p className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "1.2rem" }}>
          THE ATELIER PHILOSOPHY
        </p>

        {/* Big Bold Headline matching Azar */}
        <h2
          className="font-display text-ink"
          style={{
            fontSize: "clamp(3.8rem, 9.5vw, 8rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            marginBottom: "2.5rem"
          }}
        >
          ONE DESIGN.<br />
          ONE PIECE.<br />
          NEVER AGAIN<span className="text-siren">.</span>
        </h2>

        {/* Two-Column Editorial Story */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3.5rem", alignItems: "start" }} className="manifesto-grid">
          {/* Left Column: Core Manifesto */}
          <div>
            <p
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)",
                lineHeight: 1.35,
                color: "var(--color-ink)",
                marginBottom: "2rem"
              }}
            >
              "We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again."
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", fontSize: "1.05rem", lineHeight: "1.75", color: "rgba(14, 13, 13, 0.8)" }}>
              <p>
                Each piece is designed around the fabric we find — rather than forcing the fabric into a predetermined idea.
              </p>

              <div
                style={{
                  borderLeft: "2px solid var(--color-siren)",
                  paddingLeft: "1.5rem",
                  margin: "0.5rem 0",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  color: "var(--color-ink)"
                }}
              >
                <p>Some carry intricate handwork.</p>
                <p>Some carry faded colours.</p>
                <p>Some show the marks of another time.</p>
                <p style={{ marginTop: "0.5rem", fontWeight: 600, color: "var(--color-siren)" }}>
                  And that’s exactly what makes them beautiful.
                </p>
              </div>

              <p>
                We believe every beautiful textile deserves a second life. Even the smallest remnants are thoughtfully transformed into scarves, neck pieces and accessories, keeping waste to a minimum.
              </p>

              <p>
                We work in slow, intentional batches, creating consciously and using what already exists.
              </p>
            </div>

            {/* 4 Pillars */}
            <div
              style={{
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--color-border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1.5rem"
              }}
            >
              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>01</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700, marginTop: "4px" }}>
                  SLOW BATCHES
                </h4>
                <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "2px" }}>
                  Crafted mindfully in limited, thoughtful capsules.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>02</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700, marginTop: "4px" }}>
                  SINGULAR PIECES
                </h4>
                <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "2px" }}>
                  1 of 1 in the entire world. No replicas ever.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>03</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700, marginTop: "4px" }}>
                  ZERO WASTE
                </h4>
                <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "2px" }}>
                  Remnants reborn into scarves & neck pieces.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>04</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700, marginTop: "4px" }}>
                  A SECOND LIFE
                </h4>
                <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "2px" }}>
                  Heirloom vintage textiles reborn for summer.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Imagery */}
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3 / 4", width: "100%", overflow: "hidden", backgroundColor: "var(--color-cream)", position: "relative" }}>
              <img
                src="/images/dress.jpg"
                alt="Vintage Indian silk textile crafted into a modern slip"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  backgroundColor: "rgba(14, 13, 13, 0.92)",
                  color: "var(--color-ivory)",
                  padding: "1.2rem 1.4rem",
                  backdropFilter: "blur(6px)"
                }}
              >
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.58rem" }}>
                  INDIE SUMMER ATELIER
                </span>
                <p
                  className="font-serif italic"
                  style={{ fontSize: "1.1rem", marginTop: "4px", color: "var(--color-ivory)" }}
                >
                  "Slow batches. Singular pieces. Zero waste. A second life for beautiful things."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .manifesto-grid {
            grid-template-columns: 1.25fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
