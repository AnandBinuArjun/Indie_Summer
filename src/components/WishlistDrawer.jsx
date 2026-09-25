"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function WishlistDrawer() {
  const {
    wishlistOpen,
    setWishlistOpen,
    wishlist,
    toggleWishlist,
    moveWishlistToCart,
    currency,
    formatPrice
  } = useStore();

  if (!wishlistOpen) return null;

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

  return (
    <div className="overlay-backdrop" onClick={() => setWishlistOpen(false)} style={{ zIndex: 120 }}>
      <div
        className="drawer-right"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "440px" }}
      >
        <div style={{ padding: "1.2rem 1.8rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="maru-eyebrow">SAVED CURATIONS</span>
            <span style={{ fontSize: "0.82rem", color: "rgba(14, 13, 13, 0.55)", marginLeft: "8px" }}>
              ({wishlist.length})
            </span>
          </div>
          <button type="button" onClick={() => setWishlistOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close wishlist">
            <X size={22} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.8rem" }}>
          {wishlist.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "3rem 1rem"
              }}
            >
              <Heart size={36} color="rgba(14, 13, 13, 0.4)" style={{ marginBottom: "1rem" }} />
              <p className="font-serif italic" style={{ fontSize: "1.25rem", color: "rgba(14, 13, 13, 0.6)" }}>
                No pieces saved yet.
              </p>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(14, 13, 13, 0.5)", marginTop: "0.5rem" }}>
                Heart your favorite 1-of-1 creations while exploring our catalog.
              </p>
              <Link
                href="/shop"
                onClick={() => setWishlistOpen(false)}
                className="azar-btn-black"
                style={{ marginTop: "1.5rem", display: "inline-flex" }}
              >
                EXPLORE VOL. 001
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {wishlist.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "70px 1fr auto",
                    gap: "1rem",
                    alignItems: "center",
                    paddingBottom: "1.2rem",
                    borderBottom: "1px solid var(--color-border)"
                  }}
                >
                  <div style={{ aspectRatio: "3 / 4", width: "70px", backgroundColor: "var(--color-cream)", overflow: "hidden" }}>
                    <img src={prod.imagePrimary} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div>
                    <span className="maru-eyebrow" style={{ fontSize: "0.55rem" }}>{prod.code}</span>
                    <h4 className="font-display" style={{ fontSize: "1.1rem" }}>{prod.name}</h4>
                    <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>{prod.material}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.85rem", marginTop: "4px" }}>
                      {getProductPrice(prod)}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button
                      type="button"
                      className="azar-btn-black"
                      onClick={() => moveWishlistToCart(prod)}
                      style={{ padding: "6px 10px", fontSize: "0.62rem" }}
                      title="Move to bag"
                    >
                      <ShoppingBag size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod)}
                      style={{ padding: "6px", background: "none", border: "1px solid var(--color-border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
