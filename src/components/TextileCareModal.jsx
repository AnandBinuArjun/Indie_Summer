"use client";

import React from "react";
import { X, Sparkles, Wind, Droplets, Sun, ShieldAlert, Award } from "lucide-react";

export default function TextileCareModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

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
        <div style={{ marginBottom: "1.8rem" }}>
          <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
            CONSERVATION & HEIRLOOM LONGEVITY
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
            ARCHIVAL TEXTILE CARE PROTOCOL
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(14, 13, 13, 0.7)",
              marginTop: "6px",
              lineHeight: 1.5
            }}
          >
            Vintage sarees, antique zari brocades, and zero-waste silk relics require intentional preservation. Follow this conservation protocol to maintain lustre for generations.
          </p>
        </div>

        {/* Protocol Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.8rem" }}>
          {/* Hydrocarbon Dry Clean Only */}
          <div
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
              padding: "1.2rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Droplets size={18} color="var(--color-siren)" />
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                HYDROCARBON DRY-CLEAN ONLY
              </h4>
            </div>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
              Never machine wash, hand-soak, or expose to perchloroethylene chemicals. Always request gentle hydrocarbon dry cleaning to safeguard real silver & gold electroplated zari threads.
            </p>
          </div>

          {/* Pure Muslin Mul-Mul Wrapping */}
          <div
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
              padding: "1.2rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Wind size={18} color="var(--color-siren)" />
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                BREATHABLE MUSLIN STORAGE
              </h4>
            </div>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
              Store folded in the complimentary unbleached cotton mul-mul bag provided with your order. Avoid plastic covers or polythene bags, which trap humidity and cause zari tarnishing.
            </p>
          </div>

          {/* Indirect Sunlight & Aeration */}
          <div
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
              padding: "1.2rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Sun size={18} color="var(--color-siren)" />
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                AERATION & SUNLIGHT CARE
              </h4>
            </div>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
              Air the piece in an indirect, shaded breezy room twice a year. Keep away from intense UV sunlight to protect natural vegetable dyes and ancient mineral pigments.
            </p>
          </div>

          {/* Steaming Protocol */}
          <div
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
              padding: "1.2rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Sparkles size={18} color="var(--color-siren)" />
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                REVERSE VERTICAL STEAM ONLY
              </h4>
            </div>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
              Do not touch hot metal iron plates directly to brocade surface or zari embroidery. Use a handheld vertical garment steamer on low setting, or iron strictly from the reverse side with a damp press cloth.
            </p>
          </div>
        </div>

        {/* Vintage Character Notice */}
        <div
          style={{
            borderLeft: "3px solid var(--color-siren)",
            backgroundColor: "rgba(229, 56, 38, 0.04)",
            padding: "1rem 1.2rem",
            marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <Award size={15} color="var(--color-siren)" />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-siren)" }}>
              THE NOBILITY OF PATINA & ARCHIVAL AGE
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "rgba(14, 13, 13, 0.75)" }}>
            Because our garments are upcycled from 30 to 60-year-old preserved Indian heirlooms, slight natural irregularities in the weave, yarn slubs, or soft softening of the metallic thread are not flaws — they are the authentic provenance of a garment that has lived a century before reaching you.
          </p>
        </div>

        {/* Close Button Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            className="azar-btn-black"
            style={{ height: "44px", fontSize: "0.75rem", padding: "0 24px" }}
          >
            UNDERSTOOD · CLOSE PROTOCOL
          </button>
        </div>
      </div>
    </div>
  );
}
