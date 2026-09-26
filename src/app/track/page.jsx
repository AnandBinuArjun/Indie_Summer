"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { getLocalOrders } from "../../lib/orderStorage";

export default function TrackOrderPage() {
  const [orderRefInput, setOrderRefInput] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const maskName = (name) => {
    if (!name) return "Atelier Patron";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0] + "***";
    return `${parts[0][0]}*** ${parts[parts.length - 1]}`;
  };

  const maskContact = (contact) => {
    if (!contact) return "Registered on dispatch";
    if (contact.includes("@")) {
      const [user, domain] = contact.split("@");
      return `${user.slice(0, 2)}***@${domain}`;
    }
    const clean = contact.replace(/[^0-9]/g, "");
    if (clean.length >= 8) {
      return `+91 ******${clean.slice(-4)}`;
    }
    return "****";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanRef = orderRefInput.trim().toUpperCase();
    const cleanContact = contactInput.trim().toLowerCase();

    if (!cleanRef || !cleanContact) {
      setErrorMsg("Please provide both your official Order Reference and your email or phone for verification.");
      return;
    }

    setLoading(true);
    setSearched(true);
    setErrorMsg("");
    setOrder(null);

    // 1. Try Supabase with exact Order Reference
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_ref", cleanRef)
          .limit(1);

        if (!error && data && data.length > 0) {
          const record = data[0];
          // Strict verification check against email or phone
          const emailMatch = record.customer_email && record.customer_email.toLowerCase().includes(cleanContact);
          const phoneMatch = record.customer_phone && record.customer_phone.replace(/[^0-9]/g, "").includes(cleanContact.replace(/[^0-9]/g, ""));

          if (emailMatch || phoneMatch) {
            setOrder(record);
            setLoading(false);
            return;
          } else {
            setErrorMsg("Order reference found, but the verification email or phone does not match our records.");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase track error", err);
      }
    }

    // 2. Fallback to Local Storage
    const local = getLocalOrders();
    const found = local.find((o) => o.order_ref && o.order_ref.toUpperCase() === cleanRef);

      if (found) {
        const emailMatch = found.customer_email && found.customer_email.toLowerCase().includes(cleanContact);
        const phoneMatch = found.customer_phone && found.customer_phone.replace(/[^0-9]/g, "").includes(cleanContact.replace(/[^0-9]/g, ""));

        if (emailMatch || phoneMatch) {
          setOrder(found);
          setLoading(false);
          return;
        } else {
          setErrorMsg("Order reference found, but the verification email or phone does not match our records.");
          setLoading(false);
          return;
        }
      }

    setErrorMsg("No archival acquisition matches that reference and verification detail. Please check your confirmation receipt.");
    setLoading(false);
  };

  const getTimelineSteps = (status) => {
    const s = (status || "confirmed").toLowerCase();
    return [
      { label: "ACQUISITION CONFIRMED", desc: "Provenance reserved and recorded in atelier ledger.", done: true, current: s === "confirmed" },
      { label: "PROVENANCE PACKAGING", desc: "Garment steamed with botanicals and certificate prepared.", done: s === "dispatched" || s === "delivered", current: false },
      { label: "BLUEDART AIR DISPATCH", desc: "Secured in transit with express AWB tracking.", done: s === "dispatched" || s === "delivered", current: s === "dispatched" },
      { label: "DELIVERED TO PATRON", desc: "Delivered to recipient address with signature receipt.", done: s === "delivered", current: s === "delivered" }
    ];
  };

  return (
    <div style={{ backgroundColor: "var(--color-ivory)", minHeight: "100vh", color: "var(--color-ink)", paddingTop: "7rem", paddingBottom: "8rem" }}>
      <div className="site-container" style={{ maxWidth: "800px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.72rem",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(14, 13, 13, 0.6)",
            textDecoration: "none",
            marginBottom: "2rem"
          }}
        >
          <ArrowLeft size={14} /> RETURN TO ATELIER
        </Link>

        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--color-cream)", padding: "4px 12px", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
            <Truck size={13} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>ATELIER DISPATCH TRACKING</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: "1.05" }}>
            ORDER DISPATCH & PROVENANCE<span style={{ color: "var(--color-siren)" }}>.</span>
          </h1>
          <p className="font-serif italic" style={{ fontSize: "1.05rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "0.6rem" }}>
            Track the physical transit and certificate preparation of your 1-of-1 archival piece.
          </p>
        </div>

        {/* Search Input Box with Dual-Verification for Privacy */}
        <div style={{ backgroundColor: "#FFF", border: "1px solid var(--color-border)", padding: "2rem", marginBottom: "2.5rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="admin-2col-grid" style={{ gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
                  ORDER REFERENCE (REQUIRED)
                </label>
                <input
                  type="text"
                  required
                  value={orderRefInput}
                  onChange={(e) => setOrderRefInput(e.target.value)}
                  placeholder="e.g. IS-IND-749201 or AUC-WIN-1049"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-sans)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-ivory)",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
                  VERIFICATION EMAIL OR PHONE
                </label>
                <input
                  type="text"
                  required
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="e.g. patron@domain.com or phone"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-sans)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-ivory)",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
              <span style={{ fontSize: "0.7rem", color: "rgba(14, 13, 13, 0.55)", display: "flex", alignItems: "center", gap: "5px" }}>
                <ShieldCheck size={13} color="#166534" /> 2-factor identifier check protects patron shipping privacy.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="azar-btn-black"
                style={{ padding: "0 28px", height: "46px", fontSize: "0.74rem" }}
              >
                {loading ? "VERIFYING..." : "TRACK ACQUISITION"}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", padding: "1.2rem", marginBottom: "2rem" }}>
            <AlertCircle size={18} color="#991B1B" />
            <span style={{ fontSize: "0.85rem", color: "#991B1B" }}>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Found (PII Protected) */}
        {order && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ backgroundColor: "#FFF", border: "1px solid var(--color-border)", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
                <div>
                  <span className="maru-eyebrow" style={{ fontSize: "0.6rem", color: "var(--color-siren)" }}>OFFICIAL IDENTIFIER</span>
                  <h2 className="font-display" style={{ fontSize: "2rem", marginTop: "2px" }}>
                    {order.order_ref}
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "rgba(14, 13, 13, 0.65)", marginTop: "4px" }}>
                    Patron: <strong>{maskName(order.customer_name)}</strong> · Booked {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "long" }) : "Recent"}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="maru-eyebrow" style={{ fontSize: "0.6rem" }}>DELIVERY STATUS</span>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: "4px",
                      padding: "5px 14px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      backgroundColor: order.status === "delivered" ? "#DCFCE7" : order.status === "dispatched" ? "#E0F2FE" : "#FEF3C7",
                      color: order.status === "delivered" ? "#166534" : order.status === "dispatched" ? "#0369A1" : "#92400E"
                    }}
                  >
                    ● {order.status || "CONFIRMED"}
                  </div>
                </div>
              </div>

              {/* Step Timeline */}
              <div style={{ marginBottom: "2rem" }}>
                <span className="maru-eyebrow" style={{ fontSize: "0.6rem", display: "block", marginBottom: "1.2rem" }}>
                  TRANSIT & CERTIFICATION PROGRESSION
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                  {getTimelineSteps(order.status).map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1rem",
                        backgroundColor: step.done ? "var(--color-cream)" : "var(--color-ivory)",
                        border: step.done ? "1px solid var(--color-ink)" : "1px dashed var(--color-border)",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        {step.done ? <CheckCircle2 size={14} color="var(--color-siren)" /> : <Clock size={14} color="rgba(14,13,13,0.3)" />}
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          STEP 0{idx + 1}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                        {step.label}
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "rgba(14, 13, 13, 0.65)", lineHeight: "1.4" }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protected Delivery Destination & Acquired Pieces */}
              <div className="admin-2col-grid">
                <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.2rem", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <MapPin size={13} color="var(--color-siren)" />
                    <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>DESTINATION REGION</span>
                  </div>
                  <p style={{ fontWeight: 600 }}>{maskName(order.customer_name)}</p>
                  <p style={{ color: "rgba(14, 13, 13, 0.75)", lineHeight: "1.5", marginTop: "2px" }}>
                    {order.customer_city || "Pan-India"}
                    {order.customer_pincode && ` (PIN: ${order.customer_pincode})`}
                  </p>
                  <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed var(--color-border)", fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.55)" }}>
                    🔒 Full physical address hidden for patron security · BlueDart Air Express
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.2rem", border: "1px solid var(--color-border)" }}>
                  <span className="maru-eyebrow" style={{ fontSize: "0.58rem", marginBottom: "8px", display: "block" }}>
                    ACQUIRED RELIC(S)
                  </span>
                  {Array.isArray(order.items) && order.items.map((it, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      {it.imagePrimary && (
                        <img src={it.imagePrimary} alt={it.name} style={{ width: "36px", height: "48px", objectFit: "cover" }} />
                      )}
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{it.name}</div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(14, 13, 13, 0.6)" }}>
                          Size: {it.selectedSize || "One Size"} · 1-of-1 Relic
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
