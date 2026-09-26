"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeFromCart,
    currency,
    formatPrice,
    discount,
    setDiscount,
    setCheckoutOpen,
    siteSettings
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  if (!cartOpen) return null;

  const getPrice = (item) => {
    switch (currency) {
      case "USD":
        return item.priceUSD;
      case "EUR":
        return item.priceEUR;
      case "GBP":
        return item.priceGBP;
      case "AED":
        return item.priceAED;
      case "INR":
      default:
        return item.priceINR;
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + getPrice(item) * item.quantity, 0);
  const discountAmount = discount ? Math.round(subtotal * (discount / 100)) : 0;
  
  // Free shipping threshold for Indian & Global clients
  const freeShippingThreshold = currency === "INR" ? 5000 : currency === "USD" ? 200 : 180;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountAway = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - discountAmount);

  const activePromoCode = (siteSettings?.promoCode || "INDIE10").trim().toUpperCase();
  const activePromoDiscount = Number(siteSettings?.promoDiscount) || 10;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanInput = promoInput.trim().toUpperCase();
    if (cleanInput === activePromoCode || cleanInput === "INDIE10") {
      const discountToApply = cleanInput === activePromoCode ? activePromoDiscount : 10;
      setDiscount(discountToApply);
      setPromoMessage(`✓ ${discountToApply}% Privilege Applied`);
    } else {
      setPromoMessage(`Invalid code. Try '${activePromoCode}'`);
    }
  };

  return (
    <div className="overlay-backdrop" onClick={() => setCartOpen(false)} style={{ zIndex: 120 }}>
      <div
        className="drawer-right"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "480px" }}
      >
        {/* Header */}
        <div style={{ padding: "1rem 1.8rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/images/logo.png"
              alt="INDIE SUMMER"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.55)", fontWeight: 600 }}>
              ({cart.length} {cart.length === 1 ? "piece" : "pieces"})
            </span>
          </div>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div style={{ backgroundColor: "var(--color-cream)", padding: "0.85rem 1.8rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", fontFamily: "var(--font-sans)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            {amountAway === 0 ? (
              <span style={{ color: "var(--color-siren)", fontWeight: 700 }}>
                ✓ COMPLIMENTARY PAN-INDIA EXPRESS AIR DELIVERY UNLOCKED
              </span>
            ) : (
              <span>
                Add {formatPrice(amountAway, currency)} for Complimentary Express Air Delivery
              </span>
            )}
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: "100%", height: "3px", backgroundColor: "rgba(14, 13, 13, 0.1)", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: "var(--color-siren)",
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.8rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p className="font-serif italic" style={{ fontSize: "1.4rem", color: "rgba(14, 13, 13, 0.6)" }}>
                Your bag is empty.
              </p>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(14, 13, 13, 0.5)", marginTop: "0.5rem" }}>
                Every piece is 1 of 1 — once claimed, it never exists again.
              </p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="azar-btn-black"
                style={{ marginTop: "1.5rem", display: "inline-flex" }}
              >
                DISCOVER VOL. 001
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "1.2rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid var(--color-border)"
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ aspectRatio: "3 / 4", width: "80px", backgroundColor: "var(--color-cream)", overflow: "hidden" }}>
                    <img
                      src={item.imagePrimary}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="maru-eyebrow" style={{ fontSize: "0.55rem" }}>
                          {item.code}
                        </span>
                        {item.isOneOfOne && (
                          <span style={{ fontSize: "0.55rem", backgroundColor: "var(--color-ink)", color: "var(--color-ivory)", padding: "1px 5px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            1-OF-1
                          </span>
                        )}
                      </div>

                      <h4
                        className="font-display"
                        style={{
                          fontSize: "1.05rem",
                          lineHeight: 1.1,
                          marginTop: "2px",
                          textTransform: "uppercase"
                        }}
                      >
                        {item.name}
                      </h4>

                      <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "2px" }}>
                        Size: <strong>{item.selectedSize}</strong>
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.6rem" }}>
                      {!item.isOneOfOne ? (
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-border)" }}>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.selectedSize, item.quantity - 1)}
                            style={{ padding: "2px 8px", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}
                          >
                            -
                          </button>
                          <span style={{ padding: "2px 6px", fontSize: "0.75rem", fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.selectedSize, item.quantity + 1)}
                            style={{ padding: "2px 8px", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.68rem", color: "rgba(14, 13, 13, 0.5)", textTransform: "uppercase" }}>
                          Unique Singular Piece
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        style={{ color: "rgba(14, 13, 13, 0.4)", cursor: "pointer", background: "none", border: "none" }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: "right", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.95rem" }}>
                    {formatPrice(getPrice(item) * item.quantity, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Subtotal / Checkout */}
        {cart.length > 0 && (
          <div style={{ borderTop: "1px solid var(--color-border)", padding: "1.5rem 1.8rem", backgroundColor: "var(--color-ivory)" }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  placeholder="PROMO / FOUNDING CODE"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px 8px 30px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "transparent",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    outline: "none"
                  }}
                />
                <Tag size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(14, 13, 13, 0.4)" }} />
              </div>
              <button
                type="submit"
                style={{
                  padding: "8px 14px",
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-ivory)",
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                APPLY
              </button>
            </form>

            {promoMessage && (
              <p style={{ fontSize: "0.72rem", color: "var(--color-siren)", marginBottom: "0.8rem", fontFamily: "var(--font-sans)" }}>
                {promoMessage}
              </p>
            )}

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.82rem", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(14, 13, 13, 0.7)" }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-siren)", fontWeight: 600 }}>
                  <span>Founding Privilege ({discount}%)</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(14, 13, 13, 0.7)" }}>
                <span>Pan-India BlueDart Express</span>
                <span>{amountAway === 0 ? "FREE" : "₹350"}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  marginTop: "6px",
                  paddingTop: "8px",
                  borderTop: "1px solid var(--color-border)"
                }}
              >
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              className="azar-btn-black"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              style={{ width: "100%", height: "52px", justifyContent: "center", fontSize: "0.75rem" }}
            >
              PROCEED TO ENCRYPTED CHECKOUT <ArrowRight size={15} />
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "0.8rem", fontSize: "0.68rem", color: "rgba(14, 13, 13, 0.5)" }}>
              <ShieldCheck size={14} color="var(--color-ink)" />
              <span>Instant UPI, NetBanking & International Cards Accepted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
