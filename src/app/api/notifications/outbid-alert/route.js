import { NextResponse } from "next/server";
import {
  generateOutbidAlertEmailHtml,
  sendEmail,
  sendSMS
} from "../../../../lib/notifications";

export async function POST(request) {
  try {
    const {
      bidderEmail,
      bidderPhone,
      bidderName,
      relicName,
      relicCode,
      currentBidINR,
      productId,
      timeRemaining
    } = await request.json();

    if (!bidderEmail && !bidderPhone) {
      return NextResponse.json(
        { success: false, error: "No bidder contact coordinates provided." },
        { status: 400 }
      );
    }

    let emailResult = null;
    if (bidderEmail) {
      const htmlEmail = generateOutbidAlertEmailHtml({
        relicName,
        relicCode,
        currentBidINR,
        productId,
        timeRemaining
      });

      emailResult = await sendEmail({
        to: bidderEmail,
        subject: `OUTBID ALERT: Leading offer raised on ${relicName} (${relicCode}) · Indie Summer`,
        html: htmlEmail
      });
    }

    let smsResult = null;
    if (bidderPhone) {
      const cleanPhone = bidderPhone.replace(/\s+/g, "");
      const smsText = `INDIE SUMMER ALERT: You have been outbid on ${relicName}. Current leading offer: ₹${Number(currentBidINR).toLocaleString("en-IN")}. Reclaim now: https://indiesummer.in/product/${productId}#bidding`;
      smsResult = await sendSMS({
        to: cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone.slice(-10)}`,
        message: smsText
      });
    }

    return NextResponse.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: "Outbid notification staged/sent."
    });
  } catch (error) {
    console.error("Outbid notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process outbid notification." },
      { status: 500 }
    );
  }
}
