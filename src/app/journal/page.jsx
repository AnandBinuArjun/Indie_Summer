import React from "react";
import Link from "next/link";
import { EDITORIAL_STORIES } from "../../data/products";
import { Camera, Film, Compass, ArrowRight } from "lucide-react";

export const metadata = {
  title: "The Summer Journal — 35mm Dispatches | INDIE SUMMER",
  description: "Dispatches from the coast of Goa, the loom clusters of Varanasi, and field notes exploring Indian textile restoration and slow intentional craft."
};

export default function JournalPage() {
  return (
    <main
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-cream)",
        color: "var(--color-ink)",
        minHeight: "85vh"
      }}
    >
      <div className="site-container">
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 4rem" }}>
          <span className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "0.8rem" }}>
            SUMMER DISPATCHES · 35MM JOURNAL
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 0.9
            }}
          >
            THE SUMMER JOURNAL<span className="text-siren">.</span>
          </h1>
          <p
            className="font-serif italic"
            style={{
              fontSize: "1.25rem",
              color: "rgba(14, 13, 13, 0.7)",
              marginTop: "1.2rem"
            }}
          >
            Stories of discovered vintage sarees, the coastal heat of Goa, and 35mm captures.
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
                    fontFamily: "var(--font-sans)",
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
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-siren)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "0.8rem"
                  }}
                >
                  <Compass size={14} /> {story.location}
                </div>

                <h2
                  className="font-display text-ink"
                  style={{
                    fontSize: "1.9rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1.05,
                    marginBottom: "1rem"
                  }}
                >
                  {story.title}
                </h2>

                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.7",
                    color: "rgba(14, 13, 13, 0.75)",
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
                    color: "rgba(14, 13, 13, 0.6)",
                    fontFamily: "var(--font-sans)"
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

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <Link href="/shop" className="azar-btn-black">
            EXPLORE THE VINTAGE SILK COLLECTION <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
