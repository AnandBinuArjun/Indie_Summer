/**
 * Central Observability & Error Tracking for Indie Summer
 * Captures unhandled client exceptions, checkout errors, and network failures.
 * Integrates directly with Sentry APM and Supabase error logging.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Dynamically initialize Sentry in the browser if DSN is configured
if (typeof window !== "undefined" && SENTRY_DSN && !window.__sentry_initialized__) {
  window.__sentry_initialized__ = true;
  try {
    const script = document.createElement("script");
    script.src = "https://js.sentry-cdn.com/" + SENTRY_DSN.split("@")[0].split("//")[1] + ".min.js";
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => {
      if (window.Sentry) {
        window.Sentry.init({
          dsn: SENTRY_DSN,
          environment: process.env.NODE_ENV || "production",
          tracesSampleRate: 0.2
        });
      }
    };
    document.head.appendChild(script);
  } catch (e) {
    console.warn("Sentry APM loader note:", e);
  }

  // Global browser error listeners
  window.addEventListener("error", (event) => {
    logger.error("Unhandled client error: " + event.message, event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled Promise Rejection", event.reason);
  });
}

export const logger = {
  error: async (message, error = null, context = {}) => {
    const errorPayload = {
      message: typeof message === "string" ? message : (message?.message || "Unknown error"),
      stack: error?.stack || (error instanceof Error ? error.stack : null),
      context: {
        ...context,
        url: typeof window !== "undefined" ? window.location.href : "server",
        userAgent: typeof window !== "undefined" ? navigator.userAgent : "server",
        timestamp: new Date().toISOString()
      }
    };

    // 1. Output formatted error in development console
    console.error("[ATELIER OBSERVABILITY ERROR]:", errorPayload);

    // 2. Sentry Forwarding (if configured)
    if (typeof window !== "undefined" && window.Sentry) {
      try {
        window.Sentry.captureException(error || new Error(errorPayload.message), {
          extra: errorPayload.context
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // 3. Supabase Error Log Persistence (if configured)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("error_logs").insert({
          message: errorPayload.message,
          stack: errorPayload.stack,
          context: errorPayload.context
        });
      } catch (e) {
        // Silently skip if table not created
      }
    }

    return errorPayload;
  },

  warn: (message, context = {}) => {
    console.warn(`[ATELIER WARNING] ${message}`, context);
  },

  info: (message, context = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[ATELIER INFO] ${message}`, context);
    }
  }
};
