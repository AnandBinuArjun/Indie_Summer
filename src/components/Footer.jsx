"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { setDiscount } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setDiscount(10);
  };

  return (
    <footer style={{ backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", borderTop: "1px solid rgba(14, 13, 13, 0.1)", marginTop: "6rem" }}>
      <div className="site-container" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3.5rem 2rem",
            marginBottom: "4rem"
          }}
          className="azar-footer-grid"
        >
          {/* Brand Col */}
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1.2rem" }}>
              <img
                src="/images/logo.png"
                alt="INDIE SUMMER — One Design. One Piece. Never Again."
                style={{
                  height: "72px",
                  maxHeight: "72px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </Link>
            <p style={{ color: "rgba(14, 13, 13, 0.75)", maxWidth: "340px", lineHeight: "1.7", fontSize: "0.95rem", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
              "Slow batches. Singular pieces. Zero waste. A second life for beautiful things."
            </p>
            <p style={{ color: "rgba(14, 13, 13, 0.6)", maxWidth: "340px", lineHeight: "1.6", fontSize: "0.85rem", marginTop: "0.8rem" }}>
              One design. One piece. Never again. Crafted from vintage Indian sarees, dupattas and handworked textiles.
            </p>
          </div>

          {/* Navigation Col with Page Links */}
          <div>
            <div className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
              PAGES
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <Link href="/shop" style={{ color: "rgba(14, 13, 13, 0.8)", transition: "color 0.2s" }}>
                  Shop 1-of-1 Pieces
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/lookbook" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/journal" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  35mm Journal
                </Link>
              </li>
              <li>
                <Link href="/faq" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  Client Care & FAQ
                </Link>
              </li>
              <li>
                <Link href="/track" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" style={{ color: "rgba(14, 13, 13, 0.8)" }}>
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Col */}
          <div>
            <div className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
              CONCIERGE
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "rgba(14, 13, 13, 0.8)" }}
                >
                  Instagram @indiesummer
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--color-siren)", fontWeight: 600 }}
                >
                  WhatsApp VIP Concierge (+91)
                </a>
              </li>
              <li>
                <span style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.8rem", fontStyle: "italic" }}>
                  Bespoke sizing available upon request
                </span>
              </li>
            </ul>
          </div>

          {/* Founding Client Circle Col */}
          <div>
            <div className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
              FOUNDING CLIENT LIST
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <input
                  type="email"
                  required
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "0",
                    borderBottom: "1px solid var(--color-ink)",
                    padding: "0.6rem 0",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    outline: "none"
                  }}
                />

                <button
                  type="submit"
                  className="azar-btn-black"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  JOIN CIRCLE
                </button>

                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(14, 13, 13, 0.6)", lineHeight: "1.6" }}>
                  Receive first notification of newly discovered vintage saree drops. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div style={{ backgroundColor: "var(--color-cream)", padding: "1rem", textAlign: "center" }}>
                <Check size={20} color="var(--color-siren)" style={{ margin: "0 auto 4px" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 700 }}>
                  YOU ARE ENROLLED
                </p>
                <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>
                  Use code INDIE10 for 10% privilege on your first piece.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Rights */}
        <div style={{ paddingTop: "2rem", borderTop: "1px solid rgba(14, 13, 13, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "rgba(14, 13, 13, 0.5)" }}>
            © 2026 INDIE SUMMER. ONE DESIGN. ONE PIECE. NEVER AGAIN.
          </p>

          <div style={{ display: "flex", gap: "1.2rem", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(14, 13, 13, 0.6)", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
            <span>·</span>
            <Link href="/shipping-returns" style={{ color: "inherit", textDecoration: "none" }}>Shipping & Returns</Link>
            <span>·</span>
            <Link href="/admin" style={{ color: "rgba(14, 13, 13, 0.4)", textDecoration: "none" }}>Atelier Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
