/**
 * INDIE SUMMER ATELIER — TRANSACTIONAL NOTIFICATION ENGINE
 * Handles automated transactional emails, Certificates of Provenance,
 * and SMS/WhatsApp dispatch updates.
 */

/**
 * Format Indian Rupee Currency
 */
function formatINR(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

/**
 * Generate Luxury Certificate of Provenance & Order Confirmation HTML Email
 */
export function generateOrderConfirmationEmailHtml(order) {
  const {
    order_ref,
    customer_name,
    customer_address,
    customer_city,
    customer_pincode,
    payment_method,
    payment_id,
    total_amount_inr,
    items = [],
    created_at
  } = order;

  const dateStr = new Date(created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const netValue = Math.round(Number(total_amount_inr || 0) / 1.05);
  const gst = Number(total_amount_inr || 0) - netValue;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #E5E1D8;">
          <div style="font-family: 'Times New Roman', serif; font-size: 17px; font-weight: 700; color: #0E0D0D; letter-spacing: 0.05em; text-transform: uppercase;">
            ${item.name || "Archival Relic"}
          </div>
          <div style="font-family: Arial, sans-serif; font-size: 11px; color: #8A2424; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 3px;">
            ${item.code || "1 OF 1 ARCHIVE"} · SIZE: ${item.selectedSize || "One Size"}
          </div>
          <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666; margin-top: 4px;">
            ${item.material || "Discovered Vintage Indian Textile · Repurposed in Goa Atelier"}
          </div>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #E5E1D8; text-align: right; vertical-align: top; font-family: Arial, sans-serif; font-size: 15px; font-weight: 700; color: #0E0D0D;">
          ${formatINR(item.priceINR)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Acquisition Confirmation & Provenance · Indie Summer</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F3ED; font-family: Arial, sans-serif; color: #0E0D0D;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5F3ED; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #FBFBF7; border: 1px solid #D8C7A5; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0E0D0D; padding: 28px 30px; text-align: center; border-bottom: 3px solid #8A2424;">
              <div style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.28em; color: #D8C7A5; text-transform: uppercase; margin-bottom: 8px;">
                HAUTE VINTAGE ATELIER · GOA, INDIA
              </div>
              <div style="font-family: 'Times New Roman', serif; font-size: 26px; letter-spacing: 0.12em; color: #FBFBF7; font-weight: 700; text-transform: uppercase;">
                INDIE SUMMER
              </div>
              <div style="font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.2em; color: rgba(251,251,247,0.7); text-transform: uppercase; margin-top: 6px;">
                ONE DESIGN. ONE PIECE. NEVER AGAIN.
              </div>
            </td>
          </tr>

          <!-- Provenance Hologram Badge -->
          <tr>
            <td style="padding: 30px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; border: 1px solid #8A2424; padding: 6px 16px; background-color: rgba(138,36,36,0.04);">
                <span style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; color: #8A2424; font-weight: 700; text-transform: uppercase;">
                  ✓ OFFICIAL CERTIFICATE OF PROVENANCE RESERVED
                </span>
              </div>
              <h1 style="font-family: 'Times New Roman', serif; font-size: 24px; font-weight: 400; margin: 20px 0 6px 0; color: #0E0D0D;">
                Thank you for your acquisition, ${customer_name}.
              </h1>
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #555; line-height: 1.6; margin: 0 auto; max-width: 480px;">
                Your singular piece has entered our Goa atelier registry under ledger reference <strong>${order_ref}</strong>. The textile will be hand-steamed with natural botanicals and sealed with its embossed Certificate of Provenance before express dispatch.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 20px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E5E1D8; padding: 20px;">
                <tr>
                  <td style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; padding-bottom: 12px; border-bottom: 1px solid #E5E1D8;">
                    ACQUIRED ARCHIVAL RELICS
                  </td>
                  <td style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; text-align: right; padding-bottom: 12px; border-bottom: 1px solid #E5E1D8;">
                    AMOUNT
                  </td>
                </tr>
                ${itemsHtml}
                <tr>
                  <td style="padding-top: 16px; font-family: Arial, sans-serif; font-size: 12px; color: #555;">
                    Atelier Silhouette Value (Excl. Tax)
                  </td>
                  <td style="padding-top: 16px; font-family: Arial, sans-serif; font-size: 12px; color: #555; text-align: right;">
                    ${formatINR(netValue)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px; font-family: Arial, sans-serif; font-size: 12px; color: #555;">
                    Indian Handloom GST (5%)
                  </td>
                  <td style="padding-top: 6px; font-family: Arial, sans-serif; font-size: 12px; color: #555; text-align: right;">
                    ${formatINR(gst)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px; font-family: Arial, sans-serif; font-size: 12px; color: #555;">
                    Complimentary BlueDart Air Courier (Pan-India)
                  </td>
                  <td style="padding-top: 6px; font-family: Arial, sans-serif; font-size: 12px; color: #1B7A3E; text-align: right; font-weight: 700;">
                    COMPLIMENTARY
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px; border-top: 1px solid #0E0D0D; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #0E0D0D; text-transform: uppercase;">
                    Total Acquisition
                  </td>
                  <td style="padding-top: 16px; border-top: 1px solid #0E0D0D; font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0E0D0D; text-align: right;">
                    ${formatINR(total_amount_inr)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dispatch & Verification Details -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 10px;">
                    <div style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A2424; font-weight: 700; margin-bottom: 6px;">
                      DESTINATION COORDINATES
                    </div>
                    <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333;">
                      <strong>${customer_name}</strong><br>
                      ${customer_address || "Handover upon dispatch"}<br>
                      ${customer_city ? `${customer_city} - ${customer_pincode}` : ""}<br>
                      India
                    </div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 10px;">
                    <div style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A2424; font-weight: 700; margin-bottom: 6px;">
                      SETTLEMENT DETAILS
                    </div>
                    <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333;">
                      Method: <strong>${payment_method || "Razorpay Gateway"}</strong><br>
                      Txn Ref: <code style="background-color: #EEE; padding: 2px 4px; font-size: 11px;">${payment_id || "VERIFIED"}</code><br>
                      Date: ${dateStr}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Live Tracking CTA -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; text-align: center;">
              <a href="https://indiesummer.in/track" style="display: inline-block; background-color: #0E0D0D; color: #FBFBF7; text-decoration: none; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid #0E0D0D;">
                TRACK YOUR DISPATCH IN REAL-TIME →
              </a>
              <div style="margin-top: 12px; font-family: Arial, sans-serif; font-size: 11px; color: #777;">
                Order Reference: <strong>${order_ref}</strong>
              </div>
            </td>
          </tr>

          <!-- Studio Footer -->
          <tr>
            <td style="background-color: #F1ECE1; padding: 24px 30px; text-align: center; border-top: 1px solid #D8C7A5;">
              <div style="font-family: Arial, sans-serif; font-size: 11px; color: #555; line-height: 1.6;">
                <strong>INDIE SUMMER ATELIER</strong> · Assagao, Goa 403507<br>
                Direct Concierge: <a href="mailto:concierge@indiesummer.in" style="color: #0E0D0D; text-decoration: underline;">concierge@indiesummer.in</a> · WhatsApp: +91 98200 45892
              </div>
              <div style="margin-top: 10px; font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.15em; color: #888; text-transform: uppercase;">
                Slow batches · Discovered vintage textiles · Zero waste atelier
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate Dispatch Notification HTML Email
 */
export function generateDispatchEmailHtml(order, awbNumber = "BD-AIR-89410294") {
  const { order_ref, customer_name, customer_city, total_amount_inr, items = [] } = order;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Relic Has Dispatched · Indie Summer Atelier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F3ED; font-family: Arial, sans-serif; color: #0E0D0D;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5F3ED; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FBFBF7; border: 1px solid #D8C7A5;">
          
          <tr>
            <td style="background-color: #0E0D0D; padding: 24px 30px; text-align: center; border-bottom: 3px solid #8A2424;">
              <div style="font-family: 'Times New Roman', serif; font-size: 22px; letter-spacing: 0.15em; color: #FBFBF7; font-weight: 700; text-transform: uppercase;">
                INDIE SUMMER
              </div>
              <div style="font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.22em; color: #D8C7A5; text-transform: uppercase; margin-top: 4px;">
                ATELIER DISPATCH NOTIFICATION
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <div style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; color: #8A2424; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">
                EN ROUTE VIA BLUEDART AIR EXPRESS
              </div>
              <h2 style="font-family: 'Times New Roman', serif; font-size: 24px; font-weight: 400; margin: 0 0 16px 0;">
                Dear ${customer_name}, your 1-of-1 piece is on its way.
              </h2>
              <p style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #444; margin-bottom: 20px;">
                Your archival order <strong>${order_ref}</strong> has been botanical-steamed, sealed in our canvas preservation garment bag with its signed Certificate of Provenance, and handed to BlueDart Air Express.
              </p>

              <div style="background-color: #F5F3ED; border: 1px solid #E5E1D8; padding: 18px; margin-bottom: 24px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #777;">AIR WAYBILL (AWB)</div>
                      <div style="font-size: 15px; font-weight: 700; color: #0E0D0D; margin-top: 3px;">${awbNumber}</div>
                    </td>
                    <td style="text-align: right;">
                      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #777;">ESTIMATED ARRIVAL</div>
                      <div style="font-size: 15px; font-weight: 700; color: #1B7A3E; margin-top: 3px;">2 - 3 Business Days</div>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center;">
                <a href="https://indiesummer.in/track" style="display: inline-block; background-color: #0E0D0D; color: #FBFBF7; text-decoration: none; padding: 13px 26px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">
                  TRACK AIR TRANSIT LIVE →
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #F1ECE1; padding: 16px 30px; text-align: center; border-top: 1px solid #D8C7A5; font-size: 11px; color: #666;">
              Questions? Concierge desk: <a href="mailto:concierge@indiesummer.in" style="color: #0E0D0D;">concierge@indiesummer.in</a> · +91 98200 45892
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate Outbid Alert HTML Email
 */
export function generateOutbidAlertEmailHtml({ relicName, relicCode, currentBidINR, productId, timeRemaining }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You Have Been Outbid · Indie Summer Atelier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F3ED; font-family: Arial, sans-serif; color: #0E0D0D;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5F3ED; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FBFBF7; border: 1px solid #D8C7A5;">
          
          <tr>
            <td style="background-color: #8A2424; padding: 20px 30px; text-align: center;">
              <div style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.25em; color: #FBFBF7; text-transform: uppercase;">
                ATELIER AUCTION ALERT
              </div>
              <div style="font-family: 'Times New Roman', serif; font-size: 22px; color: #FFF; font-weight: 700; margin-top: 4px;">
                YOU HAVE BEEN OUTBID
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 14px; line-height: 1.6; color: #333; margin-top: 0;">
                Another patron has just entered a higher bid on <strong>${relicName}</strong> (${relicCode}).
              </p>

              <div style="background-color: #FFFFFF; border: 1px solid #E5E1D8; padding: 20px; margin: 20px 0; text-align: center;">
                <div style="font-size: 11px; letter-spacing: 0.15em; color: #888; text-transform: uppercase;">NEW LEADING OFFER</div>
                <div style="font-size: 26px; font-weight: 700; color: #0E0D0D; margin: 6px 0;">${formatINR(currentBidINR)}</div>
                <div style="font-size: 11px; color: #8A2424; font-weight: 600; text-transform: uppercase;">
                  ${timeRemaining ? `Time Remaining: ${timeRemaining}` : "Auction Concluding Soon"}
                </div>
              </div>

              <p style="font-size: 13px; color: #666; line-height: 1.5;">
                Remember: Once this 1-of-1 archival piece is sold, the exact vintage textile will never be produced again.
              </p>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://indiesummer.in/product/${productId}#bidding" style="display: inline-block; background-color: #8A2424; color: #FFF; text-decoration: none; padding: 14px 28px; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">
                  RAISE YOUR BID NOW →
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #F1ECE1; padding: 14px 30px; text-align: center; font-size: 10px; color: #777;">
              INDIE SUMMER ATELIER · ONE DESIGN. ONE PIECE. NEVER AGAIN.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Universal Dispatcher: Dispatches email via Resend if key is available, or logs preview in simulator
 */
export async function sendEmail({ to, subject, html }) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Indie Summer Atelier <concierge@indiesummer.in>",
          to: [to],
          subject: subject,
          html: html
        })
      });

      const data = await res.json();
      return { success: res.ok, provider: "resend", data };
    } catch (err) {
      console.error("[Transactional Email Error]:", err);
      return { success: false, error: err.message };
    }
  }

  // Safe Fallback & Development Simulator
  console.log(`[ATELIER TRANSACTIONAL EMAIL SIMULATOR] To: ${to} | Subject: ${subject}`);
  return {
    success: true,
    provider: "simulator",
    message: "Email generated and staged in atelier notification queue (Configure RESEND_API_KEY for live delivery)."
  };
}

/**
 * Universal Dispatcher: Dispatches SMS or WhatsApp via Twilio if configured, or logs preview
 */
export async function sendSMS({ to, message }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromNumber) {
    try {
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber,
          Body: message
        }).toString()
      });

      const data = await res.json();
      return { success: res.ok, provider: "twilio", data };
    } catch (err) {
      console.error("[SMS Gateway Error]:", err);
      return { success: false, error: err.message };
    }
  }

  // Simulator Fallback
  console.log(`[ATELIER SMS/WHATSAPP SIMULATOR] To: ${to} | Body: ${message}`);
  return {
    success: true,
    provider: "simulator",
    message: "SMS staged in atelier SMS queue (Configure TWILIO_* keys for live delivery)."
  };
}
