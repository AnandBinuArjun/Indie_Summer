import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", orderRef, customerName, customerEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount specified." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live or test Razorpay keys are configured in environment
    if (keyId && keySecret) {
      // Amount in paise for INR (1 INR = 100 paise)
      const amountInPaise = Math.round(Number(amount) * 100);

      const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: currency.toUpperCase(),
          receipt: orderRef || `REC-${Date.now()}`,
          notes: {
            order_ref: orderRef || "",
            customer_name: customerName || "",
            customer_email: customerEmail || "",
            atelier: "INDIE SUMMER ATELIER"
          }
        })
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json().catch(() => ({}));
        console.error("Razorpay order creation failed:", errorData);
        return NextResponse.json(
          {
            error: errorData.error?.description || "Gateway order initialization failed.",
            details: errorData
          },
          { status: 502 }
        );
      }

      const orderData = await razorpayResponse.json();

      return NextResponse.json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId,
        isTestMode: false
      });
    }

    // Sandbox / Development fallback when RAZORPAY credentials are not yet entered in .env.local
    const mockOrderId = `order_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      keyId: "rzp_test_sandbox",
      isTestMode: true,
      notice: "Atelier sandbox simulator active. Add RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to .env.local for live production gateway processing."
    });
  } catch (error) {
    console.error("Payment order route error:", error);
    return NextResponse.json(
      { error: "Server error while initializing payment order." },
      { status: 500 }
    );
  }
}
