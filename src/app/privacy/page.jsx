import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Patron Data Protection | INDIE SUMMER",
  description: "Privacy policy and client data protection guidelines for Indie Summer archival vintage garments and auctions."
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={13} color="var(--color-siren)" />
            <span className="maru-eyebrow" style={{ fontSize: "0.58rem" }}>DATA DISCRETION & PRIVACY</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: "1.05" }}>
            PRIVACY & PATRON CONFIDENTIALITY<span style={{ color: "var(--color-siren)" }}>.</span>
          </h1>
          <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "rgba(14, 13, 13, 0.7)", marginTop: "0.8rem" }}>
            Effective as of January 1, 2026 · Indie Summer Atelier, Goa & Mumbai.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(14, 13, 13, 0.85)" }}>
          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              1. PHILOSOPHY OF DISCRETION
            </h2>
            <p>
              Indie Summer (&ldquo;the Atelier&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates as a slow fashion house dedicated to one-of-one vintage saree relics. Because each silhouette represents a singular textile discovery, we consider client relationship records, acquisition provenance, and delivery coordinates strictly confidential. We never monetize, rent, or trade patron records with third-party data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              2. INFORMATION WE COLLECT
            </h2>
            <p style={{ marginBottom: "0.8rem" }}>
              To facilitate bespoke acquisitions, live auction bid verification, and express air courier dispatch across India and worldwide, we collect:
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>Contact Coordinates:</strong> Legal name, dispatch address, postal/ZIP code, contact phone number, and email address.</li>
              <li><strong>Acquisition Records:</strong> Piece identification codes, volume numbers, one-of-one edition numbers, and transaction reference identifiers.</li>
              <li><strong>Auction Bidding Verification:</strong> Bidder handle/name, contact details, and bid increment timestamps to prevent synthetic auction manipulation.</li>
              <li><strong>Technical Diagnostics:</strong> Anonymized browser identifiers, country/currency preference, and cart session tokens necessary for checkout state persistence.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              3. HOW WE USE PATRON INFORMATION
            </h2>
            <p>
              Your personal information is used exclusively to:
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.8rem" }}>
              <li>Generate official Provenance Certificates and Tax Invoices corresponding to your acquired vintage relic.</li>
              <li>Coordinate express courier transit via BlueDart Air (domestic) or DHL International Express (global).</li>
              <li>Deliver automated SMS and email dispatch updates and live outbid notices for active auctions.</li>
              <li>Provide bespoke atelier concierge support regarding garment care, archival storage, and alterations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              4. PAYMENT SECURITY & ENCRYPTION
            </h2>
            <p>
              All online checkout transactions are processed through encrypted 256-bit SSL tunnels directly to bank and payment gateway APIs. Indie Summer does not store or process complete credit card numbers, CVVs, or bank login credentials on our internal database servers.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "var(--color-ink)" }}>
              5. YOUR PRIVACY RIGHTS
            </h2>
            <p>
              Under applicable Indian and international data protection laws (including the Digital Personal Data Protection Act and GDPR where applicable), you have the right to inspect, correct, or request the irreversible redaction of your customer profile and mailing preferences at any time.
            </p>
            <p style={{ marginTop: "0.8rem" }}>
              To exercise these privileges, direct your written request to our concierge at <a href="mailto:atelier@indiesummer.in" style={{ color: "var(--color-siren)", textDecoration: "underline" }}>atelier@indiesummer.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
