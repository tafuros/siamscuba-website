// Push Core Web Vitals to GTM dataLayer for real-user monitoring.
// Runs in the browser only; no-op during SSG.
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function reportWebVitals() {
  if (typeof window === "undefined") return;
  const push = (metric: Metric) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "web-vital",
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
      page_path: window.location.pathname,
    });
  };
  onLCP(push);
  onINP(push);
  onCLS(push);
  onFCP(push);
  onTTFB(push);
}
