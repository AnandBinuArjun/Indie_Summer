import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ onShopClick, onJoinVIP }) {
  return (
    <section className="azar-hero-viewport">
      {/* Background Image & Editorial Overlay */}
      <img
        src="/images/hero.jpg"
        alt="Indie Summer vintage silk resort collection"
        className="azar-hero-bg"
        loading="eager"
      />
      <div className="azar-hero-gradient" />

      <div className="site-container azar-hero-content">
        {/* Top Header matching Azar */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              onShopClick();
            }}
            aria-label="INDIE SUMMER home"
            style={{ textDecoration: "none" }}
          >
            <span className="brand-logo-text text-ivory" aria-label="INDIE SUMMER the label">
              <span>INDIE SUMMER</span>
              <sup className="brand-sup text-ivory">the label</sup>
            </span>
          </a>

          <nav aria-label="Primary navigation" style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "1.5rem", paddingTop: "6px" }}>
            <button
              type="button"
              onClick={onShopClick}
              className="maru-link text-ivory"
            >
              SHOP
            </button>
            <a
              href="#about"
              className="maru-link text-ivory"
            >
              PHILOSOPHY
            </a>
            <a
              href="#lookbook"
              className="maru-link text-ivory"
            >
              LOOKBOOK
            </a>
            <a
              href="#editorial"
              className="maru-link text-ivory"
            >
              JOURNAL
            </a>
            <a
              href="#faq"
              className="maru-link text-ivory"
            >
              FAQ
            </a>
          </nav>
        </header>

        {/* Center Editorial Reveal with Brand Story */}
        <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "2.5rem 0" }}>
          <p className="maru-eyebrow" style={{ color: "rgba(251, 251, 247, 0.8)", fontSize: "0.72rem", letterSpacing: "0.34em" }}>
            ONE DESIGN · ONE PIECE · NEVER AGAIN
          </p>

          <h1
            className="font-display text-ivory"
            style={{
              fontSize: "clamp(3rem, 10vw, 8.8rem)",
              lineHeight: 0.82,
              marginTop: "1.2rem",
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
              color: "rgba(251, 251, 247, 0.88)",
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

          {/* Primary Action Buttons */}
          <div style={{ marginTop: "1.8rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onShopClick}
              className="azar-btn-white"
              style={{ minWidth: "240px", height: "52px" }}
            >
              EXPLORE 1-OF-1 PIECES <ArrowRight size={15} />
            </button>

            <a
              href="#about"
              className="azar-btn-white"
              style={{
                minWidth: "220px",
                height: "52px",
                backgroundColor: "transparent",
                color: "var(--color-ivory)",
                border: "1px solid rgba(251, 251, 247, 0.5)"
              }}
            >
              READ OUR STORY
            </a>
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

        {/* Bottom Status Bar matching Azar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.8rem",
            paddingBottom: "0.5rem"
          }}
        >
          <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(251, 251, 247, 0.5)" }}>
            INAUGURAL CAPSULE — LIVE FOR ORDERS (PAN-INDIA EXPRESS)
          </p>
          <p style={{ fontSize: "0.88rem", textTransform: "lowercase", letterSpacing: "0.025em", color: "rgba(251, 251, 247, 0.6)" }}>
            slow batches. singular pieces.
          </p>
        </div>
      </div>
    </section>
  );
}
