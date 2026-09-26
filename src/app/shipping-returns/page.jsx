import Link from "next/link";
import { ArrowLeft, Truck, RefreshCw, Globe, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Shipping, Customs & Returns Policy | INDIE SUMMER",
  description: "Complimentary BlueDart Air shipping across India, worldwide DHL delivery protocols, and 1-of-1 archival return policies."
};

export default function ShippingReturnsPage() {
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
            <Truck size={13} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>DISPATCH & RETURN COVENANT</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: "1.05" }}>
            SHIPPING & RETURNS<span style={{ color: "var(--color-siren)" }}>.</span>
          </h1>
          <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "0.8rem" }}>
            Complimentary express air transit across India, insured global dispatch, and archival exchange guidelines.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(14, 13, 13, 0.85)" }}>
          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              1. DOMESTIC SHIPPING (INDIA)
            </h2>
            <p>
              We dispatch in deliberate, intentional batches from our Goa Atelier and Mumbai distribution suite.
            </p>
            <div style={{ backgroundColor: "var(--color-cream)", padding: "1.5rem", border: "1px solid var(--color-border)", margin: "1rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <CheckCircle2 size={16} color="var(--color-siren)" />
                <strong style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.82rem", letterSpacing: "0.1em" }}>
                  COMPLIMENTARY BLUEDART EXPRESS AIR
                </strong>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(14, 13, 13, 0.75)" }}>
                Complimentary express air shipping is automatically applied to all acquisitions over ₹5,000 across India.
              </p>
            </div>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>Transit Times:</strong> Mumbai, Delhi NCR, Bengaluru, Hyderabad, and Goa: 2 to 3 business days. All other serviceable pincodes: 3 to 5 business days.</li>
              <li><strong>SMS & Email Tracking:</strong> Live BlueDart Air AWB tracking numbers are dispatched instantly upon handover to the courier.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              2. INTERNATIONAL SHIPPING & CUSTOMS
            </h2>
            <p>
              We proudly ship our one-of-one vintage saree relics to private collectors across the United States, United Kingdom, European Union, United Arab Emirates, Singapore, and Australia via DHL International Express.
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.8rem" }}>
              <li><strong>International Transit Time:</strong> 4 to 7 business days from atelier dispatch, fully insured.</li>
              <li><strong>Complimentary Global Threshold:</strong> Complimentary international shipping applies to acquisitions exceeding USD $250 / EUR €230 / GBP £200 / AED 1,000.</li>
              <li><strong>Customs & Import Levies:</strong> Shipments are cleared according to destination country regulations. Any customs duties, import VAT, or local brokerage charges assessed by local border authorities remain the patron&apos;s responsibility.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              3. ARCHIVAL PACKAGING & PROVENANCE
            </h2>
            <p>
              Every acquired piece is steamed with organic botanicals, wrapped in unbleached acid-free archival cotton, and encased in our signature keepsake Indie Summer presentation box. An individually signed Provenance Certificate detailing the saree discovery region and century provenance accompanies every relic.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              4. 1-OF-1 RETURN & EXCHANGE PROTOCOL
            </h2>
            <p>
              Because each Indie Summer piece is a one-of-a-kind vintage silhouette with no secondary duplicate in existence, traditional industrial mass-market returns cannot be accommodated.
            </p>
            <div style={{ backgroundColor: "#FFF", border: "1px solid var(--color-border)", padding: "1.5rem", margin: "1rem 0" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                OUR 48-HOUR PATRON SATISFACTION GUARANTEE
              </h3>
              <p style={{ fontSize: "0.86rem", color: "rgba(14, 13, 13, 0.8)", lineHeight: "1.7" }}>
                If your acquired piece does not fit your silhouette, or if you believe the physical relic differs from its digital catalog representation:
              </p>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "8px", fontSize: "0.84rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Notify our concierge team via WhatsApp or email within <strong>48 hours of documented courier delivery</strong>.</li>
                <li>You may exchange the piece for <strong>100% Atelier Store Credit</strong> valid for any future volume drop or live auction piece.</li>
                <li>The garment must remain unworn, unwashed, and intact with its original archival security ribbon attached.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              5. INITIATE AN ATELIER INQUIRY
            </h2>
            <p>
              To check shipping coordinates, request white-glove courier redirection, or request bespoke alteration advice:
            </p>
            <p style={{ marginTop: "0.6rem" }}>
              Direct message WhatsApp Concierge: <strong>+91 98200 45892</strong> or email <a href="mailto:atelier@indiesummer.in" style={{ color: "var(--color-siren)", textDecoration: "underline" }}>atelier@indiesummer.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
