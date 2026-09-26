import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In sandbox test mode
    if (razorpay_order_id?.startsWith("order_sandbox_") || !keySecret) {
      return NextResponse.json({
        verified: true,
        isTestMode: true,
        paymentId: razorpay_payment_id || `pay_sandbox_${Date.now()}`,
        message: "Payment authorized via sandbox simulator."
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing required payment authorization parameters." },
        { status: 400 }
      );
    }

    // Verify HMAC SHA256 signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (isValid) {
      return NextResponse.json({
        verified: true,
        isTestMode: false,
        paymentId: razorpay_payment_id
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Cryptographic signature verification mismatch." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification route error:", error);
    return NextResponse.json(
      { verified: false, error: "Server exception during signature verification." },
      { status: 500 }
    );
  }
}
