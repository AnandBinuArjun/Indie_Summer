import React from "react";
import Link from "next/link";
import { FAQS } from "../../data/products";
import FaqClient from "./FaqClient";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Client Care & FAQ | INDIE SUMMER",
  description: "Frequently asked questions regarding our one-of-one vintage saree garments, zero-waste remade philosophy, international express shipping, and silk care."
};

export default function FaqPage() {
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
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
              FREQUENT INQUIRIES
            </span>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "-0.01em",
                lineHeight: 0.95
              }}
            >
              CLIENT CARE & FAQ<span className="text-siren">.</span>
            </h1>
            <p
              className="font-serif italic"
              style={{
                fontSize: "1.1rem",
                color: "rgba(14, 13, 13, 0.7)",
                marginTop: "1rem"
              }}
            >
              Everything about our vintage saree one-of-one pieces, zero waste ethos, and Pan-India express delivery.
            </p>
          </div>

          <FaqClient faqs={FAQS} />

          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href="/shop" className="azar-btn-black">
              RETURN TO ATELIER SHOP <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
