"use client";

import React, { useEffect } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * Universal Event Dispatcher for GA4 & Meta Pixel
 */
export function trackAnalyticsEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  // Check user privacy preferences
  const consent = localStorage.getItem("indie_summer_cookie_consent");
  if (consent === "essential") {
    // Respect user's essential-only preference
    return;
  }

  // 1. Google Analytics 4
  if (window.gtag && GA_ID) {
    try {
      window.gtag("event", eventName, params);
    } catch (e) {
      console.warn("GA4 track error:", e);
    }
  }

  // 2. Meta Pixel
  if (window.fbq && FB_PIXEL_ID) {
    try {
      // Map standard ecommerce events to Meta standard event names
      if (eventName === "purchase") {
        window.fbq("track", "Purchase", {
          value: params.value,
          currency: params.currency || "INR",
          content_type: "product",
          content_ids: (params.items || []).map((i) => i.id || i.code)
        });
      } else if (eventName === "begin_checkout") {
        window.fbq("track", "InitiateCheckout", {
          value: params.value,
          currency: params.currency || "INR",
          num_items: params.num_items || 1
        });
      } else if (eventName === "add_payment_info") {
        window.fbq("track", "AddPaymentInfo", {
          value: params.value,
          currency: params.currency || "INR"
        });
      } else if (eventName === "view_item") {
        window.fbq("track", "ViewContent", {
          content_name: params.item_name,
          content_ids: [params.item_id],
          value: params.value,
          currency: params.currency || "INR"
        });
      } else {
        window.fbq("trackCustom", eventName, params);
      }
    } catch (e) {
      console.warn("Meta pixel error:", e);
    }
  }

  // Development Logger
  if (process.env.NODE_ENV !== "production") {
    console.log(`[ATELIER ANALYTICS] Event: ${eventName}`, params);
  }
}

// Shortcut Helpers
export const trackViewItem = (product) => {
  if (!product) return;
  trackAnalyticsEvent("view_item", {
    currency: "INR",
    value: product.priceINR || product.currentBidINR,
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_code: product.code
  });
};

export const trackInitiateCheckout = (items = [], total = 0) => {
  trackAnalyticsEvent("begin_checkout", {
    currency: "INR",
    value: total,
    num_items: items.length,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.priceINR,
      quantity: i.quantity || 1
    }))
  });
};

export const trackAddPaymentInfo = (paymentMethod, total = 0) => {
  trackAnalyticsEvent("add_payment_info", {
    currency: "INR",
    value: total,
    payment_type: paymentMethod
  });
};

export const trackPurchase = (order) => {
  if (!order) return;
  trackAnalyticsEvent("purchase", {
    transaction_id: order.order_ref || order.id,
    value: order.total_amount_inr,
    currency: "INR",
    items: (order.items || []).map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.priceINR,
      quantity: i.quantity || 1
    }))
  });
};

export const trackBidPlaced = (product, bidAmount) => {
  trackAnalyticsEvent("place_bid", {
    product_id: product?.id,
    product_name: product?.name,
    product_code: product?.code,
    bid_amount: bidAmount,
    currency: "INR"
  });
};

export default function Analytics() {
  useEffect(() => {
    // Expose trackAnalyticsEvent globally for inline handlers if needed
    if (typeof window !== "undefined") {
      window.indieSummerAnalytics = {
        trackEvent: trackAnalyticsEvent,
        trackViewItem,
        trackInitiateCheckout,
        trackAddPaymentInfo,
        trackPurchase,
        trackBidPlaced
      };
    }
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel (Facebook & Instagram) */}
      {FB_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
