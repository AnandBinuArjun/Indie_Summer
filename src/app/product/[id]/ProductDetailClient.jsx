"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  MapPin,
  Gavel,
  Clock,
  History,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "../../../context/StoreContext";

export default function ProductDetailClient({ product }) {
  const router = useRouter();
  const {
    currency,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    getBiddingInfo,
    placeBid
  } = useStore();

  const bidding = getBiddingInfo(product);

  const [activeImage, setActiveImage] = useState(product.imagePrimary);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "One Size");
  const [isAdded, setIsAdded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");

  // Bidding Form State
  const currentBid = bidding ? bidding.currentBidINR : product.priceINR;
  const minIncrement = bidding ? bidding.minBidIncrementINR : 500;
  const minNextBid = currentBid + minIncrement;

  const [bidAmount, setBidAmount] = useState(minNextBid);
  const [bidderName, setBidderName] = useState("Ananya S. (Verified Patron)");
  const [bidderLocation, setBidderLocation] = useState("South Mumbai");
  const [bidError, setBidError] = useState("");
  const [bidSuccessMsg, setBidSuccessMsg] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  // Live countdown timer (simulating 23h 48m)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 48, seconds: 35 });

  useEffect(() => {
    if (!bidding) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bidding]);

  // Keep bidAmount in sync with latest current bid if outbid
  useEffect(() => {
    if (bidding && bidAmount < minNextBid) {
      setBidAmount(minNextBid);
    }
  }, [minNextBid, bidding]);

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
      setPincodeStatus("✓ Express Delivery in 2-3 Days via BlueDart Air to PIN " + pincode);
    } else {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code");
    }
  };

  const handleSetIncrement = (inc) => {
    setBidError("");
    setBidAmount(currentBid + inc);
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccessMsg("");

    const numericBid = Number(bidAmount);

    if (isNaN(numericBid) || numericBid < minNextBid) {
      setBidError(
        `Minimum increment is ₹${minIncrement.toLocaleString("en-IN")}. Your bid must be at least ₹${minNextBid.toLocaleString("en-IN")}.`
      );
      return;
    }

    const res = placeBid(
      product,
      numericBid,
      `${bidderName}${bidderLocation ? ` (${bidderLocation})` : ""}`
    );

    if (!res.success) {
      setBidError(res.message);
      return;
    }

    // Trigger celebratory luxury confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#A92424", "#D8C7A5", "#0E0D0D", "#FFFFFF"]
      });
    } catch {
      // safe fallback
    }

    setBidSuccessMsg(
      `✓ Congratulations! Your bid of ₹${numericBid.toLocaleString("en-IN")} has been placed as the leading offer.`
    );
    setBidAmount(numericBid + minIncrement);
  };

  return (
    <main
      style={{
        paddingTop: "6.5rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-ivory)",
        color: "var(--color-ink)",
        minHeight: "90vh"
      }}
    >
      <div className="site-container">
        {/* Breadcrumb / Back Link */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              background: "none",
              border: "none"
            }}
          >
            <ArrowLeft size={16} /> BACK TO COLLECTION
          </button>
        </div>

        {/* Product Showcase Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3.5rem" }} className="product-page-grid">
          {/* Gallery */}
          <div>
            <div
              style={{
                aspectRatio: "3 / 4",
                width: "100%",
                overflow: "hidden",
                backgroundColor: "var(--color-cream)",
                position: "relative"
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  backgroundColor: "rgba(14, 13, 13, 0.88)",
                  color: "#FFF",
                  padding: "6px 14px",
                  fontSize: "0.62rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {bidding ? (
                  <>
                    <Gavel size={13} color="var(--color-siren)" /> ATELIER AUCTION · 1 OF 1 RELIC
                  </>
                ) : (
                  "ONE DESIGN · ONE PIECE · NEVER AGAIN"
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              {[product.imagePrimary, product.imageSecondary].filter(Boolean).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: "75px",
                    height: "100px",
                    overflow: "hidden",
                    border: activeImage === img ? "2px solid var(--color-ink)" : "1px solid var(--color-border)",
                    opacity: activeImage === img ? 1 : 0.6,
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Purchasing */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.4rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                {product.code}
              </span>
              {bidding && (
                <span
                  style={{
                    backgroundColor: "rgba(169, 36, 36, 0.12)",
                    color: "var(--color-siren)",
                    padding: "2px 8px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  }}
                >
                  LIVE BIDDING
                </span>
              )}
            </div>

            <h1
              className="font-display text-ink"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)", lineHeight: 0.95, marginBottom: "0.8rem" }}
            >
              {product.name}
            </h1>

            <p className="font-serif italic" style={{ fontSize: "1.2rem", color: "rgba(14, 13, 13, 0.7)", marginBottom: "1rem" }}>
              {product.material}
            </p>

            {/* Price or Current Bid Display */}
            <div
              style={{
                fontFamily: "var(--font-sans)",
                marginBottom: "1.5rem",
                paddingBottom: "1.2rem",
                borderBottom: "1px solid var(--color-border)"
              }}
            >
              {bidding ? (
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.78rem", letterSpacing: "0.15em", color: "var(--color-siren)", fontWeight: 700, textTransform: "uppercase" }}>
                      CURRENT HIGHEST BID:
                    </span>
                    <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--color-ink)", lineHeight: 1 }}>
                      {getProductPrice()}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.6)" }}>
                      ({bidding.bidsCount} bids placed)
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px", fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.65)" }}>
                    <span>Opening Reserve: ₹{product.startingBidINR?.toLocaleString("en-IN") || product.priceINR.toLocaleString("en-IN")}</span>
                    <span>·</span>
                    <span style={{ color: "var(--color-siren)", fontWeight: 600 }}>Reserve Met · Live Auction</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--color-ink)" }}>
                  {getProductPrice()}
                  <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "rgba(14, 13, 13, 0.6)", marginLeft: "10px" }}>
                    (Inclusive of all taxes · Zero waste packing)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "rgba(14, 13, 13, 0.8)", marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            {/* Provenance */}
            <div style={{ backgroundColor: "var(--color-cream)", padding: "1.2rem", border: "1px solid var(--color-border)", marginBottom: "1.8rem" }}>
              <span className="maru-eyebrow" style={{ fontSize: "0.62rem", display: "block", marginBottom: "8px" }}>
                TEXTILE SPECIFICATIONS & PROVENANCE
              </span>
              <ul style={{ listStyle: "disc", paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.75)" }}>
                {product.details?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>

            {/* ============================================================== */}
            {/* LIVE BIDDING CONSOLE (WHEN BIDDING IS ACTIVE)                  */}
            {/* ============================================================== */}
            {bidding ? (
              <div
                id="bidding"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "1.5px solid var(--color-ink)",
                  padding: "1.8rem",
                  marginBottom: "2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
                }}
              >
                {/* Auction Header with Countdown */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    paddingBottom: "1.2rem",
                    borderBottom: "1px dashed var(--color-border)",
                    marginBottom: "1.4rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-siren)"
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--color-ink)"
                      }}
                    >
                      ATELIER LIVE BIDDING
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "var(--color-ivory)",
                      padding: "5px 12px",
                      border: "1px solid var(--color-border)",
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600
                    }}
                  >
                    <Clock size={14} color="var(--color-siren)" />
                    <span>CLOSES IN:</span>
                    <span style={{ color: "var(--color-siren)", fontVariantNumeric: "tabular-nums" }}>
                      {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
                    </span>
                  </div>
                </div>

                {/* Minimum increment requirement notice */}
                <div
                  style={{
                    backgroundColor: "var(--color-ivory)",
                    border: "1px solid var(--color-border)",
                    padding: "10px 14px",
                    marginBottom: "1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "var(--color-siren)" }}>
                      MINIMUM BID INCREMENT: ₹{minIncrement.toLocaleString("en-IN")}
                    </span>
                    <p style={{ fontSize: "0.8rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "2px" }}>
                      Next eligible bid must be at least <strong>₹{minNextBid.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      backgroundColor: "var(--color-ink)",
                      color: "var(--color-ivory)",
                      padding: "3px 8px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase"
                    }}
                  >
                    MIN +₹500
                  </span>
                </div>

                {/* Quick Increment Pill Buttons */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(14, 13, 13, 0.65)",
                      marginBottom: "6px",
                      fontWeight: 600
                    }}
                  >
                    QUICK BID INCREMENTS (MIN ₹500)
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                    {[500, 1000, 2500, 5000].map((inc) => {
                      const calculatedAmount = currentBid + inc;
                      const isSelected = bidAmount === calculatedAmount;
                      return (
                        <button
                          key={inc}
                          type="button"
                          onClick={() => handleSetIncrement(inc)}
                          style={{
                            padding: "8px 4px",
                            textAlign: "center",
                            border: isSelected ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                            backgroundColor: isSelected ? "var(--color-ink)" : "var(--color-ivory)",
                            color: isSelected ? "var(--color-ivory)" : "var(--color-ink)",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>+₹{inc.toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: "0.6rem", opacity: 0.8 }}>₹{calculatedAmount.toLocaleString("en-IN")}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bid Form */}
                <form onSubmit={handlePlaceBid}>
                  {/* Custom Amount Input */}
                  <div style={{ marginBottom: "1.2rem" }}>
                    <label
                      htmlFor="custom-bid-input"
                      style={{
                        display: "block",
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-sans)",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(14, 13, 13, 0.65)",
                        marginBottom: "6px",
                        fontWeight: 600
                      }}
                    >
                      ENTER BID AMOUNT (₹ INR)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--color-ink)"
                        }}
                      >
                        ₹
                      </span>
                      <input
                        id="custom-bid-input"
                        type="number"
                        min={minNextBid}
                        step={500}
                        value={bidAmount}
                        onChange={(e) => {
                          setBidError("");
                          setBidAmount(Number(e.target.value));
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 14px 12px 32px",
                          fontSize: "1.3rem",
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          border: bidError ? "1.5px solid var(--color-siren)" : "1px solid var(--color-border)",
                          backgroundColor: "#FFF",
                          outline: "none"
                        }}
                      />
                    </div>
                    {bidAmount > currentBid && (
                      <p style={{ fontSize: "0.72rem", color: "var(--color-siren)", marginTop: "4px", fontWeight: 500 }}>
                        +₹{(bidAmount - currentBid).toLocaleString("en-IN")} above current leading bid
                      </p>
                    )}
                  </div>

                  {/* Collector Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.4rem" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.62rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                          color: "rgba(14, 13, 13, 0.65)"
                        }}
                      >
                        PATRON NAME
                      </label>
                      <input
                        type="text"
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="Your Full Name"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          fontSize: "0.8rem",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#FFF",
                          outline: "none"
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.62rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                          color: "rgba(14, 13, 13, 0.65)"
                        }}
                      >
                        CITY / LOCATION
                      </label>
                      <input
                        type="text"
                        value={bidderLocation}
                        onChange={(e) => setBidderLocation(e.target.value)}
                        placeholder="e.g. South Mumbai"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          fontSize: "0.8rem",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#FFF",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  {/* Validation Error Message */}
                  {bidError && (
                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "rgba(169, 36, 36, 0.1)",
                        border: "1px solid var(--color-siren)",
                        color: "var(--color-siren)",
                        fontSize: "0.78rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <AlertCircle size={15} />
                      <span>{bidError}</span>
                    </div>
                  )}

                  {/* Success Banner */}
                  {bidSuccessMsg && (
                    <div
                      style={{
                        padding: "12px 14px",
                        backgroundColor: "rgba(30, 86, 56, 0.12)",
                        border: "1px solid #1E5638",
                        color: "#1E5638",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        marginBottom: "1rem"
                      }}
                    >
                      {bidSuccessMsg}
                    </div>
                  )}

                  {/* Place Bid Submit Button */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      className="azar-btn-black"
                      style={{
                        flex: 1,
                        height: "54px",
                        fontSize: "0.8rem",
                        letterSpacing: "0.16em",
                        backgroundColor: "var(--color-siren)",
                        color: "#FFF"
                      }}
                    >
                      <Gavel size={16} /> SUBMIT BINDING BID (₹{Number(bidAmount).toLocaleString("en-IN")})
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      style={{
                        width: "54px",
                        height: "54px",
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
                        size={20}
                        fill={isWishlisted ? "var(--color-siren)" : "none"}
                        stroke={isWishlisted ? "var(--color-siren)" : "var(--color-ink)"}
                      />
                    </button>
                  </div>
                </form>

                {/* Bidding Rules Guarantee */}
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(14, 13, 13, 0.6)",
                    marginTop: "1rem",
                    lineHeight: "1.4"
                  }}
                >
                  * Bids are binding. If claimed at close of auction, the winning patron will be invoiced with complimentary express air delivery and hand-signed Certificate of Provenance. Minimum bid increment: ₹500.
                </p>

                {/* Live Bid History Log */}
                <div style={{ marginTop: "1.5rem", paddingTop: "1.2rem", borderTop: "1px dashed var(--color-border)" }}>
                  <button
                    type="button"
                    onClick={() => setShowHistory((prev) => !prev)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <History size={13} /> LIVE ARCHIVAL BID HISTORY ({bidding.bidsHistory.length})
                    </span>
                    <span style={{ fontSize: "0.75rem", textDecoration: "underline" }}>
                      {showHistory ? "Hide" : "Show"}
                    </span>
                  </button>

                  {showHistory && (
                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {bidding.bidsHistory.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: idx === 0 ? "rgba(169, 36, 36, 0.08)" : "var(--color-ivory)",
                            border: idx === 0 ? "1px solid var(--color-siren)" : "1px solid var(--color-border)",
                            fontSize: "0.78rem"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {idx === 0 && (
                              <span
                                style={{
                                  backgroundColor: "var(--color-siren)",
                                  color: "#FFF",
                                  fontSize: "0.55rem",
                                  padding: "2px 6px",
                                  fontWeight: 700,
                                  letterSpacing: "0.1em"
                                }}
                              >
                                HIGH BID
                              </span>
                            )}
                            <span style={{ fontWeight: idx === 0 ? 700 : 500 }}>
                              {item.bidder}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                              ₹{item.amount.toLocaleString("en-IN")}
                            </span>
                            <span style={{ color: "rgba(14, 13, 13, 0.5)", fontSize: "0.68rem" }}>
                              {item.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* STANDARD DIRECT ACQUISITION BUTTONS (FOR NON-BIDDING PIECES)   */
              /* ============================================================== */
              <>
                {/* Size Selector */}
                <div style={{ marginBottom: "1.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span className="maru-eyebrow">SELECT SIZE</span>
                    <span className="maru-eyebrow" style={{ textDecoration: "underline", color: "rgba(14, 13, 13, 0.6)", cursor: "pointer" }}>
                      ATELIER SIZE GUIDE
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {product.sizes?.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        style={{
                          minWidth: "50px",
                          height: "44px",
                          border: selectedSize === sz ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                          backgroundColor: selectedSize === sz ? "var(--color-ink)" : "transparent",
                          color: selectedSize === sz ? "var(--color-ivory)" : "var(--color-ink)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indian Pincode Delivery Check */}
                <div style={{ marginBottom: "1.8rem", padding: "12px", backgroundColor: "#FFF", border: "1px solid var(--color-border)" }}>
                  <span className="maru-eyebrow" style={{ fontSize: "0.62rem", display: "block", marginBottom: "6px" }}>
                    <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} /> CHECK PAN-INDIA EXPRESS AIR DELIVERY
                  </span>
                  <form onSubmit={checkPincode} style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="ENTER 6-DIGIT PIN CODE"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "transparent",
                        fontSize: "0.8rem",
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
                        padding: "8px 16px",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "none"
                      }}
                    >
                      CHECK
                    </button>
                  </form>
                  {pincodeStatus && (
                    <p style={{ fontSize: "0.75rem", marginTop: "6px", color: "var(--color-siren)", fontFamily: "var(--font-sans)" }}>
                      {pincodeStatus}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                  <button
                    type="button"
                    className="azar-btn-black"
                    onClick={handleAdd}
                    style={{
                      flex: 1,
                      height: "54px",
                      fontSize: "0.75rem",
                      backgroundColor: isAdded ? "var(--color-siren)" : "var(--color-ink)"
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} /> ADDED TO BAG
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> ADD 1-OF-1 PIECE TO BAG
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    style={{
                      width: "54px",
                      height: "54px",
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
                      size={20}
                      fill={isWishlisted ? "var(--color-siren)" : "none"}
                      stroke={isWishlisted ? "var(--color-siren)" : "var(--color-ink)"}
                    />
                  </button>
                </div>
              </>
            )}

            {/* Guarantees */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.2rem",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.78rem",
                color: "rgba(14, 13, 13, 0.65)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Truck size={15} color="var(--color-ink)" />
                <span>Complimentary Express Courier Across India via BlueDart Air</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={15} color="var(--color-ink)" />
                <span>Hand-signed Certificate of Authenticity & Provenance Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
