"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Search, Menu, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const {
    cartTotalItems,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    currency,
    setCurrency
  } = useStore();

  const navLinks = [
    { to: "/shop", label: "SHOP" },
    { to: "/about", label: "PHILOSOPHY" },
    { to: "/lookbook", label: "LOOKBOOK" },
    { to: "/journal", label: "JOURNAL" },
    { to: "/faq", label: "FAQ" }
  ];

  return (
    <>
      <header className="light-header">
        <div className="site-container">
          <div className="light-header-inner">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="icon-btn mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              style={{ display: "none", color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer" }}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Navigation */}
            <nav className="desktop-links" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  style={{
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "1.15rem",
                    color: pathname === link.to ? "var(--color-siren)" : "var(--color-ink)",
                    transition: "color 0.2s ease"
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Centered Brand Logo */}
            <Link
              href="/"
              style={{
                justifySelf: "center",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 0"
              }}
              aria-label="INDIE SUMMER Home"
            >
              <img
                src="/images/logo.png"
                alt="INDIE SUMMER — One Design. One Piece. Never Again."
                style={{
                  height: "54px",
                  maxHeight: "54px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </Link>

            {/* Right Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
              {/* Currency Selector (INR Primary) */}
              <div style={{ position: "relative" }}>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    appearance: "none",
                    background: "transparent",
                    border: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    padding: "4px 6px",
                    color: "var(--color-ink)",
                    outline: "none"
                  }}
                  aria-label="Currency"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                style={{ padding: "6px", color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer" }}
                aria-label="Search"
                title="Search (Cmd+K)"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                style={{ padding: "6px", position: "relative", color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer" }}
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-siren)",
                      color: "#FFF",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Bag / Cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                style={{ padding: "6px", position: "relative", color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer" }}
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={20} />
                {cartTotalItems > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-siren)",
                      color: "#FFF",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {cartTotalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="overlay-backdrop" onClick={() => setMobileMenuOpen(false)} style={{ zIndex: 120 }}>
          <div
            className="drawer-right"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "340px", backgroundColor: "var(--color-ivory)" }}
          >
            <div style={{ padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src="/images/logo.png"
                  alt="INDIE SUMMER"
                  style={{ height: "42px", width: "auto", objectFit: "contain" }}
                />
              </Link>
              <button type="button" onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  textAlign: "left",
                  color: isHome ? "var(--color-siren)" : "var(--color-ink)"
                }}
              >
                HOME
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    textAlign: "left",
                    color: pathname === link.to ? "var(--color-siren)" : "var(--color-ink)"
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
