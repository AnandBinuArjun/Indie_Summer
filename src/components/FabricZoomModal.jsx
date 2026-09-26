"use client";

import React, { useState, useRef } from "react";
import { X, ZoomIn, Sparkles } from "lucide-react";

export default function FabricZoomModal({ isOpen, onClose, imageSrc, productName, material }) {
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  if (!isOpen || !imageSrc) return null;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  return (
    <div
      className="overlay-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(14, 13, 13, 0.92)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 150,
        padding: "1rem"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0E0D0D",
          border: "1px solid rgba(251, 251, 247, 0.2)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.8rem",
            borderBottom: "1px solid rgba(251, 251, 247, 0.15)",
            color: "#FFF"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={14} color="var(--color-siren)" />
              <span className="maru-eyebrow" style={{ color: "var(--color-siren)", fontSize: "0.62rem" }}>
                ARCHIVAL TEXTILE INSPECTOR · HIGH RESOLUTION
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 600, marginTop: "2px" }}>
              {productName}
              {material && <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, fontSize: "0.85rem" }}> — {material}</span>}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.6)", display: "flex", alignItems: "center", gap: "4px" }}>
              <ZoomIn size={14} /> Hover cursor over fabric to magnify weave
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "crosshair",
            backgroundColor: "#050505"
          }}
        >
          <img
            src={imageSrc}
            alt={productName}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: isHovered ? "scale(2.4)" : "scale(1)",
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transition: isHovered ? "none" : "transform 0.3s ease",
              pointerEvents: "none",
              userSelect: "none"
            }}
          />

          {!isHovered && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(4px)",
                color: "#FFF",
                padding: "8px 16px",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <ZoomIn size={15} color="var(--color-siren)" /> Move cursor across the image to explore 2.4x handloom details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
