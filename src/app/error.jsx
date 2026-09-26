"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { logger } from "../lib/logger";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    logger.error("Route runtime exception intercepted by App Router boundary", error);
  }, [error]);

  return (
    <div
      style={{
        backgroundColor: "var(--color-ink)",
        color: "var(--color-ivory)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          textAlign: "center",
          border: "1px solid rgba(251,251,247,0.15)",
          padding: "3rem 2rem",
          backgroundColor: "#141313"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-siren)",
            backgroundColor: "rgba(169,36,36,0.15)",
            padding: "4px 12px",
            border: "1px solid var(--color-siren)",
            marginBottom: "1.5rem"
          }}
        >
          <AlertCircle size={14} />
          <span className="maru-eyebrow" style={{ fontSize: "0.6rem" }}>
            ATELIER RUNTIME ANOMALY
          </span>
        </div>

        <h1 className="font-display" style={{ fontSize: "2.4rem", lineHeight: "1.1", marginBottom: "0.8rem" }}>
          SOMETHING UNEXPECTED INTERRUPTED YOUR SESSION<span style={{ color: "var(--color-siren)" }}>.</span>
        </h1>

        <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "rgba(251,251,247,0.7)", lineHeight: "1.6", marginBottom: "2rem" }}>
          Our digital atelier encountered a client-side execution interruption. The anomaly has been automatically recorded for concierge review.
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => reset()}
            className="azar-btn-black"
            style={{
              backgroundColor: "var(--color-ivory)",
              color: "var(--color-ink)",
              height: "46px",
              padding: "0 22px",
              fontSize: "0.72rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <RefreshCw size={13} /> RELOAD SESSION
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "46px",
              padding: "0 20px",
              fontSize: "0.72rem",
              fontFamily: "var(--font-sans)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--color-ivory)",
              textDecoration: "none",
              border: "1px solid rgba(251,251,247,0.25)",
              fontWeight: 600
            }}
          >
            <ArrowLeft size={13} /> RETURN TO ATELIER
          </Link>
        </div>
      </div>
    </div>
  );
}
