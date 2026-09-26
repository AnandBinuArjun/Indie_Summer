"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function PatronTestimonials() {
  const testimonials = [
    {
      id: "1",
      quote:
        "Opening the wax-sealed box felt like receiving an artifact from a private museum archive. The weight and drape of the 1960s Banarasi zari against bare skin is something modern mass luxury cannot replicate.",
      author: "Dr. Arundhati M.",
      location: "Malabar Hill, Mumbai",
      acquiredPiece: "Acquired #IS-002 · The Emerald Brocade Gown",
      date: "Volume 001 Inaugural Patron"
    },
    {
      id: "2",
      quote:
        "I wore the Varanasi Crimson Pallu Slip to a private dinner in Mayfair. Two separate fashion archivists inquired about the textile house. Knowing no other soul on earth can purchase this exact silhouette is true quiet luxury.",
      author: "Tara S.",
      location: "London & New Delhi",
      acquiredPiece: "Acquired #IS-001 · The Varanasi Crimson Pallu Slip",
      date: "Volume 001 Inaugural Patron"
    },
    {
      id: "3",
      quote:
        "The atelier preserved the selvedge of the antique South Indian saree with profound architectural reverence. The hand-signed Certificate of Provenance now lives in my dressing suite.",
      author: "Gayatri P.",
      location: "Indiranagar, Bangalore",
      acquiredPiece: "Acquired #IS-004 · The Ochre Temple Brocade",
      date: "Volume 001 Inaugural Patron"
    }
  ];

  const metrics = [
    { value: "100%", label: "Singular Exclusivity", desc: "One piece per design. Never reproduced." },
    { value: "0%", label: "Atelier Fabric Waste", desc: "All remnants upcycled into silk scarves & ribbons." },
    { value: "40+ Yrs", label: "Archival Heritage", desc: "Average era of curated vintage Indian handlooms." },
    { value: "48 Hrs", label: "Insured Air Transit", desc: "BlueDart Express across India & DHL worldwide." }
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--color-cream)",
        color: "var(--color-ink)",
        padding: "6.5rem 0",
        position: "relative",
        borderTop: "1px solid var(--color-border)"
      }}
    >
      <div className="site-container">
        {/* Section Eyebrow & Title */}
        <div style={{ maxWidth: "720px", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.8rem" }}>
            <Sparkles size={15} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", letterSpacing: "0.2em" }}>
              PATRON IMPRESSIONS & COLLECTOR PROVENANCE
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              color: "var(--color-ink)"
            }}
          >
            VOICES OF THE INAUGURAL CIRCLE<span style={{ color: "var(--color-siren)" }}>.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1.15rem",
              color: "rgba(14, 13, 13, 0.75)",
              marginTop: "1.2rem",
              lineHeight: 1.6
            }}
          >
            &quot;When you wear an archival garment, you do not simply wear couture — you become the custodian of someone&apos;s heirloom memory.&quot;
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            marginBottom: "4.5rem"
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--color-border)",
                padding: "2.4rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)"
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "3.2rem",
                    lineHeight: 0.8,
                    display: "block",
                    color: "var(--color-siren)",
                    opacity: 0.85,
                    marginBottom: "0.8rem"
                  }}
                >
                  &ldquo;
                </span>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "rgba(14, 13, 13, 0.85)",
                    fontFamily: "var(--font-sans)"
                  }}
                >
                  {t.quote}
                </p>
              </div>

              <div style={{ paddingTop: "1.4rem", borderTop: "1px dashed var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                    {t.author}
                  </h4>
                  <CheckCircle2 size={13} color="var(--color-siren)" />
                </div>
                <p style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.55)", marginTop: "2px" }}>
                  {t.location} · {t.date}
                </p>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    backgroundColor: "rgba(229, 56, 38, 0.08)",
                    border: "1px solid rgba(229, 56, 38, 0.25)",
                    color: "var(--color-siren)",
                    padding: "3px 8px",
                    fontSize: "0.62rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600
                  }}
                >
                  {t.acquiredPiece}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Provenance & Craftsmanship Guarantee Metrics */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "3.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem"
          }}
        >
          {metrics.map((m, idx) => (
            <div key={idx}>
              <span
                className="font-display"
                style={{
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  color: "var(--color-siren)",
                  display: "block",
                  lineHeight: 1
                }}
              >
                {m.value}
              </span>
              <h4
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: "6px",
                  color: "var(--color-ink)"
                }}
              >
                {m.label}
              </h4>
              <p style={{ fontSize: "0.76rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px", lineHeight: 1.5 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
