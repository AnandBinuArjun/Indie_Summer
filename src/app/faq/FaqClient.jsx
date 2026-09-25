"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FaqClient({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            style={{
              backgroundColor: "var(--color-ivory)",
              border: "1px solid var(--color-border)",
              transition: "all 0.3s ease"
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              style={{
                width: "100%",
                padding: "1.4rem 1.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
                cursor: "pointer",
                background: "none",
                border: "none"
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: isOpen ? "var(--color-siren)" : "var(--color-ink)"
                }}
              >
                {faq.q}
              </span>
              <span style={{ marginLeft: "1rem" }}>
                {isOpen ? <Minus size={18} color="var(--color-siren)" /> : <Plus size={18} />}
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: "0 1.8rem 1.5rem",
                  fontSize: "0.95rem",
                  lineHeight: "1.75",
                  color: "rgba(14, 13, 13, 0.8)",
                  borderTop: "1px dashed var(--color-border)",
                  paddingTop: "1.2rem"
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
