import React, { useState } from "react";
import { ARCHIVE_PIECES } from "../data/products";
import { Sparkles, MapPin, Eye } from "lucide-react";

export default function ArchiveSection({ onSelectPiece }) {
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <section id="lookbook" style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", paddingTop: "6rem", paddingBottom: "6rem", borderTop: "1px solid var(--color-border)" }}>
      <div className="site-container">
        {/* Lookbook Header matching Azar */}
        <div style={{ maxWidth: "1000px", marginBottom: "4rem" }}>
          <p className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.2rem" }}>
            INAUGURAL CAPSULE · LOOKBOOK
          </p>

          <h2
            className="font-display text-ink"
            style={{
              fontSize: "clamp(4rem, 10vw, 8.5rem)",
              lineHeight: 0.85,
              textTransform: "uppercase",
              letterSpacing: "-0.01em"
            }}
          >
            VOL. 001 LOOKBOOK<span className="text-siren">.</span>
          </h2>

          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
              color: "var(--color-ink)",
              marginTop: "1.2rem"
            }}
          >
            GOA & MUMBAI → INAUGURAL SILHOUETTES
          </p>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: "1.65",
              color: "rgba(14, 13, 13, 0.75)",
              marginTop: "1rem",
              maxWidth: "640px"
            }}
          >
            Every 1-of-1 silhouette in our inaugural drop is individually crafted from pure hand-dyed Indian silk. When a piece is acquired, it enters our permanent client ledger.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "4rem 1.8rem"
          }}
        >
          {ARCHIVE_PIECES.map((piece) => (
            <div
              key={piece.id}
              onClick={() => setSelectedPiece(piece)}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  backgroundColor: "var(--color-cream)"
                }}
              >
                <img
                  src={piece.image}
                  alt={piece.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease"
                  }}
                  loading="lazy"
                />

                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "var(--color-ink)",
                    color: "var(--color-ivory)",
                    padding: "4px 8px",
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <Sparkles size={11} color="var(--color-siren)" /> 1-OF-1 SIGNATURE
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    right: "12px",
                    backgroundColor: "rgba(251, 251, 247, 0.94)",
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 600
                    }}
                  >
                    <MapPin size={12} color="var(--color-siren)" /> {piece.ownerCity}
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                    {piece.soldPrice}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "0.85rem" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.58rem" }}>
                  {piece.code}
                </span>
                <h4 className="font-display text-ink" style={{ fontSize: "1.3rem", marginTop: "2px" }}>
                  {piece.name}
                </h4>
                <p className="font-serif italic" style={{ fontSize: "0.82rem", color: "rgba(14, 13, 13, 0.65)" }}>
                  {piece.material}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Founding Circle Box */}
        <div
          id="vip-list"
          style={{
            marginTop: "6rem",
            backgroundColor: "var(--color-ink)",
            color: "var(--color-ivory)",
            padding: "4.5rem 2rem",
            textAlign: "center"
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
              FOUNDING CLIENT PRIVILEGE
            </p>
            <h3
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
                lineHeight: 0.92,
                marginBottom: "1rem"
              }}
            >
              10% OFF YOUR FIRST PIECE
            </h3>
            <p
              className="font-serif italic"
              style={{
                fontSize: "1.1rem",
                color: "rgba(251, 251, 247, 0.8)",
                marginBottom: "1.8rem"
              }}
            >
              Welcome to the beginning of Indie Summer. Use code <strong style={{ color: "#FFF", letterSpacing: "0.1em" }}>INDIE10</strong> at checkout for 10% founding patron privilege and complimentary express delivery.
            </p>
            <a
              href="#shop"
              className="azar-btn-white"
            >
              SHOP ALL CREATIONS NOW
            </a>
          </div>
        </div>
      </div>

      {/* Selected Piece Modal */}
      {selectedPiece && (
        <div className="overlay-backdrop" onClick={() => setSelectedPiece(null)} style={{ zIndex: 120 }}>
          <div
            className="checkout-modal-inner"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--color-ivory)",
              color: "var(--color-ink)",
              maxWidth: "480px",
              padding: "2rem",
              textAlign: "center",
              position: "relative"
            }}
          >
            <img
              src={selectedPiece.image}
              alt={selectedPiece.name}
              style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", marginBottom: "1.2rem" }}
            />
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
              INAUGURAL 1-OF-1 SILHOUETTE
            </span>
            <h3 className="font-display" style={{ fontSize: "1.8rem", margin: "0.4rem 0" }}>
              {selectedPiece.name}
            </h3>
            <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "rgba(14, 13, 13, 0.7)", marginBottom: "1rem" }}>
              {selectedPiece.story}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", fontSize: "0.85rem", fontWeight: 600 }}>
              <span>VALUED AT: {selectedPiece.soldPrice}</span>
              <span>INSPIRED BY: {selectedPiece.ownerCity}</span>
            </div>
            <button
              type="button"
              className="azar-btn-black"
              onClick={() => setSelectedPiece(null)}
              style={{ marginTop: "1.5rem", width: "100%" }}
            >
              CLOSE ATELIER CARD
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
