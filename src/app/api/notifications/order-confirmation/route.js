import { NextResponse } from "next/server";
import {
  generateOrderConfirmationEmailHtml,
  sendEmail,
  sendSMS
} from "../../../../lib/notifications";

export async function POST(request) {
  try {
    const order = await request.json();

    if (!order || !order.order_ref || !order.customer_email) {
      return NextResponse.json(
        { success: false, error: "Missing required order parameters." },
        { status: 400 }
      );
    }

    // 1. Dispatch High-Fashion Editorial Certificate & Invoice Email
    const htmlEmail = generateOrderConfirmationEmailHtml(order);
    const emailResult = await sendEmail({
      to: order.customer_email,
      subject: `Acquisition Confirmed · Certificate of Provenance (${order.order_ref}) · Indie Summer`,
      html: htmlEmail
    });

    // 2. Dispatch SMS / WhatsApp confirmation if phone is provided
    let smsResult = null;
    if (order.customer_phone) {
      const cleanPhone = order.customer_phone.replace(/\s+/g, "");
      const smsText = `INDIE SUMMER: Dear ${order.customer_name || "Patron"}, your archival acquisition ${order.order_ref} of ₹${Number(order.total_amount_inr || 0).toLocaleString("en-IN")} is confirmed. Track your BlueDart air dispatch: https://indiesummer.in/track`;
      smsResult = await sendSMS({
        to: cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone.slice(-10)}`,
        message: smsText
      });
    }

    return NextResponse.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: "Order confirmation and Certificate of Provenance successfully staged/sent."
    });
  } catch (error) {
    console.error("Order confirmation notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order confirmation notification." },
      { status: 500 }
    );
  }
}
