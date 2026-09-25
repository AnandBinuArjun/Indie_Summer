"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useStore } from "../context/StoreContext";

export default function SearchModal() {
  const { searchOpen, setSearchOpen, currency, formatPrice } = useStore();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const filtered = PRODUCTS.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q)
    );
  });

  const getProductPrice = (prod) => {
    switch (currency) {
      case "USD":
        return formatPrice(prod.priceUSD, "USD");
      case "EUR":
        return formatPrice(prod.priceEUR, "EUR");
      case "GBP":
        return formatPrice(prod.priceGBP, "GBP");
      case "AED":
        return formatPrice(prod.priceAED, "AED");
      case "INR":
      default:
        return formatPrice(prod.priceINR, "INR");
    }
  };

  const handleSelect = (prod) => {
    setSearchOpen(false);
    router.push(`/product/${prod.id}`);
  };

  return (
    <div className="overlay-backdrop" onClick={() => setSearchOpen(false)} style={{ zIndex: 140 }}>
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "760px",
          backgroundColor: "var(--color-ivory)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          border: "1px solid var(--color-border)",
          padding: "2rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid var(--color-ink)", paddingBottom: "0.8rem" }}>
          <Search size={22} color="var(--color-ink)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH BY SILK, LINEN, SAREE, OR PROVENANCE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              fontFamily: "var(--font-sans)",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              outline: "none"
            }}
          />
          <button type="button" onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close search">
            <X size={22} />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div style={{ display: "flex", gap: "8px", margin: "1rem 0 1.5rem", flexWrap: "wrap" }}>
          <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.5)", alignSelf: "center", marginRight: "6px" }}>
            SUGGESTIONS:
          </span>
          {["Varanasi Saree", "Banarasi Brocade", "Kanjeevaram", "Zero-Waste Scarf", "Dupatta Set"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              style={{
                padding: "4px 10px",
                border: "1px solid var(--color-border)",
                fontSize: "0.68rem",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                backgroundColor: "var(--color-cream)"
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div style={{ maxHeight: "420px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(14, 13, 13, 0.55)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>NO MATCHING CREATIONS FOUND</p>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", marginTop: "4px" }}>
                Try searching for "saree", "brocade", or "silk"
              </p>
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleSelect(prod)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "55px 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.75rem",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ aspectRatio: "3 / 4", width: "55px", overflow: "hidden" }}>
                  <img src={prod.imagePrimary} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <span className="maru-eyebrow" style={{ fontSize: "0.55rem" }}>{prod.code}</span>
                  <h4 className="font-display" style={{ fontSize: "1.1rem" }}>{prod.name}</h4>
                  <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>{prod.material}</p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>
                    {getProductPrice(prod)}
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
