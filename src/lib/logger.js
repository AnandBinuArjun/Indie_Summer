/**
 * Central Observability & Error Tracking for Indie Summer
 * Captures unhandled client exceptions, checkout errors, and network failures.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

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

    // 2. Sentry Forwarding (if configured via environment variable)
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
