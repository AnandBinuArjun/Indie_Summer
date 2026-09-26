"use client";

import React, { useState } from "react";
import { X, Ruler, Scissors, Sparkles, MessageCircle } from "lucide-react";

export default function SizeGuideModal({ isOpen, onClose, product }) {
  const [unit, setUnit] = useState("inches"); // "inches" | "cm"

  if (!isOpen) return null;

  const measurementsInches = [
    { size: "XS", bust: '32" - 33"', waist: '25" - 26"', hip: '35" - 36"', length: '56"', shoulder: '14"' },
    { size: "S", bust: '34" - 35"', waist: '27" - 28"', hip: '37" - 38"', length: '56.5"', shoulder: '14.5"' },
    { size: "M", bust: '36" - 37"', waist: '29" - 30"', hip: '39" - 40"', length: '57"', shoulder: '15"' },
    { size: "L", bust: '38" - 40"', waist: '31" - 33"', hip: '41" - 43"', length: '57.5"', shoulder: '15.5"' },
    { size: "Free Size / 1-of-1", bust: '32" - 38"', waist: '25" - 32"', hip: '35" - 42"', length: '56" - 58"', shoulder: '14" - 15.5"' }
  ];

  const measurementsCm = [
    { size: "XS", bust: "81 - 84 cm", waist: "63 - 66 cm", hip: "89 - 92 cm", length: "142 cm", shoulder: "35.5 cm" },
    { size: "S", bust: "86 - 89 cm", waist: "68 - 71 cm", hip: "94 - 97 cm", length: "143.5 cm", shoulder: "37 cm" },
    { size: "M", bust: "91 - 94 cm", waist: "74 - 76 cm", hip: "99 - 102 cm", length: "145 cm", shoulder: "38 cm" },
    { size: "L", bust: "96 - 102 cm", waist: "79 - 84 cm", hip: "104 - 109 cm", length: "146 cm", shoulder: "39.5 cm" },
    { size: "Free Size / 1-of-1", bust: "81 - 96 cm", waist: "63 - 81 cm", hip: "89 - 107 cm", length: "142 - 147 cm", shoulder: "35.5 - 39.5 cm" }
  ];

  const activeMeasurements = unit === "inches" ? measurementsInches : measurementsCm;

  return (
    <div
      className="overlay-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(14, 13, 13, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 140,
        padding: "1rem"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--color-ivory)",
          border: "1.5px solid var(--color-ink)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          padding: "2.4rem",
          position: "relative"
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            color: "var(--color-ink)"
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
            ATELIER FIT & PROPORTION ARCHITECTURE
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              lineHeight: 1,
              marginTop: "4px",
              color: "var(--color-ink)"
            }}
          >
            MEASUREMENTS & TAILORING GUIDE
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(14, 13, 13, 0.7)",
              marginTop: "6px",
              lineHeight: 1.5
            }}
          >
            Each 1-of-1 Indie Summer garment is uniquely pattern-drafted in our Goa atelier around the archival saree border and drape.
          </p>
        </div>

        {/* Unit Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.2rem",
            paddingBottom: "0.8rem",
            borderBottom: "1px dashed var(--color-border)"
          }}
        >
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            {product?.name ? `PIECE: ${product.name}` : "STANDARD ATELIER METRICS"}
          </span>

          <div style={{ display: "flex", border: "1px solid var(--color-ink)" }}>
            <button
              type="button"
              onClick={() => setUnit("inches")}
              style={{
                padding: "4px 12px",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                backgroundColor: unit === "inches" ? "var(--color-ink)" : "transparent",
                color: unit === "inches" ? "var(--color-ivory)" : "var(--color-ink)",
                border: "none",
                cursor: "pointer"
              }}
            >
              INCHES
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              style={{
                padding: "4px 12px",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                backgroundColor: unit === "cm" ? "var(--color-ink)" : "transparent",
                color: unit === "cm" ? "var(--color-ivory)" : "var(--color-ink)",
                border: "none",
                cursor: "pointer"
              }}
            >
              CENTIMETRES
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        <div style={{ overflowX: "auto", marginBottom: "1.8rem" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8rem",
              fontFamily: "var(--font-sans)",
              textAlign: "left"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--color-ink)" }}>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>SIZE</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>BUST</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>WAIST</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>HIP</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>LENGTH</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.68rem" }}>SHOULDER</th>
              </tr>
            </thead>
            <tbody>
              {activeMeasurements.map((m, idx) => (
                <tr
                  key={m.size}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: idx % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent"
                  }}
                >
                  <td style={{ padding: "10px", fontWeight: 700, color: "var(--color-siren)" }}>{m.size}</td>
                  <td style={{ padding: "10px" }}>{m.bust}</td>
                  <td style={{ padding: "10px" }}>{m.waist}</td>
                  <td style={{ padding: "10px" }}>{m.hip}</td>
                  <td style={{ padding: "10px" }}>{m.length}</td>
                  <td style={{ padding: "10px" }}>{m.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bespoke Seam Allowance Guarantee */}
        <div
          style={{
            backgroundColor: "var(--color-cream)",
            border: "1px solid var(--color-border)",
            padding: "1.2rem",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start"
          }}
        >
          <Scissors size={20} color="var(--color-siren)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: "4px"
              }}
            >
              +2-INCH INTERIOR ARCHIVAL SEAM MARGIN
            </h4>
            <p style={{ fontSize: "0.78rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
              To ensure longevity and heirloom transfer, our master tailors preserve up to 2 inches (5 cm) of interior seam allowance inside the bodice and side seams. Any fine alterations or letting out can be performed without compromising the exterior zari architecture.
            </p>
          </div>
        </div>

        {/* Model Spec Note & Concierge Tailoring */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--color-border)"
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.65)" }}>
            <strong>Model Spec:</strong> 5&apos;10&quot; (178 cm) · Bust 33&quot; · Waist 25&quot; · Hips 36&quot; wearing Size S / Relaxed Fit.
          </div>

          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hello Indie Summer Atelier. I need bespoke fit & measurement guidance for ${product?.name || "a 1-of-1 piece"}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1E5638",
              textDecoration: "underline"
            }}
          >
            <MessageCircle size={14} /> Request Custom Atelier Fit Advice →
          </a>
        </div>
      </div>
    </div>
  );
}
