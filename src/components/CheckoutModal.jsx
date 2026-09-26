"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  Sparkles,
  Smartphone,
  Building2,
  Printer,
  FileText,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "../context/StoreContext";

// Dynamically load official Razorpay SDK script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay checkout script from CDN.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart: items,
    currency,
    getCartTotal,
    clearCart,
    formatPrice,
    createOrder
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState("gateway"); // 'gateway' (UPI/Card/Netbanking via Razorpay)
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [gatewayNotice, setGatewayNotice] = useState("");

  const [formData, setFormData] = useState({
    firstName: "Ananya",
    lastName: "Singhania",
    email: "ananya.singhania@indie.in",
    phone: "+91 98200 45892",
    address: "Bungalow 4, Altamount Road",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400026"
  });

  // Hydrate remembered contact info if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("indie_summer_saved_contact");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const total = getCartTotal();
  const netSilhouetteValue = Math.round(total / 1.05);
  const totalGst = total - netSilhouetteValue;

  // Real Indian GST tax breakdown (Intra-state Goa: CGST+SGST, Inter-state: IGST)
  const isGoaDestination = formData.state?.trim().toLowerCase().includes("goa");
  const cgst = isGoaDestination ? Math.round(totalGst / 2) : 0;
  const sgst = isGoaDestination ? totalGst - cgst : 0;
  const igst = !isGoaDestination ? totalGst : 0;

  const onClose = () => {
    if (!isProcessing) {
      setCheckoutOpen(false);
      setPaymentError("");
    }
  };

  if (!checkoutOpen) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setIsProcessing(true);

    const generatedOrder = "IS-IND-" + Math.floor(100000 + Math.random() * 900000);
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    try {
      // Step 1: Initialize Payment Order on Server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          orderRef: generatedOrder,
          customerName: fullName,
          customerEmail: formData.email.trim()
        })
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to initialize payment gateway order.");
      }

      const orderData = await orderRes.json();
      const isRazorpayLoaded = await loadRazorpayScript();

      // Step 2A: Live / Test Razorpay Gateway execution
      if (isRazorpayLoaded && !orderData.isTestMode && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "INDIE SUMMER ATELIER",
          description: `Acquisition of ${items.length} Archival 1-of-1 Relic(s)`,
          image: "/images/logo.png",
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              // Step 3: Cryptographically verify payment on server
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.verified) {
                throw new Error(verifyData.error || "Payment signature verification failed.");
              }

              // Step 4: ONLY persist order & mark items as sold AFTER verified payment
              await finalizeOrder(generatedOrder, response.razorpay_payment_id, "PAID (RAZORPAY)");
            } catch (err) {
              console.error("Payment verification failure:", err);
              setPaymentError(err.message || "Payment verification failed. Your card was not charged.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: fullName,
            email: formData.email.trim(),
            contact: formData.phone.trim()
          },
          notes: {
            order_ref: generatedOrder,
            shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}`
          },
          theme: {
            color: "#111111"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setGatewayNotice("Payment window closed. Your piece remains safely reserved in your bag.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          setIsProcessing(false);
          setPaymentError(resp.error?.description || "Payment failed at issuing bank. Please retry.");
        });
        rzp.open();
        return;
      }

      // Step 2B: Atelier Sandbox Simulator mode (when merchant API keys are pending setup)
      // This explicitly warns and verifies before creating any order record
      const confirmSandbox = window.confirm(
        `[ATELIER GATEWAY SIMULATOR]\n\nSimulate authorized Razorpay payment of ${formatPrice(total, "INR")} for order ${generatedOrder}?\n\n(Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env.local for live production gateway.)`
      );

      if (!confirmSandbox) {
        setIsProcessing(false);
        setGatewayNotice("Checkout authorization paused. Your cart has not been charged.");
        return;
      }

      // Verify sandbox payment via server route
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_sandbox_${Date.now()}`
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.verified) {
        throw new Error("Sandbox payment authorization declined.");
      }

      await finalizeOrder(generatedOrder, verifyData.paymentId, "PAID (SANDBOX)");
    } catch (err) {
      console.error("Order processing error:", err);
      setPaymentError(err.message || "An unexpected error occurred during payment. Please retry.");
      setIsProcessing(false);
    }
  };

  const finalizeOrder = async (generatedOrder, confirmedPaymentId, paymentStatus) => {
    if (createOrder) {
      await createOrder({
        orderRef: generatedOrder,
        customerName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        customerAddress: `${formData.address.trim()}`,
        customerCity: formData.city.trim(),
        customerPincode: formData.postalCode.trim(),
        paymentMethod: "RAZORPAY GATEWAY",
        paymentId: confirmedPaymentId,
        paymentStatus: paymentStatus,
        totalAmountINR: total,
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          code: it.code,
          priceINR: it.priceINR,
          selectedSize: it.selectedSize || "One Size",
          imagePrimary: it.imagePrimary,
          quantity: it.quantity || 1
        }))
      });
    }

    try {
      localStorage.setItem(
        "indie_summer_saved_contact",
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        })
      );
    } catch (err) {
      // ignore
    }

    setOrderRef(generatedOrder);
    setPaymentId(confirmedPaymentId);
    setOrderSuccess(true);
    setIsProcessing(false);

    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#E53826", "#FBFBF7", "#C29547", "#111111"]
      });
    } catch (err) {
      console.log("Confetti trigger note:", err);
    }
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
          disabled={isProcessing}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            zIndex: 20,
            padding: "6px",
            backgroundColor: "rgba(251, 251, 247, 0.9)",
            cursor: isProcessing ? "not-allowed" : "pointer"
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

            {paymentError && (
              <div
                style={{
                  backgroundColor: "rgba(229, 56, 38, 0.08)",
                  border: "1px solid var(--color-siren)",
                  padding: "12px 16px",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.82rem",
                  color: "var(--color-siren)"
                }}
              >
                <AlertCircle size={18} />
                <span>{paymentError}</span>
              </div>
            )}

            {gatewayNotice && !paymentError && (
              <div
                style={{
                  backgroundColor: "rgba(194, 149, 71, 0.12)",
                  border: "1px solid #C29547",
                  padding: "10px 14px",
                  marginBottom: "1.5rem",
                  fontSize: "0.8rem",
                  color: "var(--color-ink)"
                }}
              >
                {gatewayNotice}
              </div>
            )}

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
                    2. PAYMENT CHANNELS
                  </h3>

                  <div
                    style={{
                      border: "1px solid var(--color-ink)",
                      backgroundColor: "#FFF",
                      padding: "1rem",
                      marginBottom: "1rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                        RAZORPAY SECURE PAYMENT SUITE
                      </span>
                      <span style={{ fontSize: "0.65rem", backgroundColor: "var(--color-ink)", color: "var(--color-ivory)", padding: "2px 6px" }}>
                        INSTANT VERIFICATION
                      </span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", lineHeight: 1.45, marginBottom: "0.8rem" }}>
                      Supports all major Indian and international payment options: UPI (Google Pay, PhonePe, Paytm, CRED), Visa, Mastercard, American Express, Netbanking across 50+ banks, and EMI.
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "0.7rem", color: "rgba(14, 13, 13, 0.65)" }}>
                      <span style={{ padding: "3px 8px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>✓ UPI Auto-Routing</span>
                      <span style={{ padding: "3px 8px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>✓ 3D Secure 2.0</span>
                      <span style={{ padding: "3px 8px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>✓ Zero-Liability Protection</span>
                    </div>
                  </div>
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
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Net Silhouette Value</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(netSilhouetteValue, currency)}</span>
                    </div>

                    {isGoaDestination ? (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                          <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Handloom CGST (2.5% Intra-State)</span>
                          <span style={{ fontWeight: 600 }}>{formatPrice(cgst, currency)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                          <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Handloom SGST (2.5% Intra-State)</span>
                          <span style={{ fontWeight: 600 }}>{formatPrice(sgst, currency)}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                        <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Handloom IGST (5.0% Inter-State)</span>
                        <span style={{ fontWeight: 600 }}>{formatPrice(igst, currency)}</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>BlueDart Express Air (2-3 Days)</span>
                      <span style={{ fontWeight: 600, color: "#166534" }}>COMPLIMENTARY</span>
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
                    {isProcessing ? "INITIALIZING SECURE GATEWAY..." : "AUTHORIZE & COMPLETE ORDER"}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "0.8rem", fontSize: "0.62rem", color: "rgba(14, 13, 13, 0.55)", letterSpacing: "0.1em" }}>
                    <ShieldCheck size={13} color="var(--color-ink)" /> <span>SECURE ATELIER CHECKOUT · 256-BIT TLS ENCRYPTED</span>
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
              PAYMENT VERIFIED · ACQUISITION CONFIRMED
            </p>

            <h2 className="font-display" style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>
              YOUR PIECE IS RESERVED
            </h2>

            <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "rgba(14, 13, 13, 0.7)", maxWidth: "580px", margin: "0 auto 1.2rem" }}>
              Thank you, {formData.firstName}. Your payment has been authorized and your one-of-one garment has entered The Archive under your provenance.
            </p>

            <div style={{ display: "inline-block", backgroundColor: "var(--color-cream)", padding: "1.2rem 2.2rem", border: "1px dashed var(--color-ink)", marginBottom: "1.8rem" }}>
              <span className="maru-eyebrow" style={{ fontSize: "0.6rem" }}>OFFICIAL ORDER IDENTIFIER</span>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.14em", marginTop: "2px" }}>
                {orderRef}
              </div>
              {paymentId && (
                <div style={{ fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px" }}>
                  Payment Reference: <code>{paymentId}</code>
                </div>
              )}
              <p style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "4px" }}>
                Dispatched via BlueDart Air to {formData.city}, {formData.state} · Tracking updates sent to {formData.phone}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button
                type="button"
                className="azar-btn-black"
                onClick={onClose}
              >
                RETURN TO ATELIER
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "transparent",
                  color: "var(--color-ink)",
                  border: "1px solid var(--color-ink)",
                  padding: "0 20px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  height: "44px"
                }}
              >
                <Printer size={14} /> PRINT INVOICE & PROVENANCE
              </button>

              <a
                href="/track"
                onClick={onClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--color-cream)",
                  color: "var(--color-ink)",
                  border: "1px solid var(--color-border)",
                  padding: "0 20px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  height: "44px"
                }}
              >
                <FileText size={14} /> TRACK DISPATCH STATUS
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
