"use client";

import React, { useState } from "react";
import ProductCard from "../../components/ProductCard";
import { Grid, Columns } from "lucide-react";

export default function ShopClient({ initialProducts }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [colsMode, setColsMode] = useState("3");

  const filteredProducts = initialProducts.filter((prod) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "bidding") return prod.isBidding;
    if (selectedCategory === "one-of-one") return prod.isOneOfOne;
    return prod.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.priceINR - b.priceINR;
    if (sortBy === "price-high") return b.priceINR - a.priceINR;
    return 0;
  });

  return (
    <>
      {/* Filter Bar */}
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
            { id: "all", label: "ALL CREATIONS (8)" },
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
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="maru-eyebrow" style={{ fontSize: "0.6rem", color: "rgba(14, 13, 13, 0.6)" }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="featured">Featured Pieces</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setColsMode("2")}
              style={{ opacity: colsMode === "2" ? 1 : 0.4, padding: "4px", background: "none", border: "none", cursor: "pointer" }}
              title="2-Column View"
            >
              <Columns size={18} />
            </button>
            <button
              type="button"
              onClick={() => setColsMode("4")}
              style={{ opacity: colsMode === "4" ? 1 : 0.4, padding: "4px", background: "none", border: "none", cursor: "pointer" }}
              title="4-Column View"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ marginTop: "2.5rem" }}>
        <div className={`product-grid ${colsMode === "2" ? "cols-2" : "cols-4"}`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
