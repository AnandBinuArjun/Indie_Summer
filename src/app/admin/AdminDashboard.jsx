"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  Package,
  Gavel,
  Database,
  Check,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  Copy,
  Sparkles,
  TrendingUp,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminDashboard() {
  const {
    products,
    siteSettings,
    updateSiteSettings,
    updateProduct,
    addProduct,
    deleteProduct,
    formatPrice
  } = useStore();

  const [activeTab, setActiveTab] = useState("overview"); // overview, customization, products, bidding, sql_setup

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    marqueeTicker: siteSettings?.marqueeTicker || "",
    heroTitle: siteSettings?.heroTitle || "",
    heroSubtitle: siteSettings?.heroSubtitle || "",
    heroTagline: siteSettings?.heroTagline || "",
    currentVolume: siteSettings?.currentVolume || "VOL. 001",
    dropStatus: siteSettings?.dropStatus || "LIVE FOR ACQUISITION",
    promoCode: siteSettings?.promoCode || "INDIE10",
    promoDiscount: siteSettings?.promoDiscount || 10,
    phoneContact: siteSettings?.phoneContact || "+91 98200 45892",
    emailContact: siteSettings?.emailContact || "atelier@indiesummer.in"
  });

  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingDb, setSyncingDb] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    code: `VINTAGE SAREE / PIECE 0${products.length + 1}`,
    priceINR: 28000,
    category: "vintage-saree",
    isBidding: false,
    startingBidINR: 28000,
    currentBidINR: 28000,
    minBidIncrementINR: 500,
    material: "Vintage Handwoven Silk Saree with Antique Zari",
    origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
    imagePrimary: "/images/piece-crimson-saree.jpg",
    description: "Handcrafted from an archival vintage saree. One design. One piece. Never again."
  });

  // Calculate Metrics
  const totalRelics = products.length;
  const activeAuctions = products.filter((p) => p.isBidding).length;
  const directBuyPieces = totalRelics - activeAuctions;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.isBidding ? p.currentBidINR : p.priceINR), 0);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleToggleAuction = async (product) => {
    const updated = {
      ...product,
      isBidding: !product.isBidding,
      startingBidINR: product.isBidding ? 0 : product.priceINR,
      currentBidINR: product.isBidding ? 0 : product.priceINR,
      minBidIncrementINR: 500,
      bidsCount: product.isBidding ? 0 : 1
    };
    await updateProduct(updated);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddNewProductSubmit = async (e) => {
    e.preventDefault();
    await addProduct(newProductForm);
    setIsAddingNew(false);
    setNewProductForm({
      name: "",
      code: `VINTAGE SAREE / PIECE 0${products.length + 2}`,
      priceINR: 28000,
      category: "vintage-saree",
      isBidding: false,
      startingBidINR: 28000,
      currentBidINR: 28000,
      minBidIncrementINR: 500,
      material: "Vintage Handwoven Silk Saree with Antique Zari",
      origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
      imagePrimary: "/images/piece-crimson-saree.jpg",
      description: "Handcrafted from an archival vintage saree. One design. One piece. Never again."
    });
  };

  const handleSyncSupabaseSeed = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setSyncStatus("Supabase is not configured yet. Please check .env.local.");
      return;
    }

    setSyncingDb(true);
    setSyncStatus("Pushing products and settings to Supabase...");

    try {
      // 1. Sync Settings
      const settingRows = [
        { key: "marquee_ticker", value: JSON.stringify(settingsForm.marqueeTicker) },
        { key: "hero_title", value: JSON.stringify(settingsForm.heroTitle) },
        { key: "hero_subtitle", value: JSON.stringify(settingsForm.heroSubtitle) },
        { key: "hero_tagline", value: JSON.stringify(settingsForm.heroTagline) },
        { key: "current_volume", value: JSON.stringify(settingsForm.currentVolume) },
        { key: "drop_status", value: JSON.stringify(settingsForm.dropStatus) },
        { key: "promo_code", value: JSON.stringify(settingsForm.promoCode) },
        { key: "promo_discount", value: JSON.stringify(settingsForm.promoDiscount) },
        { key: "phone_contact", value: JSON.stringify(settingsForm.phoneContact) },
        { key: "email_contact", value: JSON.stringify(settingsForm.emailContact) }
      ];
      await supabase.from("site_settings").upsert(settingRows);

      // 2. Sync Products
      for (const prod of products) {
        await supabase.from("products").upsert({
          id: prod.id,
          code: prod.code,
          name: prod.name,
          price_inr: prod.priceINR,
          price_usd: prod.priceUSD || Math.round(prod.priceINR / 83),
          price_eur: prod.priceEUR || Math.round(prod.priceINR / 90),
          price_gbp: prod.priceGBP || Math.round(prod.priceINR / 105),
          price_aed: prod.priceAED || Math.round(prod.priceINR / 22),
          category: prod.category,
          is_one_of_one: true,
          is_bidding: prod.isBidding || false,
          starting_bid_inr: prod.startingBidINR || prod.priceINR,
          current_bid_inr: prod.currentBidINR || prod.priceINR,
          min_bid_increment_inr: prod.minBidIncrementINR || 500,
          edition: prod.edition || "1 OF 1 VINTAGE SAREE GOWN",
          status: prod.status || "available",
          material: prod.material,
          origin: prod.origin,
          image_primary: prod.imagePrimary,
          image_secondary: prod.imageSecondary || null,
          description: prod.description
        });
      }

      setSyncStatus("✓ Success! All products and site settings synced to Supabase database.");
    } catch (err) {
      setSyncStatus(`Sync error: ${err.message || "Failed to sync. Please ensure tables exist in Supabase."}`);
    } finally {
      setSyncingDb(false);
    }
  };

  const copySqlCode = () => {
    const sql = `-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  category TEXT DEFAULT 'vintage-saree',
  is_one_of_one BOOLEAN DEFAULT TRUE,
  is_bidding BOOLEAN DEFAULT FALSE,
  starting_bid_inr NUMERIC DEFAULT 0,
  current_bid_inr NUMERIC DEFAULT 0,
  min_bid_increment_inr NUMERIC DEFAULT 500,
  bids_count INT DEFAULT 0,
  status TEXT DEFAULT 'available',
  material TEXT,
  origin TEXT,
  image_primary TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public write products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public write settings" ON public.site_settings FOR ALL USING (true);
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div style={{ backgroundColor: "#F7F6F2", minHeight: "100vh", color: "var(--color-ink)", paddingTop: "5.5rem", paddingBottom: "6rem" }}>
      <div className="site-container">
        {/* Top Header Banner */}
        <div
          style={{
            backgroundColor: "var(--color-ink)",
            color: "var(--color-ivory)",
            padding: "2rem 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            border: "1px solid #333"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: isSupabaseConfigured ? "#22C55E" : "#EAB308"
                }}
              />
              <span className="maru-eyebrow" style={{ color: "#E0D7C6", fontSize: "0.65rem", letterSpacing: "0.22em" }}>
                ATELIER CONTROL PORTAL · SUPABASE DB: GQVMDRTLOCVIDJTIYYCV
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "4px", letterSpacing: "0.02em" }}>
              INDIE SUMMER ADMIN<span style={{ color: "var(--color-siren)" }}>.</span>
            </h1>
            <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "rgba(251, 251, 247, 0.7)", marginTop: "4px" }}>
              Customise storefront typography, manage one-of-one vintage saree relics, and control live auctions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(251, 251, 247, 0.1)",
                color: "var(--color-ivory)",
                padding: "10px 18px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid rgba(251, 251, 247, 0.2)",
                fontWeight: 600
              }}
            >
              LIVE STOREFRONT <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--color-border)",
            marginBottom: "2.5rem",
            overflowX: "auto",
            paddingBottom: "2px"
          }}
        >
          {[
            { id: "overview", label: "OVERVIEW & METRICS", icon: TrendingUp },
            { id: "customization", label: "WEBSITE CUSTOMIZATION", icon: Sliders },
            { id: "products", label: `1-OF-1 PRODUCTS (${totalRelics})`, icon: Package },
            { id: "bidding", label: `LIVE AUCTIONS (${activeAuctions})`, icon: Gavel },
            { id: "sql_setup", label: "SUPABASE DATABASE", icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "none",
                  borderBottom: isActive ? "2.5px solid var(--color-ink)" : "2.5px solid transparent",
                  backgroundColor: isActive ? "var(--color-ivory)" : "transparent",
                  color: isActive ? "var(--color-ink)" : "rgba(14, 13, 13, 0.6)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={15} color={isActive ? "var(--color-siren)" : "currentColor"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & METRICS                                      */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  TOTAL 1-OF-1 RELICS
                </span>
                <div className="font-display" style={{ fontSize: "2.8rem", marginTop: "4px" }}>
                  {totalRelics}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Archival vintage pieces in Volume 001
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                  LIVE ATELIER AUCTIONS
                </span>
                <div className="font-display" style={{ fontSize: "2.8rem", marginTop: "4px", color: "var(--color-siren)" }}>
                  {activeAuctions}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Active bidding pieces (Min +₹500)
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  DIRECT ACQUISITION PIECES
                </span>
                <div className="font-display" style={{ fontSize: "2.8rem", marginTop: "4px" }}>
                  {directBuyPieces}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Instant buy-it-now silhouettes
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "1.8rem", border: "1px solid var(--color-border)" }}>
                <span className="maru-eyebrow" style={{ color: "rgba(14, 13, 13, 0.55)", fontSize: "0.6rem" }}>
                  CATALOG INVENTORY VALUE
                </span>
                <div className="font-display" style={{ fontSize: "2.2rem", marginTop: "8px" }}>
                  {formatPrice(totalInventoryValue, "INR")}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                  Current leading valuations
                </p>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div style={{ backgroundColor: "var(--color-ivory)", padding: "2rem", border: "1px solid var(--color-border)" }}>
                <h3 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
                  CUSTOMISE STOREFRONT
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.75)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  Update marquee announcements, hero headlines, drop volume number, and active promo discounts live across the entire website.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("customization")}
                  className="azar-btn-black"
                  style={{ fontSize: "0.72rem" }}
                >
                  CUSTOMISE SITE CONTENT <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ backgroundColor: "var(--color-ivory)", padding: "2rem", border: "1px solid var(--color-border)" }}>
                <h3 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
                  MANAGE VINTAGE RELICS
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.75)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  Add newly discovered vintage Indian saree silhouettes, toggle live auctions on/off, adjust minimum increments, or edit textile provenance.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className="azar-btn-black"
                  style={{ fontSize: "0.72rem" }}
                >
                  MANAGE PRODUCT CATALOG <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEBSITE CUSTOMIZATION                                  */}
        {/* ============================================================== */}
        {activeTab === "customization" && (
          <div style={{ backgroundColor: "var(--color-ivory)", padding: "2.5rem", border: "1px solid var(--color-border)", maxWidth: "900px" }}>
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.62rem" }}>
                LIVE CONTENT EDITOR
              </span>
              <h2 className="font-display" style={{ fontSize: "2.2rem", marginTop: "4px" }}>
                STOREFRONT CUSTOMIZATION
              </h2>
              <p className="font-serif italic" style={{ fontSize: "1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "4px" }}>
                Changes saved here reflect in real-time on the homepage marquee, editorial hero, and checkout engine.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              {/* Marquee Ticker */}
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  TOP RUNNING MARQUEE ANNOUNCEMENT
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.marqueeTicker}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeTicker: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "0.85rem",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#FFF",
                    outline: "none",
                    fontFamily: "var(--font-sans)"
                  }}
                />
                <span style={{ fontSize: "0.7rem", color: "rgba(14, 13, 13, 0.55)" }}>
                  Appears in the scrolling black ticker at the top of every page.
                </span>
              </div>

              {/* Hero Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  HERO MAIN HEADLINE
                </label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#FFF",
                    outline: "none",
                    fontFamily: "var(--font-display)"
                  }}
                />
              </div>

              {/* Hero Subtitle */}
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  HERO EDITORIAL SUBTITLE
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "0.9rem",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#FFF",
                    outline: "none",
                    fontFamily: "var(--font-serif)"
                  }}
                />
              </div>

              {/* Volume & Drop Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    CURRENT DROP VOLUME
                  </label>
                  <input
                    type="text"
                    value={settingsForm.currentVolume}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentVolume: e.target.value })}
                    placeholder="e.g. VOL. 001"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    DROP STATUS BADGE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.dropStatus}
                    onChange={(e) => setSettingsForm({ ...settingsForm, dropStatus: e.target.value })}
                    placeholder="e.g. LIVE FOR ACQUISITION"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Promo Code & Discount */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ACTIVE PROMO CODE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.promoCode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoCode: e.target.value })}
                    placeholder="INDIE10"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    DISCOUNT PERCENTAGE (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={settingsForm.promoDiscount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDiscount: Number(e.target.value) })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ATELIER CONCIERGE PHONE
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phoneContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneContact: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ATELIER EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={settingsForm.emailContact}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emailContact: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#FFF",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="azar-btn-black"
                  style={{ height: "50px", padding: "0 2rem", fontSize: "0.75rem" }}
                >
                  SAVE & SYNC TO STOREFRONT
                </button>

                {settingsSaved && (
                  <span style={{ color: "#166534", fontWeight: 600, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Check size={16} /> Saved & applied successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: 1-OF-1 PRODUCTS CATALOG                                */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
              <div>
                <h2 className="font-display" style={{ fontSize: "2rem" }}>
                  VINTAGE RELICS CATALOG
                </h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.65)" }}>
                  Toggle live bidding on any piece, adjust prices, or introduce new vintage Indian saree silhouettes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="azar-btn-black"
                style={{ fontSize: "0.72rem", height: "42px" }}
              >
                <Plus size={15} /> ADD NEW 1-OF-1 RELIC
              </button>
            </div>

            {/* Product Table */}
            <div style={{ backgroundColor: "var(--color-ivory)", border: "1px solid var(--color-border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid var(--color-border)", backgroundColor: "var(--color-cream)", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.14em" }}>
                    <th style={{ padding: "14px 16px" }}>PIECE</th>
                    <th style={{ padding: "14px 16px" }}>CATEGORY</th>
                    <th style={{ padding: "14px 16px" }}>PRICE / LEADING BID</th>
                    <th style={{ padding: "14px 16px" }}>SALE TYPE</th>
                    <th style={{ padding: "14px 16px" }}>STATUS</th>
                    <th style={{ padding: "14px 16px", textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={p.imagePrimary}
                            alt={p.name}
                            style={{ width: "42px", height: "56px", objectFit: "cover", border: "1px solid var(--color-border)" }}
                          />
                          <div>
                            <span style={{ fontSize: "0.62rem", color: "var(--color-siren)", fontWeight: 700 }}>
                              {p.code}
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</div>
                            <span className="font-serif italic" style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>
                              {p.material}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px", textTransform: "uppercase", fontSize: "0.72rem" }}>
                        {p.category}
                      </td>

                      <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                        {p.isBidding ? (
                          <div>
                            <span style={{ color: "var(--color-siren)", fontSize: "0.65rem", display: "block" }}>
                              HIGH BID ({p.bidsCount || 0} BIDS)
                            </span>
                            ₹{p.currentBidINR.toLocaleString("en-IN")}
                          </div>
                        ) : (
                          <div>
                            ₹{p.priceINR.toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleAuction(p)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            border: p.isBidding ? "1px solid var(--color-siren)" : "1px solid var(--color-border)",
                            backgroundColor: p.isBidding ? "rgba(169, 36, 36, 0.12)" : "transparent",
                            color: p.isBidding ? "var(--color-siren)" : "var(--color-ink)",
                            cursor: "pointer"
                          }}
                        >
                          {p.isBidding ? "⚡ LIVE AUCTION (ON)" : "DIRECT BUY (OFF)"}
                        </button>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            backgroundColor: p.status === "available" ? "rgba(34, 197, 94, 0.1)" : "rgba(14, 13, 13, 0.1)",
                            color: p.status === "available" ? "#166534" : "#666"
                          }}
                        >
                          {p.status || "available"}
                        </span>
                      </td>

                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...p })}
                            style={{ padding: "6px", background: "none", border: "1px solid var(--color-border)", cursor: "pointer" }}
                            title="Edit Piece"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            style={{ padding: "6px", background: "none", border: "1px solid var(--color-border)", color: "var(--color-siren)", cursor: "pointer" }}
                            title="Delete Piece"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: LIVE AUCTIONS & BIDS MANAGER                            */}
        {/* ============================================================== */}
        {activeTab === "bidding" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                AUCTION MANAGEMENT (MIN ₹500 INCREMENT ENFORCED)
              </span>
              <h2 className="font-display" style={{ fontSize: "2.2rem" }}>
                LIVE ATELIER BIDDING PORTAL
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.7)" }}>
                Real-time oversight of leading offers, bidder pseudonyms, and auction states across active 1-of-1 pieces.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              {products.filter((p) => p.isBidding).map((prod) => (
                <div key={prod.id} style={{ backgroundColor: "var(--color-ivory)", border: "1.5px solid var(--color-ink)", padding: "1.8rem" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
                    <img src={prod.imagePrimary} alt={prod.name} style={{ width: "65px", height: "85px", objectFit: "cover" }} />
                    <div>
                      <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.6rem" }}>
                        {prod.code}
                      </span>
                      <h3 className="font-display" style={{ fontSize: "1.3rem", marginTop: "2px" }}>
                        {prod.name}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "rgba(14, 13, 13, 0.6)" }}>
                        Min Increment: ₹{prod.minBidIncrementINR || 500}
                      </span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "var(--color-cream)", padding: "12px", border: "1px solid var(--color-border)", marginBottom: "1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                        CURRENT HIGHEST BID:
                      </span>
                      <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-sans)", color: "var(--color-siren)" }}>
                        ₹{prod.currentBidINR.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "rgba(14, 13, 13, 0.6)", marginTop: "4px" }}>
                      <span>Next Minimum Bid: ₹{(prod.currentBidINR + (prod.minBidIncrementINR || 500)).toLocaleString("en-IN")}</span>
                      <span>Total Bids: {prod.bidsCount || 0}</span>
                    </div>
                  </div>

                  {/* Quick Admin Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      href={`/product/${prod.id}#bidding`}
                      target="_blank"
                      className="azar-btn-black"
                      style={{ flex: 1, height: "38px", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                    >
                      VIEW BIDDING PORTAL <ExternalLink size={12} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleAuction(prod)}
                      style={{
                        padding: "0 12px",
                        fontSize: "0.65rem",
                        backgroundColor: "transparent",
                        border: "1px solid var(--color-border)",
                        cursor: "pointer"
                      }}
                    >
                      CLOSE AUCTION
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SUPABASE DATABASE                                       */}
        {/* ============================================================== */}
        {activeTab === "sql_setup" && (
          <div style={{ backgroundColor: "var(--color-ivory)", padding: "2.5rem", border: "1px solid var(--color-border)", maxWidth: "900px" }}>
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.2rem" }}>
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)" }}>
                POSTGRESQL CLUSTER CONFIGURATION
              </span>
              <h2 className="font-display" style={{ fontSize: "2.2rem", marginTop: "4px" }}>
                SUPABASE DATABASE INTEGRATION
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(14, 13, 13, 0.75)", marginTop: "6px" }}>
                Your project is mapped to Supabase cluster <code>gqvmdrtlocvidjtiyycv</code>. Follow the instructions below to run the initial tables schema.
              </p>
            </div>

            {/* Connection Diagnostics */}
            <div style={{ backgroundColor: "var(--color-cream)", padding: "1.5rem", border: "1px solid var(--color-border)", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                CONNECTION DIAGNOSTICS
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.82rem" }}>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Project Reference:</span>
                  <div style={{ fontWeight: 600 }}>gqvmdrtlocvidjtiyycv</div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Endpoint:</span>
                  <div style={{ fontWeight: 600 }}>https://gqvmdrtlocvidjtiyycv.supabase.co</div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Client Status:</span>
                  <div style={{ color: isSupabaseConfigured ? "#166534" : "#A92424", fontWeight: 700 }}>
                    {isSupabaseConfigured ? "✓ Connected & Ready (.env.local active)" : "Needs Configuration"}
                  </div>
                </div>
                <div>
                  <span style={{ color: "rgba(14, 13, 13, 0.6)" }}>Direct Link:</span>
                  <div>
                    <a
                      href="https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--color-siren)", textDecoration: "underline", fontWeight: 600 }}
                    >
                      Open Supabase SQL Editor ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Sync Button */}
            <div style={{ marginBottom: "2.5rem" }}>
              <button
                type="button"
                onClick={handleSyncSupabaseSeed}
                disabled={syncingDb}
                className="azar-btn-black"
                style={{ height: "48px", fontSize: "0.75rem" }}
              >
                <RefreshCw size={14} className={syncingDb ? "animate-spin" : ""} />
                {syncingDb ? "SYNCING TO SUPABASE..." : "PUSH CATALOG & SETTINGS TO SUPABASE"}
              </button>

              {syncStatus && (
                <p style={{ marginTop: "10px", fontSize: "0.82rem", fontWeight: 600, color: syncStatus.includes("Success") ? "#166534" : "var(--color-siren)" }}>
                  {syncStatus}
                </p>
              )}
            </div>

            {/* SQL Script Box */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="maru-eyebrow" style={{ fontSize: "0.62rem" }}>
                  SQL SCHEMA DDL & RLS POLICIES (RUN ONCE IN SUPABASE SQL EDITOR)
                </span>
                <button
                  type="button"
                  onClick={copySqlCode}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--color-border)",
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {copiedSql ? (
                    <>
                      <Check size={12} color="#166534" /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> COPY SQL
                    </>
                  )}
                </button>
              </div>

              <pre
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "#E2E8F0",
                  padding: "1.2rem",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  maxHeight: "340px",
                  overflowY: "auto",
                  lineHeight: "1.5"
                }}
              >
{`-- Execute in your open Supabase tab (SQL Editor):
-- https://supabase.com/dashboard/project/gqvmdrtlocvidjtiyycv/sql

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  price_usd NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'vintage-saree',
  is_one_of_one BOOLEAN DEFAULT TRUE,
  is_bidding BOOLEAN DEFAULT FALSE,
  starting_bid_inr NUMERIC DEFAULT 0,
  current_bid_inr NUMERIC DEFAULT 0,
  min_bid_increment_inr NUMERIC DEFAULT 500,
  bids_count INT DEFAULT 0,
  edition TEXT DEFAULT '1 OF 1 VINTAGE SAREE GOWN',
  status TEXT DEFAULT 'available',
  material TEXT,
  origin TEXT,
  image_primary TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  amount_inr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public read on bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bids" ON public.bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write on site_settings" ON public.site_settings FOR ALL USING (true);`}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* EDIT PRODUCT MODAL                                            */}
        {/* ============================================================== */}
        {editingProduct && (
          <div className="overlay-backdrop" onClick={() => setEditingProduct(null)} style={{ zIndex: 140 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <h3 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>
                EDIT VINTAGE RELIC
              </h3>
              <p className="font-serif italic" style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
                Update pricing, live auction settings, or material provenance.
              </p>

              <form onSubmit={handleSaveEditProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    PIECE NAME
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      PRICE (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.priceINR}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceINR: Number(e.target.value) })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      STATUS
                    </label>
                    <select
                      value={editingProduct.status || "available"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                    >
                      <option value="available">Available for Acquisition</option>
                      <option value="reserved">Reserved by Patron</option>
                      <option value="sold">Sold / Claimed</option>
                    </select>
                  </div>
                </div>

                {/* Auction Toggle */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <input
                      type="checkbox"
                      checked={editingProduct.isBidding || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isBidding: e.target.checked })}
                    />
                    <span>ENABLE LIVE ATELIER AUCTION FOR THIS PIECE</span>
                  </label>

                  {editingProduct.isBidding && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Current Leading Bid (₹)</span>
                        <input
                          type="number"
                          value={editingProduct.currentBidINR || editingProduct.priceINR}
                          onChange={(e) => setEditingProduct({ ...editingProduct, currentBidINR: Number(e.target.value) })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Min Increment (₹500 min)</span>
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={editingProduct.minBidIncrementINR || 500}
                          onChange={(e) => setEditingProduct({ ...editingProduct, minBidIncrementINR: Number(e.target.value) })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    MATERIAL SPECIFICATION
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    ORIGIN & PROVENANCE
                  </label>
                  <input
                    type="text"
                    value={editingProduct.origin}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button type="submit" className="azar-btn-black" style={{ flex: 1, height: "44px", fontSize: "0.72rem" }}>
                    SAVE CHANGES
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    style={{ padding: "0 18px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.72rem" }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADD PRODUCT MODAL                                             */}
        {/* ============================================================== */}
        {isAddingNew && (
          <div className="overlay-backdrop" onClick={() => setIsAddingNew(false)} style={{ zIndex: 140 }}>
            <div
              className="product-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "var(--color-ivory)",
                padding: "2.2rem",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <h3 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>
                INTRODUCE NEW 1-OF-1 RELIC
              </h3>
              <p className="font-serif italic" style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.6)", marginBottom: "1.5rem" }}>
                Add a newly sourced vintage Indian saree or repurposed dupatta garment to Volume 001.
              </p>

              <form onSubmit={handleAddNewProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    PIECE NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. THE CHANDERI OPULENCE SLIP"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      PRICE (INR ₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={newProductForm.priceINR}
                      onChange={(e) => setNewProductForm({ ...newProductForm, priceINR: Number(e.target.value) })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      CATEGORY
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)", backgroundColor: "#FFF" }}
                    >
                      <option value="vintage-saree">Vintage Saree Gowns</option>
                      <option value="vintage-dupatta">Repurposed Dupatta Sets</option>
                      <option value="remnants">Zero-Waste Accents & Scarves</option>
                    </select>
                  </div>
                </div>

                {/* Auction Toggle */}
                <div style={{ padding: "12px", backgroundColor: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <input
                      type="checkbox"
                      checked={newProductForm.isBidding}
                      onChange={(e) => setNewProductForm({ ...newProductForm, isBidding: e.target.checked })}
                    />
                    <span>ENABLE LIVE ATELIER BIDDING FOR THIS PIECE</span>
                  </label>

                  {newProductForm.isBidding && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Starting Reserve (₹)</span>
                        <input
                          type="number"
                          value={newProductForm.startingBidINR}
                          onChange={(e) => setNewProductForm({ ...newProductForm, startingBidINR: Number(e.target.value), currentBidINR: Number(e.target.value) })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Min Increment (Min ₹500)</span>
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={newProductForm.minBidIncrementINR}
                          onChange={(e) => setNewProductForm({ ...newProductForm, minBidIncrementINR: Number(e.target.value) })}
                          style={{ width: "100%", padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--color-border)" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    MATERIAL SPECIFICATION
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.material}
                    onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    ORIGIN & PROVENANCE
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.origin}
                    onChange={(e) => setNewProductForm({ ...newProductForm, origin: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    IMAGE URL
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.imagePrimary}
                    onChange={(e) => setNewProductForm({ ...newProductForm, imagePrimary: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.85rem", border: "1px solid var(--color-border)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button type="submit" className="azar-btn-black" style={{ flex: 1, height: "44px", fontSize: "0.72rem" }}>
                    PUBLISH 1-OF-1 PIECE
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    style={{ padding: "0 18px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.72rem" }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
