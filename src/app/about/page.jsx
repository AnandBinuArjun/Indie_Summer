import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PatronTestimonials from "../../components/PatronTestimonials";

export const metadata = {
  title: "Our Philosophy — Slow Batches, Singular Pieces, Zero Waste | INDIE SUMMER",
  description: "We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once it's gone, that exact piece will never exist again."
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "7rem", paddingBottom: "7rem", backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", minHeight: "85vh" }}>
      <div className="site-container">
        {/* Brand Logo & Eyebrow */}
        <div style={{ marginBottom: "2rem" }}>
          <img
            src="/images/logo.png"
            alt="INDIE SUMMER — ONE DESIGN. ONE PIECE. NEVER AGAIN."
            style={{ width: "min(360px, 85vw)", height: "auto", objectFit: "contain", marginBottom: "1.2rem", display: "block" }}
          />
          <p className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
            THE ATELIER PHILOSOPHY
          </p>
        </div>

        {/* Big Bold Headline */}
        <h1
          className="font-display text-ink"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            marginBottom: "2.5rem"
          }}
        >
          ONE DESIGN.<br />
          ONE PIECE.<br />
          NEVER AGAIN<span className="text-siren">.</span>
        </h1>

        {/* Story Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem", alignItems: "start" }} className="about-manifesto-grid">
          <div>
            <p
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
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
                  fontSize: "1.2rem",
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
                marginTop: "3.5rem",
                paddingTop: "2.5rem",
                borderTop: "1px solid var(--color-border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "2rem"
              }}
            >
              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.65rem" }}>01</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                  SLOW BATCHES
                </h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px", lineHeight: "1.5" }}>
                  Crafted mindfully in limited, thoughtful capsules.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.65rem" }}>02</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                  SINGULAR PIECES
                </h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px", lineHeight: "1.5" }}>
                  1 of 1 in the entire world. No replicas ever.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.65rem" }}>03</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                  ZERO WASTE
                </h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px", lineHeight: "1.5" }}>
                  Remnants reborn into scarves & neck pieces.
                </p>
              </div>

              <div>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.65rem" }}>04</span>
                <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                  A SECOND LIFE
                </h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px", lineHeight: "1.5" }}>
                  Heirloom vintage textiles reborn for summer.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "3rem" }}>
              <Link href="/shop" className="azar-btn-black">
                EXPLORE INAUGURAL PIECES <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Visual Image */}
          <div>
            <div style={{ aspectRatio: "3 / 4", width: "100%", overflow: "hidden", backgroundColor: "var(--color-cream)", position: "relative" }}>
              <img
                src="/images/piece-crimson-saree.jpg"
                alt="Vintage Indian saree textile crafted into modern resort slip"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  backgroundColor: "rgba(14, 13, 13, 0.92)",
                  color: "var(--color-ivory)",
                  padding: "1.5rem",
                  backdropFilter: "blur(6px)"
                }}
              >
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                  INDIE SUMMER ATELIER
                </span>
                <p className="font-serif italic" style={{ fontSize: "1.2rem", marginTop: "6px", color: "var(--color-ivory)", lineHeight: "1.4" }}>
                  "Slow batches. Singular pieces. Zero waste. A second life for beautiful things."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collector Impressions & Verified Provenance */}
      <div style={{ marginTop: "4rem" }}>
        <PatronTestimonials />
      </div>
    </main>
  );
}
