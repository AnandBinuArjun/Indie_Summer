"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Heart, ShieldCheck, Truck, Sparkles, Check, MapPin, Gavel } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function ProductDetailModal() {
  const {
    activeQuickViewProduct: product,
    setActiveQuickViewProduct,
    currency,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    getBiddingInfo
  } = useStore();

  const bidding = product ? getBiddingInfo(product) : null;

  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.imagePrimary);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "One Size");
  const [isAdded, setIsAdded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");

  const isWishlisted = wishlist.some((w) => w.id === product.id);

  const getProductPrice = () => {
    if (bidding) {
      return `₹${bidding.currentBidINR.toLocaleString("en-IN")}`;
    }
    switch (currency) {
      case "USD":
        return formatPrice(product.priceUSD, "USD");
      case "EUR":
        return formatPrice(product.priceEUR, "EUR");
      case "GBP":
        return formatPrice(product.priceGBP, "GBP");
      case "AED":
        return formatPrice(product.priceAED, "AED");
      case "INR":
      default:
        return formatPrice(product.priceINR, "INR");
    }
  };

  const handleAdd = () => {
    addToCart({
      ...product,
      selectedSize
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus("✓ Express Air Delivery in 2-3 Days via BlueDart to " + pincode);
    } else {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code");
    }
  };

  return (
    <div className="overlay-backdrop" onClick={() => setActiveQuickViewProduct(null)} style={{ zIndex: 130 }}>
      <div
        className="product-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "960px",
          backgroundColor: "var(--color-ivory)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
        }}
      >
        <button
          type="button"
          onClick={() => setActiveQuickViewProduct(null)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px"
          }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="product-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Gallery */}
          <div style={{ backgroundColor: "var(--color-cream)", padding: "1.5rem" }}>
            <div style={{ aspectRatio: "3 / 4", width: "100%", overflow: "hidden", position: "relative" }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  backgroundColor: "rgba(14, 13, 13, 0.85)",
                  color: "#FFF",
                  padding: "4px 8px",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase"
                }}
              >
                ONE DESIGN · ONE PIECE · NEVER AGAIN
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              {[product.imagePrimary, product.imageSecondary].filter(Boolean).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: "60px",
                    height: "80px",
                    border: activeImage === img ? "2px solid var(--color-ink)" : "1px solid var(--color-border)",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: "2.5rem 2rem 2.5rem 0", display: "flex", flexDirection: "column" }}>
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "4px" }}>
              {product.code}
            </span>

            <h2 className="font-display" style={{ fontSize: "2.4rem", lineHeight: 1, marginBottom: "0.5rem" }}>
              {product.name}
            </h2>

            <p className="font-serif italic" style={{ fontSize: "1rem", color: "rgba(14, 13, 13, 0.65)", marginBottom: "1rem" }}>
              {product.material}
            </p>

            <div style={{ fontFamily: "var(--font-sans)", marginBottom: "1.2rem", paddingBottom: "0.8rem", borderBottom: "1px solid var(--color-border)" }}>
              {bidding ? (
                <div>
                  <span style={{ fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--color-siren)", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
                    CURRENT HIGHEST BID · {bidding.bidsCount} BIDS
                  </span>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-ink)", lineHeight: 1.1 }}>
                    {getProductPrice()}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "rgba(14, 13, 13, 0.5)" }}>
                    Minimum increment: ₹500
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                  {getProductPrice()}
                  <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "rgba(14, 13, 13, 0.5)", marginLeft: "8px" }}>
                    (Inclusive of all taxes · Pan-India Express Delivery)
                  </span>
                </div>
              )}
            </div>

            <p style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(14, 13, 13, 0.75)", marginBottom: "1.4rem" }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: "1.4rem" }}>
              <span className="maru-eyebrow" style={{ display: "block", marginBottom: "6px" }}>SELECT SIZE</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {product.sizes?.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      minWidth: "44px",
                      height: "40px",
                      border: selectedSize === sz ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                      backgroundColor: selectedSize === sz ? "var(--color-ink)" : "transparent",
                      color: selectedSize === sz ? "var(--color-ivory)" : "var(--color-ink)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Pincode Check */}
            <div style={{ marginBottom: "1.4rem", padding: "10px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
              <span className="maru-eyebrow" style={{ fontSize: "0.58rem", display: "block", marginBottom: "4px" }}>
                <MapPin size={11} style={{ display: "inline", marginRight: "3px" }} /> PAN-INDIA EXPRESS AIR COURIER
              </span>
              <form onSubmit={checkPincode} style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="PIN CODE (e.g. 400001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "transparent",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-sans)",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--color-ink)",
                    color: "var(--color-ivory)",
                    padding: "6px 12px",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none"
                  }}
                >
                  CHECK
                </button>
              </form>
              {pincodeStatus && (
                <p style={{ fontSize: "0.7rem", marginTop: "4px", color: "var(--color-siren)" }}>
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
              {bidding ? (
                <Link
                  href={`/product/${product.id}#bidding`}
                  onClick={() => setActiveQuickViewProduct(null)}
                  className="azar-btn-black"
                  style={{
                    flex: 1,
                    height: "48px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    backgroundColor: "var(--color-siren)",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    textDecoration: "none"
                  }}
                >
                  <Gavel size={15} /> ENTER ATELIER BIDDING (MIN +₹500)
                </Link>
              ) : (
                <button
                  type="button"
                  className="azar-btn-black"
                  onClick={handleAdd}
                  style={{
                    flex: 1,
                    height: "48px",
                    fontSize: "0.7rem",
                    backgroundColor: isAdded ? "var(--color-siren)" : "var(--color-ink)"
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={15} /> ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} /> ACQUIRE 1-OF-1 PIECE
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                style={{
                  width: "48px",
                  height: "48px",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "none"
                }}
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "var(--color-siren)" : "none"}
                  stroke={isWishlisted ? "var(--color-siren)" : "var(--color-ink)"}
                />
              </button>
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Truck size={13} color="var(--color-ink)" />
                <span>Complimentary BlueDart Express Across India</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={13} color="var(--color-ink)" />
                <span>Hand-signed Certificate of Provenance Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
