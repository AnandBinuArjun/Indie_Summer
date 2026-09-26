"use client";

import React, { useEffect } from "react";
import { logger } from "../lib/logger";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    logger.error("Root layout fatal crash intercepted", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0E0D0D", color: "#FBFBF7", fontFamily: "sans-serif", margin: 0, padding: "3rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: "500px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", padding: "2.5rem" }}>
          <h1 style={{ fontSize: "1.8rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>INDIE SUMMER ATELIER</h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>
            A critical system exception was intercepted. Concierge error logging has recorded the event.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ backgroundColor: "#FBFBF7", color: "#0E0D0D", border: "none", padding: "12px 24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            RESTORE ATELIER
          </button>
        </div>
      </body>
    </html>
  );
}
