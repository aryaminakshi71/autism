interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  ttfb: number;
  cls: number;
  fid: number;
  inp: number;
}

export function measurePerformance(): PerformanceMetrics | null {
  if (typeof window === "undefined" || !window.performance) return null;

  const paintEntries = performance.getEntriesByType("paint");
  const navigationEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  const firstContentfulPaint = paintEntries.find(
    (p) => p.name === "first-contentful-paint",
  );

  const navigation = navigationEntries?.[0];

  let cls = 0;
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === "layout-shift" &&
            !(entry as any).hadRecentInput
          ) {
            cls += (entry as any).value;
          }
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch (e) {
      console.warn("CLS observation not supported");
    }
  }

  return {
    fcp: firstContentfulPaint?.duration ?? 0,
    lcp: navigation?.loadEventEnd ?? 0,
    ttfb: navigation?.responseStart ?? 0,
    cls,
    fid: 0,
    inp: 0,
  };
}

export function sendMetricsToAnalytics(metrics: PerformanceMetrics) {
  if (typeof window === "undefined") return;

  const envKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  if (envKey && window.posthog) {
    window.posthog.capture("$performance", metrics);
  }

  if (import.meta.env.DEV) {
    console.table(metrics);
  }
}

export function trackPageLoad() {
  if (typeof window === "undefined") return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      const metrics = measurePerformance();
      if (metrics) {
        sendMetricsToAnalytics(metrics);
      }
    }, 0);
  });
}

export function measureComponentRender(componentName: string) {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    if (import.meta.env.DEV) {
      console.log(`${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
    return duration;
  };
}

export function useRenderTracker(componentName: string) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(performance.now());

  React.useEffect(() => {
    renderCount.current++;
    const timeSinceLastRender = performance.now() - lastRenderTime.current;
    lastRenderTime.current = performance.now();

    if (import.meta.env.DEV) {
      console.log(
        `${componentName} rendered ${renderCount.current} times, ` +
          `${timeSinceLastRender.toFixed(2)}ms since last render`,
      );
    }
  });
}

import React from "react";
