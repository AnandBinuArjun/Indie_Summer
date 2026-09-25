import React, { useState } from "react";
import { FAQS } from "../data/products";
import { Plus, Minus } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{ padding: "6rem 0", backgroundColor: "var(--color-cream)", borderTop: "1px solid var(--color-border)" }}>
      <div className="site-container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
              FREQUENT INQUIRIES
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                letterSpacing: "-0.01em",
                lineHeight: 0.95
              }}
            >
              CLIENT CARE & FAQ<span className="text-siren">.</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FAQS.map((faq, index) => {
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
                      cursor: "pointer"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-grotesk)",
                        fontSize: "0.88rem",
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
                        fontSize: "0.92rem",
                        lineHeight: "1.7",
                        color: "var(--color-ink-soft)",
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
        </div>
      </div>
    </section>
  );
}
