"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function MarqueeBar() {
  const { siteSettings } = useStore();
  const text = siteSettings?.marqueeTicker || "ONE DESIGN. ONE PIECE. NEVER AGAIN. · COMPLIMENTARY BLUEDART AIR SHIPPING ACROSS INDIA · SLOW BATCHES · DISCOVERED VINTAGE SILKS · ZERO WASTE ATELIER";

  return (
    <div className="top-marquee">
      <div className="marquee-track">
        <span>{text}</span>
        <span>•</span>
        <span>ONE DESIGN. ONE PIECE. NEVER AGAIN.</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>ONE DESIGN. ONE PIECE. NEVER AGAIN.</span>
      </div>
    </div>
  );
}
