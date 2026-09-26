"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured. Please check your .env.local file.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace("/admin");
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="maru-eyebrow" style={{ color: "rgba(251,251,247,0.45)", letterSpacing: "0.2em", fontSize: "0.65rem" }}>
          VERIFYING CLEARANCE...
        </span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundImage: "radial-gradient(ellipse at 60% 40%, rgba(169,36,36,0.06) 0%, transparent 70%)" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <img src="/images/logo-light.png" alt="INDIE SUMMER" style={{ height: "50px", width: "auto", objectFit: "contain", marginBottom: "1.2rem" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", backgroundColor: "rgba(229,56,38,0.1)", padding: "6px 16px", border: "1px solid rgba(229,56,38,0.25)" }}>
            <ShieldCheck size={12} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>RESTRICTED ACCESS · ADMIN ONLY</span>
          </div>
        </div>

        <div style={{ backgroundColor: "rgba(251,251,247,0.04)", border: "1px solid rgba(251,251,247,0.1)", padding: "2.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "2.4rem", color: "var(--color-ivory)", marginBottom: "0.2rem" }}>
            ATELIER LOGIN<span style={{ color: "var(--color-siren)" }}>.</span>
          </h1>
          <p className="font-serif" style={{ fontStyle: "italic", color: "rgba(251,251,247,0.5)", fontSize: "0.92rem", marginBottom: "2rem" }}>
            Authorised personnel only.
          </p>

          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "9px", backgroundColor: "rgba(229,56,38,0.1)", border: "1px solid rgba(229,56,38,0.3)", padding: "12px 14px", marginBottom: "1.5rem" }}>
              <AlertCircle size={15} color="var(--color-siren)" style={{ flexShrink: 0, marginTop: "1px" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--color-siren)", lineHeight: "1.4" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,251,247,0.5)", marginBottom: "7px", fontFamily: "var(--font-sans)" }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "rgba(251,251,247,0.3)", pointerEvents: "none" }} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@indiesummer.in"
                  style={{ width: "100%", padding: "13px 13px 13px 40px", backgroundColor: "rgba(251,251,247,0.06)", border: "1px solid rgba(251,251,247,0.12)", color: "var(--color-ivory)", fontSize: "0.9rem", outline: "none", fontFamily: "var(--font-sans)" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,251,247,0.5)", marginBottom: "7px", fontFamily: "var(--font-sans)" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "rgba(251,251,247,0.3)", pointerEvents: "none" }} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: "100%", padding: "13px 42px 13px 40px", backgroundColor: "rgba(251,251,247,0.06)", border: "1px solid rgba(251,251,247,0.12)", color: "var(--color-ivory)", fontSize: "0.9rem", outline: "none", fontFamily: "var(--font-sans)" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(251,251,247,0.35)", padding: "2px" }} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{ marginTop: "0.4rem", backgroundColor: loading || !email || !password ? "rgba(251,251,247,0.08)" : "var(--color-ivory)", color: loading || !email || !password ? "rgba(251,251,247,0.35)" : "var(--color-ink)", border: "none", padding: "15px", fontSize: "0.74rem", fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: loading || !email || !password ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s ease" }}
            >
              <ShieldCheck size={14} />
              {loading ? "AUTHORISING ACCESS..." : "ACCESS CONTROL PORTAL"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.8rem", padding: "1.2rem 1.5rem", backgroundColor: "rgba(251,251,247,0.03)", border: "1px solid rgba(251,251,247,0.07)" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(251,251,247,0.35)", letterSpacing: "0.06em", lineHeight: "1.7" }}>
            <strong style={{ color: "rgba(251,251,247,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>First time setup:</strong>
            {" "}Supabase Dashboard → Authentication → Users → Add User to create your admin account. Then sign in above.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.64rem", color: "rgba(251,251,247,0.2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          INDIE SUMMER · ATELIER CONTROL PORTAL · RESTRICTED
        </p>
      </div>
    </div>
  );
}
