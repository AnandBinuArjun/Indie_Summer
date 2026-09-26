"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const {
    currency,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    setActiveQuickViewProduct,
    getBiddingInfo,
    getProductDisplayPrice
  } = useStore();

  const bidding = getBiddingInfo(product);
  const isWishlisted = wishlist.some((w) => w.id === product.id);

  const getProductPrice = () => getProductDisplayPrice(product);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      selectedSize: product.sizes?.[0] || "One Size"
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }} className="azar-product-card">
      {/* 3:4 Aspect Image Box */}
      <div className="card-aspect">
        <Link href={`/product/${product.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <img
            src={product.imagePrimary}
            alt={product.name}
            className="img-primary"
            loading="lazy"
          />
          <img
            src={product.imageSecondary}
            alt={`${product.name} alternate view`}
            className="img-secondary"
            loading="lazy"
          />
        </Link>

        {/* Status Badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "rgba(14, 13, 13, 0.88)",
            backdropFilter: "blur(4px)",
            color: "var(--color-ivory)",
            padding: "4px 8px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          {bidding ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FFDF78" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-siren)"
                }}
              />
              LIVE BIDDING · 1 OF 1
            </span>
          ) : product.isOneOfOne ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-siren)"
                }}
              />
              ONE OF ONE
            </span>
          ) : (
            product.edition
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(251, 251, 247, 0.9)",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease"
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            fill={isWishlisted ? "var(--color-siren)" : "none"}
            stroke={isWishlisted ? "var(--color-siren)" : "var(--color-ink)"}
          />
        </button>

        {/* Hover Quick Action Bar */}
        <div className="card-hover-actions">
          <button
            type="button"
            className="azar-btn-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveQuickViewProduct(product);
            }}
            style={{ flex: 1, height: "38px", fontSize: "0.62rem" }}
          >
            QUICK VIEW
          </button>

          {bidding ? (
            <Link
              href={`/product/${product.id}`}
              className="azar-btn-black"
              style={{
                flex: 1,
                height: "38px",
                fontSize: "0.62rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                backgroundColor: "var(--color-siren)",
                color: "#FFF"
              }}
            >
              PLACE BID (MIN +₹500)
            </Link>
          ) : (
            <button
              type="button"
              className="azar-btn-black"
              onClick={handleQuickAdd}
              style={{
                flex: 1,
                height: "38px",
                fontSize: "0.62rem",
                backgroundColor: added ? "var(--color-siren)" : "var(--color-ink)"
              }}
            >
              {added ? (
                <>
                  <Check size={13} /> ADDED
                </>
              ) : (
                "+ QUICK BAG"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Info Section below card */}
      <div style={{ marginTop: "1rem" }}>
        <p
          className="maru-eyebrow"
          style={{
            color: "rgba(14, 13, 13, 0.55)",
            fontSize: "0.6rem",
            marginBottom: "3px"
          }}
        >
          {product.code}
        </p>

        <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            className="font-display text-ink card-title"
            style={{
              fontSize: "1.45rem",
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              transition: "color 0.2s ease"
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          className="font-serif italic"
          style={{
            fontSize: "0.85rem",
            color: "rgba(14, 13, 13, 0.65)",
            marginTop: "3px",
            lineHeight: 1.3
          }}
        >
          {product.material}
        </p>

        {/* Price & Action row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.6rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--color-border)"
          }}
        >
          {bidding ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  color: "var(--color-siren)",
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                CURRENT BID · {bidding.bidsCount} BIDS
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em"
                }}
              >
                {getProductPrice()}
              </span>
              <span style={{ fontSize: "0.58rem", color: "rgba(14, 13, 13, 0.5)" }}>
                Min increment: ₹500
              </span>
            </div>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "0.02em"
              }}
            >
              {getProductPrice()}
            </span>
          )}

          <Link
            href={`/product/${product.id}`}
            style={{
              fontSize: "0.68rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-siren)",
              textDecoration: "none"
            }}
          >
            {bidding ? "PLACE BID →" : "ACQUIRE PIECE →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
