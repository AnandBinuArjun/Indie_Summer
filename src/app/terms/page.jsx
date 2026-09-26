import Link from "next/link";
import { ArrowLeft, Scale, Gavel, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service & Atelier Acquisition Rules | INDIE SUMMER",
  description: "Terms and conditions governing one-of-one vintage saree garment acquisitions, live auctions, and studio policies at Indie Summer."
};

export default function TermsOfServicePage() {
  return (
    <div style={{ backgroundColor: "var(--color-ivory)", minHeight: "100vh", color: "var(--color-ink)", paddingTop: "7rem", paddingBottom: "8rem" }}>
      <div className="site-container" style={{ maxWidth: "860px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.72rem",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(14, 13, 13, 0.6)",
            textDecoration: "none",
            marginBottom: "2rem"
          }}
        >
          <ArrowLeft size={14} /> RETURN TO ATELIER
        </Link>

        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "2rem", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--color-cream)", padding: "4px 12px", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
            <Scale size={13} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>ATELIER COVENANT & TERMS</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: "1.05" }}>
            TERMS OF ACQUISITION<span style={{ color: "var(--color-siren)" }}>.</span>
          </h1>
          <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "0.8rem" }}>
            Governing one-of-one archival garment acquisitions, bidding protocols, and atelier care.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(14, 13, 13, 0.85)" }}>
          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              1. NATURE OF 1-OF-1 VINTAGE GARMENTS
            </h2>
            <p>
              Every garment created by Indie Summer is repurposed from hand-sourced vintage Indian textiles—primarily archival Banarasi silks, vintage Kanjeevarams, hand-embroidered dupattas, and heritage weaves. By acquiring an Indie Summer piece, the patron acknowledges and celebrates:
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.8rem" }}>
              <li><strong>Singularity:</strong> Each design code exists as a singular 1-of-1 piece. Once sold, that specific textile and silhouette combination will never be recreated.</li>
              <li><strong>Vintage Patina & Character:</strong> Authentic vintage handloom textiles often carry gentle idiosyncrasies in zari weave tension, organic dye variations, or hand-spun slubs. These are intentional marks of provenance rather than factory defects.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              2. DIRECT BUY CHECKOUT & RESERVATION
            </h2>
            <p>
              Pieces designated for direct buy are reserved on a first-confirmed basis. An acquisition is considered legally binding once an official Order Identifier (`IS-IND-XXXXXX`) is generated and payment authorization is recorded. Because items are singular relics, multiple simultaneous attempts to acquire the same piece will be resolved in favor of the earliest timestamped authorization.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              3. LIVE ATELIER AUCTIONS & BIDDING RULES
            </h2>
            <p>
              For archival pieces offered under the live bidding format:
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.8rem" }}>
              <li><strong>Minimum Bid Increments:</strong> All bids must exceed the active leading bid by at least ₹500 (or equivalent international currency).</li>
              <li><strong>Binding Commitment:</strong> Placing an auction bid constitutes a binding commitment to acquire the piece at the tendered valuation should you remain the highest bidder upon countdown expiration.</li>
              <li><strong>Winner Settlement:</strong> The winning bidder receives a private acquisition settlement link valid for 48 hours. If unclaimed, the piece will be offered to the secondary backup bidder.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              4. PRICING, CURRENCIES & TAXES
            </h2>
            <p>
              Listed prices in INR (₹) include all applicable domestic taxes (including Handcrafted Textile GST). International prices in USD, EUR, GBP, or AED are calculated based on transparent exchange rates. Import duties or customs clearances levied by destination authorities remain the responsibility of the importing patron.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              5. INTELLECTUAL PROPERTY & ARCHIVE
            </h2>
            <p>
              All silhouette patterns, brand photography, editorial journal publications, and provenance storytelling are the intellectual property of Indie Summer Atelier. Commercial reproduction without prior written consent is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              6. CONTACT & GOVERNING JURISDICTION
            </h2>
            <p>
              These terms are governed by the laws of India, with jurisdiction in Mumbai, Maharashtra. For legal notices or concierge queries, please reach out to <a href="mailto:atelier@indiesummer.in" style={{ color: "var(--color-siren)", textDecoration: "underline" }}>atelier@indiesummer.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
