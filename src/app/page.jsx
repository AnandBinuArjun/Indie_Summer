import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";

export const metadata = {
  title: "INDIE SUMMER — One Design. One Piece. Never Again.",
  description: "One piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Slow batches. Singular pieces. Zero waste."
};

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3);

  return (
    <div>
      {/* Full-Screen Hero Viewport matching Azar & Brand Identity */}
      <section className="azar-hero-viewport" style={{ position: "relative" }}>
        <img
          src="/images/hero.jpg"
          alt="Indie Summer vintage silk resort collection"
          className="azar-hero-bg"
          priority="true"
        />
        <div className="azar-hero-gradient" />

        <div className="site-container azar-hero-content" style={{ display: "flex", flexDirection: "column", minHeight: "100%", justifyContent: "space-between" }}>
          {/* Top Brand Tagline */}
          <div style={{ paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="maru-eyebrow" style={{ color: "rgba(251, 251, 247, 0.75)", fontSize: "0.68rem", letterSpacing: "0.28em" }}>
              INAUGURAL DROP — VOL. 001
            </span>
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.68rem", letterSpacing: "0.28em" }}>
              LIVE FOR ACQUISITION
            </span>
          </div>

          {/* Center Editorial Reveal */}
          <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "2.5rem 0" }}>
            <img
              src="/images/logo-light.png"
              alt="INDIE SUMMER — ONE DESIGN. ONE PIECE. NEVER AGAIN."
              style={{
                width: "min(360px, 80vw)",
                height: "auto",
                objectFit: "contain",
                marginBottom: "1rem",
                filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.5))"
              }}
            />

            <h1
              className="font-display text-ivory"
              style={{
                fontSize: "clamp(3rem, 9vw, 8rem)",
                lineHeight: 0.84,
                marginTop: "0.4rem",
                marginBottom: "1rem",
                letterSpacing: "-0.01em"
              }}
            >
              A SECOND LIFE FOR<br />
              BEAUTIFUL THINGS<span className="text-siren">.</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
                color: "rgba(251, 251, 247, 0.9)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                maxWidth: "680px",
                lineHeight: 1.45,
                marginTop: "0.4rem"
              }}
            >
              Crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again.
            </p>

            <p
              className="maru-eyebrow text-ivory"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.26em",
                lineHeight: 2.2,
                marginTop: "1rem",
                color: "var(--color-siren)",
                fontWeight: 700
              }}
            >
              SLOW BATCHES · SINGULAR PIECES · ZERO WASTE
            </p>

            {/* CTAs */}
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/shop"
                className="azar-btn-white"
                style={{ minWidth: "240px", height: "52px" }}
              >
                ENTER SHOP (VOL. 001) <ArrowRight size={15} />
              </Link>

              <Link
                href="/about"
                className="azar-btn-white"
                style={{
                  minWidth: "220px",
                  height: "52px",
                  backgroundColor: "transparent",
                  color: "var(--color-ivory)",
                  border: "1px solid rgba(251, 251, 247, 0.5)"
                }}
              >
                OUR PHILOSOPHY
              </Link>
            </div>

            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                lineHeight: 1.9,
                letterSpacing: "0.3em",
                color: "rgba(251, 251, 247, 0.65)",
                marginTop: "1.5rem"
              }}
            >
              EACH PIECE IS DESIGNED AROUND THE FABRIC WE FIND · NEVER MASS PRODUCED
            </p>
          </div>

          {/* Bottom Status Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.8rem",
              paddingBottom: "1.5rem",
              borderTop: "1px solid rgba(251, 251, 247, 0.15)",
              paddingTop: "0.8rem"
            }}
          >
            <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(251, 251, 247, 0.6)" }}>
              PAN-INDIA EXPRESS AIR DELIVERY (BLUEDART) · COMPLIMENTARY OVER ₹5,000
            </p>
            <p style={{ fontSize: "0.88rem", textTransform: "lowercase", letterSpacing: "0.025em", color: "rgba(251, 251, 247, 0.7)" }}>
              slow batches. singular pieces. zero waste.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Preview Section (SSR rendered) */}
      <section style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", padding: "7rem 0" }}>
        <div className="site-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.5rem" }}>
                INAUGURAL SELECTION · 1-OF-1 CREATIONS
              </span>
              <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                DISCOVER 1-OF-1 PIECES<span className="text-siren">.</span>
              </h2>
            </div>

            <Link
              href="/shop"
              className="azar-btn-black"
              style={{ padding: "0.8rem 1.8rem", height: "auto" }}
            >
              VIEW ALL 8 CREATIONS <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3.5rem 1.8rem" }}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
