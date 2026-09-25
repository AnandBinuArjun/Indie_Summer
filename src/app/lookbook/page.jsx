import React from "react";
import Link from "next/link";
import { ARCHIVE_PIECES } from "../../data/products";
import LookbookClient from "./LookbookClient";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Archival Lookbook — One-of-One Relics | INDIE SUMMER",
  description: "Browse the visual archive of past singular vintage saree silhouettes, artisanal heirlooms, and zero-waste designs now residing in personal collections across the globe."
};

export default function LookbookPage() {
  return (
    <main
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-cream)",
        color: "var(--color-ink)",
        minHeight: "85vh"
      }}
    >
      <div className="site-container">
        {/* Editorial Header */}
        <div style={{ maxWidth: "750px", margin: "0 auto", textAlign: "center" }}>
          <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
            ARCHIVE · ONCE IN EXISTENCE
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 0.9
            }}
          >
            THE LOOKBOOK<span className="text-siren">.</span>
          </h1>
          <p
            className="font-serif italic"
            style={{
              fontSize: "1.25rem",
              color: "rgba(14, 13, 13, 0.7)",
              marginTop: "1.2rem",
              lineHeight: "1.5"
            }}
          >
            A museum of past works. Each piece below was cut from a unique vintage textile, worn once, and will never be reproduced again.
          </p>
        </div>

        {/* Client Gallery with Modal */}
        <LookbookClient archivePieces={ARCHIVE_PIECES} />

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <Link href="/shop" className="azar-btn-black">
            EXPLORE CURRENT ONE-OF-ONE RELEASES <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
