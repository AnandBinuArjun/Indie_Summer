import { NextResponse } from "next/server";
import {
  generateDispatchEmailHtml,
  sendEmail,
  sendSMS
} from "../../../../lib/notifications";

export async function POST(request) {
  try {
    const { order, awbNumber = "BD-AIR-89410294" } = await request.json();

    if (!order || !order.customer_email) {
      return NextResponse.json(
        { success: false, error: "Missing required order details." },
        { status: 400 }
      );
    }

    // 1. Dispatch BlueDart Dispatch Email
    const htmlEmail = generateDispatchEmailHtml(order, awbNumber);
    const emailResult = await sendEmail({
      to: order.customer_email,
      subject: `En Route via BlueDart Air: ${order.order_ref} · Indie Summer Atelier`,
      html: htmlEmail
    });

    // 2. Dispatch SMS / WhatsApp dispatch update
    let smsResult = null;
    if (order.customer_phone) {
      const cleanPhone = order.customer_phone.replace(/\s+/g, "");
      const smsText = `INDIE SUMMER: Your 1-of-1 piece (${order.order_ref}) is dispatched via BlueDart Air Express (AWB: ${awbNumber}). Track live: https://indiesummer.in/track`;
      smsResult = await sendSMS({
        to: cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone.slice(-10)}`,
        message: smsText
      });
    }

    return NextResponse.json({
      success: true,
      email: emailResult,
      sms: smsResult,
      message: "Dispatch notification successfully dispatched."
    });
  } catch (error) {
    console.error("Dispatch notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send dispatch notification." },
      { status: 500 }
    );
  }
}
