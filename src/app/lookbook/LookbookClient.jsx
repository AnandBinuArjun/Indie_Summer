"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, X } from "lucide-react";

export default function LookbookClient({ archivePieces }) {
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <>
      {/* Lookbook Gallery */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "4rem 1.8rem",
          marginTop: "4rem"
        }}
      >
        {archivePieces.map((piece) => (
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
                <Sparkles size={11} color="var(--color-siren)" /> 1 OF 1 VINTAGE
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
              <h3 className="font-display text-ink" style={{ fontSize: "1.35rem", marginTop: "2px" }}>
                {piece.name}
              </h3>
              <p className="font-serif italic" style={{ fontSize: "0.82rem", color: "rgba(14, 13, 13, 0.65)" }}>
                {piece.material}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPiece && (
        <div className="overlay-backdrop" onClick={() => setSelectedPiece(null)} style={{ zIndex: 130 }}>
          <div
            className="product-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "680px",
              backgroundColor: "var(--color-ivory)",
              position: "relative",
              padding: "2rem"
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPiece(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div style={{ aspectRatio: "3 / 4", overflow: "hidden" }}>
                <img src={selectedPiece.image} alt={selectedPiece.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                  {selectedPiece.code}
                </span>
                <h3 className="font-display" style={{ fontSize: "2rem", marginTop: "4px" }}>
                  {selectedPiece.name}
                </h3>
                <p className="font-serif italic" style={{ fontSize: "1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "6px" }}>
                  {selectedPiece.material}
                </p>
                <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "rgba(14, 13, 13, 0.8)", marginTop: "1rem" }}>
                  {selectedPiece.story}
                </p>
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Provenance City</span>
                  <span style={{ fontWeight: 700 }}>{selectedPiece.ownerCity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
