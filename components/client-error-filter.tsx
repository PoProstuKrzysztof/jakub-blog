"use client";

import { useEffect } from "react";

/**
 * Client-side component that filters out common browser extension and ad blocker errors
 * This should be included in the root layout to handle global errors
 */
export function ClientErrorFilter() {
  useEffect(() => {
    // Filter console.error calls to reduce noise from browser extensions
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(" ");

      // Filter out known browser extension errors
      const shouldFilter = [
        "chrome-extension",
        "Could not evaluate in iframe",
        "net::ERR_BLOCKED_BY_CLIENT",
        "sentry.io",
        "Failed to load resource",
        "uBlock",
        "AdBlock",
        "Privacy Badger",
        "Ghostery",
      ].some((pattern) => message.includes(pattern));

      if (!shouldFilter) {
        originalError.apply(console, args);
      }
    };

    // Filter console.warn calls as well
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const message = args.join(" ");

      const shouldFilter = [
        "Cross origin request detected",
        "allowedDevOrigins",
        "Critical dependency",
        "Module not found",
      ].some((pattern) => message.includes(pattern));

      if (!shouldFilter) {
        originalWarn.apply(console, args);
      }
    };

    // Handle promise rejections from blocked requests
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason?.message || reason?.toString() || "";

      const isKnownError = [
        "net::ERR_BLOCKED_BY_CLIENT",
        "Failed to fetch",
        "NetworkError",
        "chrome-extension",
        "sentry",
      ].some((pattern) => message.includes(pattern));

      if (isKnownError) {
        event.preventDefault();
        // Optionally log filtered errors in development
        if (process.env.NODE_ENV === "development") {
          console.debug("Filtered promise rejection:", reason);
        }
      }
    };

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      const filename = event.filename || "";

      const isExtensionError =
        message.includes("chrome-extension") ||
        filename.includes("chrome-extension") ||
        message.includes("Could not evaluate in iframe");

      const isBlockedResource =
        message.includes("net::ERR_BLOCKED_BY_CLIENT") ||
        message.includes("Failed to load resource");

      if (isExtensionError || isBlockedResource) {
        event.preventDefault();
        if (process.env.NODE_ENV === "development") {
          console.debug("Filtered error event:", event);
        }
      }
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    // Cleanup function
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
