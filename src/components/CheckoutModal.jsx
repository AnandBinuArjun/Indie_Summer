"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles, Smartphone, Building2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "../context/StoreContext";

export default function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart: items,
    currency,
    getCartTotal,
    clearCart,
    formatPrice
  } = useStore();

  const total = getCartTotal();
  const onClose = () => setCheckoutOpen(false);
  const onOrderComplete = clearCart;

  if (!checkoutOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState("ananya@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const [formData, setFormData] = useState({
    firstName: "Ananya",
    lastName: "Singhania",
    email: "ananya.singhania@indie.in",
    phone: "+91 98200 45892",
    address: "Bungalow 4, Altamount Road",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400026",
    cardNumber: "•••• •••• •••• 9924",
    expiry: "09/29",
    cvv: "•••"
  });


  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrder = "IS-IND-" + Math.floor(100000 + Math.random() * 900000);
      setOrderRef(generatedOrder);
      setOrderSuccess(true);

      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#E53826", "#FBFBF7", "#C29547", "#111111"]
        });
      } catch (err) {
        console.log("Confetti trigger", err);
      }

      if (onOrderComplete) {
        onOrderComplete(generatedOrder);
      }
    }, 1300);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose} style={{ zIndex: 130 }}>
      <div
        className="checkout-modal-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--color-ivory)",
          color: "var(--color-ink)",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
          border: "1px solid var(--color-border)"
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            zIndex: 20,
            padding: "6px",
            backgroundColor: "rgba(251, 251, 247, 0.9)",
            cursor: "pointer"
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!orderSuccess ? (
          <div style={{ padding: "2.5rem 2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <img
                src="/images/logo.png"
                alt="INDIE SUMMER"
                style={{ height: "52px", width: "auto", objectFit: "contain", margin: "0 auto 0.8rem", display: "block" }}
              />
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                INDIE SUMMER ATELIER CHECKOUT
              </span>
              <h2 className="font-display" style={{ fontSize: "2.4rem", marginTop: "0.3rem" }}>
                SECURE ACQUISITION & DISPATCH
              </h2>
              <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "rgba(14, 13, 13, 0.6)" }}>
                Complimentary BlueDart Air express dispatch from our Goa coastal studio.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
                {/* Left: Client & Payment Details */}
                <div>
                  <h3 className="maru-eyebrow" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "0.35rem", marginBottom: "0.8rem" }}>
                    1. CLIENT DESTINATION & CONTACT
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        FIRST NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        LAST NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        EMAIL (FOR CERTIFICATE)
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        MOBILE (+91 OTP UPDATES)
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      STREET ADDRESS
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        CITY
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        STATE
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        PIN CODE
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <h3 className="maru-eyebrow" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "0.35rem", marginBottom: "0.8rem" }}>
                    2. PAYMENT METHOD (INDIA & INTERNATIONAL)
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "1rem" }}>
                    {[
                      { id: "upi", label: "UPI / QR", icon: Smartphone },
                      { id: "card", label: "Cards / EMI", icon: CreditCard },
                      { id: "netbanking", label: "NetBanking", icon: Building2 }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          padding: "8px 4px",
                          border: paymentMethod === m.id ? "1.5px solid var(--color-ink)" : "1px solid var(--color-border)",
                          backgroundColor: paymentMethod === m.id ? "var(--color-ink)" : "#FFF",
                          color: paymentMethod === m.id ? "var(--color-ivory)" : "var(--color-ink)",
                          fontSize: "0.68rem",
                          letterSpacing: "0.08em",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}
                      >
                        <m.icon size={13} /> {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "upi" && (
                    <div style={{ backgroundColor: "#FFF", padding: "1rem", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.62rem", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                        ENTER UPI ID (GPay / PhonePe / Paytm / BHIM)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem", outline: "none" }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "rgba(14, 13, 13, 0.55)", marginTop: "4px" }}>
                        A payment request will be sent directly to your UPI mobile application.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div style={{ backgroundColor: "#FFF", padding: "1rem", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.62rem", display: "block", marginBottom: "4px" }}>CARD NUMBER (RuPay, Visa, Mastercard, Amex)</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div>
                          <label style={{ fontSize: "0.62rem", display: "block", marginBottom: "4px" }}>VALID THRU</label>
                          <input
                            type="text"
                            value={formData.expiry}
                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                            style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.62rem", display: "block", marginBottom: "4px" }}>CVV</label>
                          <input
                            type="password"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div style={{ backgroundColor: "#FFF", padding: "1rem", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.62rem", display: "block", marginBottom: "4px" }}>SELECT INDIAN BANK</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}
                      >
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Yes Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Right: Summary */}
                <div style={{ backgroundColor: "var(--color-cream)", padding: "1.5rem", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column" }}>
                  <span className="maru-eyebrow" style={{ marginBottom: "0.8rem" }}>
                    ORDER BREAKDOWN
                  </span>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "1.2rem" }}>
                    {items.map((it) => (
                      <div key={`${it.id}-${it.selectedSize}`} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <img src={it.imagePrimary} alt={it.name} style={{ width: "42px", height: "56px", objectFit: "cover" }} />
                        <div style={{ flex: 1 }}>
                          <p className="font-display" style={{ fontSize: "0.95rem" }}>{it.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)", fontStyle: "italic" }}>
                            Size: {it.selectedSize} · Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.8rem", marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>BlueDart Express Air</span>
                      <span style={{ fontWeight: 600 }}>COMPLIMENTARY</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>GST & Luxury Pack</span>
                      <span style={{ fontWeight: 600 }}>INCLUDED</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", borderTop: "1px solid var(--color-border)", paddingTop: "0.6rem", marginTop: "0.6rem" }}>
                      <span className="font-display">TOTAL</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>
                        {formatPrice(total, currency)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="azar-btn-black"
                    style={{ width: "100%", marginTop: "1.2rem", justifyContent: "center" }}
                  >
                    {isProcessing ? "SECURING 1-OF-1 PIECE..." : "AUTHORIZE & COMPLETE ORDER"}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "0.8rem", fontSize: "0.62rem", color: "rgba(14, 13, 13, 0.55)", letterSpacing: "0.1em" }}>
                    <Lock size={12} /> <span>256-BIT ENCRYPTED RAZORPAY / CASHFREE</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <img
              src="/images/logo.png"
              alt="INDIE SUMMER"
              style={{ height: "56px", width: "auto", objectFit: "contain", margin: "0 auto 1.2rem", display: "block" }}
            />
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "var(--color-siren)", color: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <CheckCircle2 size={32} />
            </div>

            <p className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.4rem" }}>
              ACQUISITION CONFIRMED · PROVENANCE RESERVED
            </p>

            <h2 className="font-display" style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>
              YOUR PIECE IS RESERVED
            </h2>

            <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "rgba(14, 13, 13, 0.7)", maxWidth: "580px", margin: "0 auto 1.2rem" }}>
              Thank you, {formData.firstName}. Your one-of-one garment has entered The Archive under your provenance.
            </p>

            <div style={{ display: "inline-block", backgroundColor: "var(--color-cream)", padding: "1rem 2rem", border: "1px dashed var(--color-ink)", marginBottom: "1.8rem" }}>
              <span className="maru-eyebrow" style={{ fontSize: "0.6rem" }}>OFFICIAL ORDER IDENTIFIER</span>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.14em", marginTop: "2px" }}>
                {orderRef}
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "4px" }}>
                Dispatched via BlueDart Air to {formData.city}, {formData.state} · SMS tracking sent to {formData.phone}
              </p>
            </div>

            <div>
              <button
                type="button"
                className="azar-btn-black"
                onClick={onClose}
              >
                RETURN TO ATELIER
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
