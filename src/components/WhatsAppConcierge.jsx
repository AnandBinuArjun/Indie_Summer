"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Sparkles, ShieldCheck } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { siteSettings, products } = useStore();

  const phone = (siteSettings?.phoneContact || "+91 98200 45892").replace(/[^0-9]/g, "");

  // Detect current product if on product page
  let currentPieceCode = "";
  let currentPieceName = "";
  if (pathname.startsWith("/product/")) {
    const id = pathname.split("/product/")[1]?.split("#")[0];
    const prod = products.find((p) => p.id === id);
    if (prod) {
      currentPieceCode = prod.code;
      currentPieceName = prod.name;
    }
  }

  const defaultMessage = currentPieceCode
    ? `Hello Indie Summer Atelier, I am inquiring about 1-of-1 archival piece: ${currentPieceName} (${currentPieceCode}). Can you share tailoring measurements and fabric drape details?`
    : `Hello Indie Summer Atelier, I am browsing the collection and have a concierge inquiry regarding sizing, custom tailoring, and private acquisitions.`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  // Don't obscure checkout when modal is open or admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 90,
        fontFamily: "var(--font-sans)"
      }}
    >
      {/* Popover Card */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "64px",
            right: "0",
            width: "320px",
            backgroundColor: "#FBFBF7",
            border: "1px solid #D8C7A5",
            boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
            padding: "1.4rem",
            color: "var(--color-ink)",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
            <div>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.58rem" }}>
                HAUTE VINTAGE ATELIER
              </span>
              <h4 className="font-display" style={{ fontSize: "1.3rem", margin: "2px 0 0 0" }}>
                DIRECT STYLIST DESK
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              aria-label="Close concierge"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", lineHeight: "1.5", marginBottom: "1rem" }}>
            Speak directly with our Goa studio for exact measurements, silk provenance, custom sizing alterations, or private viewings.
          </p>

          {currentPieceCode && (
            <div
              style={{
                backgroundColor: "var(--color-cream)",
                border: "1px solid var(--color-border)",
                padding: "8px 10px",
                fontSize: "0.7rem",
                marginBottom: "1rem"
              }}
            >
              <span style={{ fontWeight: 700, display: "block" }}>Active Inquiry:</span>
              <span style={{ color: "var(--color-siren)" }}>{currentPieceName}</span> ({currentPieceCode})
            </div>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "var(--color-ink)",
              color: "var(--color-ivory)",
              padding: "12px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none"
            }}
          >
            <MessageCircle size={15} color="#25D366" />
            CONNECT ON WHATSAPP
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center", marginTop: "10px", fontSize: "0.62rem", color: "#888" }}>
            <ShieldCheck size={11} />
            <span>Assagao, Goa Studio · Active Mon–Sat</span>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--color-ink)",
          color: "var(--color-ivory)",
          border: "1px solid rgba(251,251,247,0.25)",
          padding: "10px 16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
          cursor: "pointer",
          borderRadius: "0",
          transition: "transform 0.2s ease"
        }}
        aria-label="Atelier WhatsApp Concierge"
      >
        <MessageCircle size={16} color="#25D366" />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          ATELIER CONCIERGE
        </span>
      </button>
    </div>
  );
}
