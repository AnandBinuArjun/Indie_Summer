import React, { useState, useEffect } from "react";
import { X, Sparkles, Check, Clock, ShieldAlert } from "lucide-react";

export default function GuestListModal({ isOpen, onClose, initialData }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [vipCode, setVipCode] = useState(initialData?.vipCode || "");
  const [submitted, setSubmitted] = useState(Boolean(initialData?.vipCode));

  // Drop countdown timer simulator (e.g. 4 days, 14 hours, 28 mins)
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 28,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email) return;
    const code = "IS-VIP-" + Math.floor(1000 + Math.random() * 9000);
    setVipCode(code);
    setSubmitted(true);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose} style={{ zIndex: 130 }}>
      <div
        className="checkout-modal-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--color-ivory)",
          maxWidth: "580px",
          width: "100%",
          padding: "2.8rem 2.2rem",
          position: "relative",
          textAlign: "center"
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{ position: "absolute", top: "18px", right: "18px" }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.5rem" }}>
          VOL. 002 — GOLDEN HOUR ESCAPE
        </span>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", lineHeight: 0.95, marginBottom: "0.8rem" }}>
          THE GUEST LIST
        </h2>

        {/* Live Drop Countdown */}
        <div
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-ivory)",
            padding: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            margin: "1.2rem 0 1.8rem"
          }}
        >
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{timeLeft.days}</span>
            <span className="maru-eyebrow" style={{ display: "block", fontSize: "0.55rem", opacity: 0.7 }}>DAYS</span>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{timeLeft.hours}</span>
            <span className="maru-eyebrow" style={{ display: "block", fontSize: "0.55rem", opacity: 0.7 }}>HOURS</span>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{timeLeft.minutes}</span>
            <span className="maru-eyebrow" style={{ display: "block", fontSize: "0.55rem", opacity: 0.7 }}>MINS</span>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-siren)" }}>{timeLeft.seconds}</span>
            <span className="maru-eyebrow" style={{ display: "block", fontSize: "0.55rem", opacity: 0.7 }}>SECS</span>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleRegister}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1rem", color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
              Fifty one-of-one silk gowns. Handcrafted in Spain. Guest List receives private doors access 2 hours prior to public drop.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.2rem" }}>
              <input
                type="email"
                required
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-grotesk)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "center"
                }}
              />
              <input
                type="tel"
                placeholder="PHONE NUMBER FOR DROP SMS"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  padding: "12px",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-grotesk)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "center"
                }}
              />
            </div>

            <button type="submit" className="btn-dark" style={{ width: "100%", padding: "1rem" }}>
              <Sparkles size={16} /> REQUEST VIP ENTRANCE
            </button>
          </form>
        ) : (
          <div
            style={{
              border: "1px dashed var(--color-ink)",
              padding: "1.8rem",
              backgroundColor: "var(--color-cream)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--color-siren)",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.8rem"
              }}
            >
              <Check size={28} />
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>
              COLLECTOR PASS CONFIRMED
            </h3>

            <div
              style={{
                fontFamily: "var(--font-grotesk)",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "var(--color-ink)",
                margin: "10px 0"
              }}
            >
              {vipCode}
            </div>

            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
              Access token assigned to {email || "collector"}. Keep this code safe for priority entry.
            </p>

            <button
              type="button"
              className="btn-dark"
              onClick={onClose}
              style={{ marginTop: "1.2rem", padding: "0.8rem 1.8rem" }}
            >
              RETURN TO ATELIER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
