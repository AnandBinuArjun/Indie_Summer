"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("indie_summer_cookie_consent");
      if (!consent) {
        // Subtle delay so it doesn't jarringly pop up on first byte
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleConsent = (level) => {
    try {
      localStorage.setItem("indie_summer_cookie_consent", level);
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: "680px",
        backgroundColor: "var(--color-ink)",
        color: "var(--color-ivory)",
        border: "1px solid rgba(251, 251, 247, 0.2)",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.45)",
        zIndex: 110,
        padding: "1.2rem 1.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}
    >
      <div style={{ flex: 1, minWidth: "260px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <ShieldCheck size={13} color="var(--color-siren)" />
          <span className="maru-eyebrow" style={{ color: "#E0D7C6", fontSize: "0.58rem", letterSpacing: "0.18em" }}>
            PATRON PRIVACY & PREFERENCES
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(251, 251, 247, 0.75)", lineHeight: "1.5" }}>
          We use strictly essential first-party cookies to preserve your shopping bag, currency preference, and provenance reservations. Review our{" "}
          <Link href="/privacy" style={{ color: "var(--color-ivory)", textDecoration: "underline" }}>
            Privacy Policy
          </Link>.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={() => handleConsent("accepted")}
          style={{
            backgroundColor: "var(--color-ivory)",
            color: "var(--color-ink)",
            border: "none",
            padding: "8px 16px",
            fontSize: "0.7rem",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer"
          }}
        >
          ACCEPT
        </button>
        <button
          type="button"
          onClick={() => handleConsent("essential")}
          style={{
            backgroundColor: "transparent",
            color: "rgba(251, 251, 247, 0.65)",
            border: "1px solid rgba(251, 251, 247, 0.25)",
            padding: "8px 14px",
            fontSize: "0.7rem",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer"
          }}
        >
          ESSENTIAL ONLY
        </button>
      </div>
    </div>
  );
}
