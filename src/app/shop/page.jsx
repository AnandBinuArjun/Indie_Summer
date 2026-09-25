import { PRODUCTS } from "../../data/products";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Volume 001 Collection — 1-of-1 Vintage Saree Pieces | INDIE SUMMER",
  description: "Explore Volume 001. We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once it's gone, it never exists again."
};

export default function ShopPage() {
  return (
    <main style={{ paddingTop: "7rem", paddingBottom: "7rem", backgroundColor: "var(--color-ivory)", color: "var(--color-ink)", minHeight: "85vh" }}>
      <section className="site-container">
        {/* Collection Header matching Azar */}
        <p className="maru-eyebrow" style={{ color: "var(--color-siren)", marginBottom: "1.2rem" }}>
          ONE DESIGN · ONE PIECE · NEVER AGAIN
        </p>

        <h1
          className="font-display text-ink"
          style={{
            fontSize: "clamp(4.2rem, 11vw, 9.2rem)",
            lineHeight: 0.85,
            textTransform: "uppercase",
            letterSpacing: "-0.01em"
          }}
        >
          VOL. 001<span className="text-siren">.</span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            lineHeight: 1.6,
            color: "rgba(14, 13, 13, 0.8)",
            marginTop: "1.8rem",
            maxWidth: "680px",
            whiteSpace: "pre-line"
          }}
        >
          We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once it’s gone, that exact piece will never exist again.
        </p>

        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "rgba(14, 13, 13, 0.55)",
            marginTop: "0.8rem"
          }}
        >
          Slow Batches · Singular Pieces · Zero Waste · A Second Life for Beautiful Things
        </p>

        {/* Client Interactive Filter & Grid */}
        <ShopClient initialProducts={PRODUCTS} />
      </section>
    </main>
  );
}
