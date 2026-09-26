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
import { trackPurchase, trackInitiateCheckout, trackAddPaymentInfo } from "./Analytics";

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
    getSubtotal,
    getCartTotal,
    discount,
    setDiscount,
    siteSettings,
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

  const [country, setCountry] = useState("India");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoError, setPromoError] = useState("");

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
        if (parsed.country) setCountry(parsed.country);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const subtotal = getSubtotal();
  const total = getCartTotal();
  const discountAmount = Math.max(0, subtotal - total);
  const netSilhouetteValue = Math.round(total / 1.05);
  const totalGst = total - netSilhouetteValue;

  // Real Indian GST tax breakdown (Intra-state Goa: CGST+SGST, Inter-state: IGST)
  const isDomesticIndia = country === "India";
  const isGoaDestination = isDomesticIndia && formData.state?.trim().toLowerCase().includes("goa");
  const cgst = isGoaDestination ? Math.round(totalGst / 2) : 0;
  const sgst = isGoaDestination ? totalGst - cgst : 0;
  const igst = isDomesticIndia && !isGoaDestination ? totalGst : 0;

  // Track InitiateCheckout in GA4 & Meta Pixel
  useEffect(() => {
    if (checkoutOpen && items.length > 0) {
      try {
        trackInitiateCheckout(items, total);
      } catch (err) {
        // ignore
      }
    }
  }, [checkoutOpen]);

  const handleApplyPromo = (e) => {
    e?.preventDefault();
    setPromoError("");
    setPromoMessage("");
    const cleanCode = promoCodeInput.trim().toUpperCase();
    const targetCode = (siteSettings?.promoCode || "INDIE10").toUpperCase();
    const discountRate = siteSettings?.promoDiscount || 10;

    if (!cleanCode) return;

    if (cleanCode === targetCode || cleanCode === "INDIE10" || cleanCode === "PATRON15" || cleanCode === "ARCHIVE10") {
      const appliedRate = cleanCode === "PATRON15" ? 15 : discountRate;
      setDiscount(appliedRate);
      setPromoMessage(`✓ Voucher ${cleanCode} activated (-${appliedRate}% Patron Courtesy)`);
    } else {
      setPromoError("Invalid courtesy voucher code. Try INDIE10 for 10% off.");
    }
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setPromoCodeInput("");
    setPromoMessage("");
    setPromoError("");
  };

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
    const orderPayload = {
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
    };

    if (createOrder) {
      await createOrder(orderPayload);
    }

    // Trigger Automated Transactional Email & SMS / WhatsApp Invoice
    try {
      fetch("/api/notifications/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_ref: generatedOrder,
          customer_name: orderPayload.customerName,
          customer_email: orderPayload.customerEmail,
          customer_phone: orderPayload.customerPhone,
          customer_address: orderPayload.customerAddress,
          customer_city: orderPayload.customerCity,
          customer_pincode: orderPayload.customerPincode,
          payment_method: orderPayload.paymentMethod,
          payment_id: confirmedPaymentId,
          total_amount_inr: total,
          items: orderPayload.items
        })
      }).catch((err) => console.warn("Background confirmation email notice:", err));
    } catch (e) {
      // background non-blocking
    }

    // Track Ecommerce Purchase Event in GA4 & Meta Pixel
    try {
      trackPurchase({
        order_ref: generatedOrder,
        total_amount_inr: total,
        items: orderPayload.items
      });
    } catch (err) {
      console.warn("Analytics purchase tracking error:", err);
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
                      DESTINATION COUNTRY / REGION
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "#FFF",
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="India">India (Pan-India BlueDart Air Dispatch)</option>
                      <option value="United States">United States (DHL Express Worldwide)</option>
                      <option value="United Kingdom">United Kingdom (DHL Express Worldwide)</option>
                      <option value="United Arab Emirates">United Arab Emirates (DHL Express Worldwide)</option>
                      <option value="Singapore">Singapore (DHL Express Worldwide)</option>
                      <option value="Australia">Australia (DHL Express Worldwide)</option>
                      <option value="France">France (DHL Express Worldwide)</option>
                      <option value="Germany">Germany (DHL Express Worldwide)</option>
                      <option value="Canada">Canada (DHL Express Worldwide)</option>
                      <option value="Switzerland">Switzerland (DHL Express Worldwide)</option>
                      <option value="Japan">Japan (DHL Express Worldwide)</option>
                      <option value="International">Other International Destination</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.62rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      STREET ADDRESS / ESTATE / APARTMENT
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--color-border)", backgroundColor: "#FFF", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "8px", marginBottom: "1rem" }}>
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
                        {isDomesticIndia ? "STATE" : "STATE / PROVINCE"}
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
                        {isDomesticIndia ? "PIN CODE" : "POSTAL / ZIP CODE"}
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

                  {/* Gift Packaging & Wax-Sealed Note Option */}
                  <div
                    style={{
                      backgroundColor: "var(--color-cream)",
                      border: "1px solid var(--color-border)",
                      padding: "10px 12px",
                      marginBottom: "1.5rem"
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        style={{ accentColor: "var(--color-ink)", width: "15px", height: "15px" }}
                      />
                      <span>Complimentary Wax-Sealed Heritage Gift Box & Calligraphy Card</span>
                    </label>

                    {isGift && (
                      <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed var(--color-border)" }}>
                        <div style={{ marginBottom: "6px" }}>
                          <label style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "3px" }}>
                            RECIPIENT NAME
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Tara Mehra"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "3px" }}>
                            HANDWRITTEN CALLIGRAPHY MESSAGE (UP TO 200 CHARS)
                          </label>
                          <textarea
                            rows={2}
                            maxLength={200}
                            placeholder="A personal inscription sealed with our crimson atelier wax seal..."
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF", resize: "none" }}
                          />
                        </div>
                      </div>
                    )}
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

                  {/* Promo Code Box */}
                  <div style={{ marginBottom: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        type="text"
                        placeholder="VOUCHER (e.g. INDIE10)"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        disabled={discount > 0}
                        style={{
                          flex: 1,
                          padding: "7px 10px",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          backgroundColor: discount > 0 ? "rgba(22, 101, 52, 0.08)" : "#FFF",
                          outline: "none"
                        }}
                      />
                      {discount > 0 ? (
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          style={{
                            padding: "7px 12px",
                            backgroundColor: "transparent",
                            color: "var(--color-siren)",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          REMOVE
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          style={{
                            padding: "7px 14px",
                            backgroundColor: "var(--color-ink)",
                            color: "var(--color-ivory)",
                            border: "none",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            cursor: "pointer"
                          }}
                        >
                          APPLY
                        </button>
                      )}
                    </div>

                    {promoMessage && (
                      <div style={{ fontSize: "0.7rem", color: "#166534", marginTop: "4px", fontWeight: 600 }}>
                        {promoMessage}
                      </div>
                    )}
                    {promoError && (
                      <div style={{ fontSize: "0.7rem", color: "var(--color-siren)", marginTop: "4px" }}>
                        {promoError}
                      </div>
                    )}
                    {!discount && !promoMessage && (
                      <span style={{ fontSize: "0.65rem", color: "rgba(14, 13, 13, 0.5)", marginTop: "3px", display: "block" }}>
                        Hint: Use code <strong>INDIE10</strong> for 10% acquisition courtesy.
                      </span>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "0.8rem", marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Original Silhouette Value</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(subtotal, currency)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem", color: "#166534" }}>
                        <span>Patron Courtesy Discount (-{discount}%)</span>
                        <span style={{ fontWeight: 700 }}>-{formatPrice(discountAmount, currency)}</span>
                      </div>
                    )}

                    {isDomesticIndia ? (
                      isGoaDestination ? (
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
                      )
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                        <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Customs & Export Handling</span>
                        <span style={{ fontWeight: 600, color: "#166534" }}>ZERO-RATED EXPORT</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.82rem" }}>
                      <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>
                        {isDomesticIndia ? "BlueDart Express Air (2-3 Days)" : "DHL Express Worldwide Air (3-5 Days)"}
                      </span>
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
                    style={{
                      marginTop: "1.2rem",
                      backgroundColor: "var(--color-ink)",
                      color: "var(--color-ivory)",
                      border: "none",
                      padding: "16px",
                      fontSize: "0.78rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <Lock size={15} />
                    {isProcessing ? "INITIALIZING SECURE GATEWAY..." : `AUTHORIZE PAYMENT · ${formatPrice(total, currency)}`}
                  </button>

                  <div style={{ marginTop: "1rem", textAlign: "center", borderTop: "1px dashed rgba(14,13,13,0.15)", paddingTop: "0.8rem" }}>
                    <a
                      href="https://wa.me/919820045892?text=Hello%20Indie%20Summer%20Atelier,%20I%20have%20an%20inquiry%20before%20completing%20my%20bag%20acquisition."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.72rem",
                        color: "rgba(14, 13, 13, 0.7)",
                        textDecoration: "underline"
                      }}
                    >
                      <Smartphone size={13} color="#25D366" /> Inquire with Atelier Stylist on WhatsApp
                    </a>
                  </div>

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
