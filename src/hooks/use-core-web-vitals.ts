import { useEffect, useState } from "react";

/**
 * Core Web Vitals tracking hook
 * Monitors LCP, FID, CLS, TTFB, and FCP
 */
export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
    fcp?: number; // First Contentful Paint
  }>({});

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    // Track LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        startTime: number;
      };
      const lcp = lastEntry.startTime;

      setVitals((prev) => ({ ...prev, lcp }));

      // Send to analytics
      sendToAnalytics("LCP", lcp);
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP observation not supported");
    }

    // Track FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEntry & {
          processingStart: number;
          startTime: number;
        };
        const fid = fidEntry.processingStart - fidEntry.startTime;

        setVitals((prev) => ({ ...prev, fid }));
        sendToAnalytics("FID", fid);
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.warn("FID observation not supported");
    }

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as Array<
        PerformanceEntry & { value: number; hadRecentInput: boolean }
      >;

      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      setVitals((prev) => ({ ...prev, cls: clsValue }));
      sendToAnalytics("CLS", clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("CLS observation not supported");
    }

    // Track TTFB (Time to First Byte) and FCP (First Contentful Paint)
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as Array<
        PerformanceEntry & { startTime: number }
      >;

      entries.forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          const fcp = entry.startTime;
          setVitals((prev) => ({ ...prev, fcp }));
          sendToAnalytics("FCP", fcp);
        }
      });
    });

    try {
      navigationObserver.observe({ entryTypes: ["paint"] });
    } catch (e) {
      console.warn("Paint observation not supported");
    }

    // Get TTFB from navigation timing
    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.startTime;
      setVitals((prev) => ({ ...prev, ttfb }));
      sendToAnalytics("TTFB", ttfb);
    }

    // Cleanup
    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  return vitals;
}

/**
 * Send Core Web Vitals to analytics
 */
function sendToAnalytics(metricName: string, value: number) {
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag("event", "web_vitals", {
      event_category: "Web Vitals",
      event_label: metricName,
      value: Math.round(value),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === "production") {
    fetch("/api/analytics/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metric: metricName,
        value,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {
      // Silently fail - don't impact user experience
    });
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metricName}: ${value}`);
  }
}

// Type augmentation for window
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
