import React from "react";
import { EDITORIAL_STORIES } from "../data/products";
import { Camera, Film, Compass } from "lucide-react";

export default function EditorialJournal({ onShopLook }) {
  return (
    <section id="editorial" style={{ padding: "6rem 0", backgroundColor: "var(--color-cream)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="site-container">
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 4rem" }}>
          <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
            SUMMER DISPATCHES · JOURNAL
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6.5vw, 6rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 0.9
            }}
          >
            THE SUMMER EDIT<span className="text-siren">.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: "var(--color-ink-muted)",
              marginTop: "1rem"
            }}
          >
            Stories, salt air, and 35mm captures from the Balearic islands.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3.5rem" }}>
          {EDITORIAL_STORIES.map((story, idx) => (
            <article
              key={idx}
              style={{
                backgroundColor: "var(--color-ivory)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                <img
                  src={story.image}
                  alt={story.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    backgroundColor: "rgba(14, 13, 13, 0.8)",
                    color: "var(--color-ivory)",
                    padding: "4px 10px",
                    fontFamily: "var(--font-grotesk)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase"
                  }}
                >
                  {story.volume}
                </div>
              </div>

              <div style={{ padding: "2.2rem 2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-grotesk)",
                    color: "var(--color-siren)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "0.8rem"
                  }}
                >
                  <Compass size={14} /> {story.location}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1.05,
                    marginBottom: "1rem"
                  }}
                >
                  {story.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.65",
                    color: "var(--color-ink-soft)",
                    marginBottom: "1.8rem"
                  }}
                >
                  {story.excerpt}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "1.2rem",
                    borderTop: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.72rem",
                    color: "var(--color-ink-muted)",
                    fontFamily: "var(--font-grotesk)"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Camera size={13} /> {story.photographer}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Film size={13} /> {story.filmType}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
