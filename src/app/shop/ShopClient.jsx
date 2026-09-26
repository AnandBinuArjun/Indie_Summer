"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import { Grid, Columns, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

export default function ShopClient({ initialProducts }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [availability, setAvailability] = useState("all"); // "all" | "ready" | "auction"
  const [sortBy, setSortBy] = useState("featured");
  const [colsMode, setColsMode] = useState("3");

  const colorOptions = [
    { id: "all", label: "All Hues", hex: null },
    { id: "crimson", label: "Crimson & Siren", hex: "#A92424" },
    { id: "emerald", label: "Imperial Emerald", hex: "#1E5638" },
    { id: "ochre", label: "Ochre & Gold", hex: "#C29547" },
    { id: "noir", label: "Midnight Noir", hex: "#0E0D0D" },
    { id: "ivory", label: "Ivory & Ecru", hex: "#EAE6DF" }
  ];

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedColor("all");
    setAvailability("all");
    setSortBy("featured");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedColor !== "all" || availability !== "all" || sortBy !== "featured";

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((prod) => {
        // Category Filter
        if (selectedCategory === "bidding" && !prod.isBidding) return false;
        if (selectedCategory === "vintage-saree" && prod.category !== "vintage-saree") return false;
        if (selectedCategory === "vintage-dupatta" && prod.category !== "vintage-dupatta") return false;
        if (selectedCategory === "remnants" && prod.category !== "remnants") return false;

        // Availability Filter
        if (availability === "auction" && !prod.isBidding) return false;
        if (availability === "ready" && prod.isBidding) return false;

        // Color Palette Filter
        if (selectedColor !== "all") {
          const c = (prod.color || "").toLowerCase();
          const name = (prod.name || "").toLowerCase();
          if (selectedColor === "crimson" && !c.includes("crimson") && !c.includes("red") && !name.includes("crimson")) return false;
          if (selectedColor === "emerald" && !c.includes("emerald") && !c.includes("green") && !name.includes("emerald")) return false;
          if (selectedColor === "ochre" && !c.includes("gold") && !c.includes("mustard") && !c.includes("ochre") && !name.includes("ochre")) return false;
          if (selectedColor === "noir" && !c.includes("black") && !c.includes("noir") && !name.includes("noir") && !name.includes("black")) return false;
          if (selectedColor === "ivory" && !c.includes("ivory") && !c.includes("white") && !name.includes("ivory")) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.priceINR - b.priceINR;
        if (sortBy === "price-high") return b.priceINR - a.priceINR;
        if (sortBy === "auction-first") {
          if (a.isBidding && !b.isBidding) return -1;
          if (!a.isBidding && b.isBidding) return 1;
          return 0;
        }
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [initialProducts, selectedCategory, selectedColor, availability, sortBy]);

  return (
    <>
      {/* Category Navigation Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.2rem",
          marginTop: "3rem",
          paddingBottom: "1.2rem",
          borderBottom: "1px solid var(--color-border)"
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: `ALL CREATIONS (${initialProducts.length})` },
            { id: "bidding", label: "⚡ LIVE BIDDING (3)" },
            { id: "vintage-saree", label: "VINTAGE SAREE GOWNS" },
            { id: "vintage-dupatta", label: "REPURPOSED DUPATTA SETS" },
            { id: "remnants", label: "ZERO-WASTE ACCENTS & SCARVES" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "7px 14px",
                border: selectedCategory === cat.id ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                backgroundColor: selectedCategory === cat.id ? "var(--color-ink)" : "transparent",
                color: selectedCategory === cat.id ? "var(--color-ivory)" : "var(--color-ink)",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Sorting */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="maru-eyebrow" style={{ fontSize: "0.6rem", color: "rgba(14, 13, 13, 0.6)" }}>
              SORT:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "transparent",
                border: "1px solid var(--color-border)",
                padding: "5px 10px",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="featured">Featured Curations</option>
              <option value="auction-first">⚡ Live Auctions First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Grid Layout Toggle */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setColsMode("2")}
              style={{ opacity: colsMode === "2" ? 1 : 0.4, padding: "4px", background: "none", border: "none", cursor: "pointer" }}
              title="2-Column View"
              aria-label="2 Columns"
            >
              <Columns size={18} />
            </button>
            <button
              type="button"
              onClick={() => setColsMode("4")}
              style={{ opacity: colsMode === "4" ? 1 : 0.4, padding: "4px", background: "none", border: "none", cursor: "pointer" }}
              title="4-Column View"
              aria-label="4 Columns"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Multi-Attribute Discovery Bar (Hues & Acquisition Modes) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem 0",
          borderBottom: "1px dashed var(--color-border)"
        }}
      >
        {/* Color Palette Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(14, 13, 13, 0.6)" }}>
            PALETTE:
          </span>
          {colorOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedColor(opt.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                fontSize: "0.68rem",
                fontFamily: "var(--font-sans)",
                fontWeight: selectedColor === opt.id ? 700 : 500,
                border: selectedColor === opt.id ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                backgroundColor: selectedColor === opt.id ? "rgba(14, 13, 13, 0.06)" : "transparent",
                cursor: "pointer"
              }}
            >
              {opt.hex && (
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: opt.hex,
                    border: "1px solid rgba(0,0,0,0.2)"
                  }}
                />
              )}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Acquisition Mode & Reset */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(14, 13, 13, 0.6)" }}>
              TYPE:
            </span>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              style={{
                background: "transparent",
                border: "1px solid var(--color-border)",
                padding: "4px 8px",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="all">All Pieces</option>
              <option value="ready">Direct Acquisition (Buy Now)</option>
              <option value="auction">Live Atelier Bidding Only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-siren)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px"
              }}
            >
              <RotateCcw size={12} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Showing <strong>{filteredProducts.length}</strong> of {initialProducts.length} Archival 1-of-1 Relics
        </p>
      </div>

      {/* Product Grid or Empty State */}
      <div style={{ marginTop: "1.8rem" }}>
        {filteredProducts.length > 0 ? (
          <div className={`product-grid ${colsMode === "2" ? "cols-2" : "cols-4"}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "5rem 2rem",
              textAlign: "center",
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
              marginTop: "2rem"
            }}
          >
            <Sparkles size={28} color="var(--color-siren)" style={{ margin: "0 auto 1rem" }} />
            <h3 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              NO RELICS MATCH THIS EXACT FILTER
            </h3>
            <p style={{ fontSize: "0.9rem", color: "rgba(14, 13, 13, 0.7)", maxWidth: "520px", margin: "0 auto 1.8rem", lineHeight: 1.6 }}>
              Every single piece at Indie Summer is an irreproducible 1-of-1 creation reborn from vintage textiles. Reset your filters to explore all active archival works in Volume 001.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="azar-btn-black"
              style={{ height: "46px", padding: "0 28px", fontSize: "0.75rem", margin: "0 auto" }}
            >
              RESET ALL FILTERS & VIEW FULL ARCHIVE
            </button>
          </div>
        )}
      </div>
    </>
  );
}
