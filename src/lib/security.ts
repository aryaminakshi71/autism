import DOMPurify from "dompurify";
import { useMemo } from "react";

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
    FORBID_ATTR: ["style", "onerror", "onload"],
  });
}

/**
 * React hook for sanitized content
 */
export function useSanitizedHTML(html: string): string {
  return useMemo(() => sanitizeHTML(html), [html]);
}

/**
 * Sanitize user input (plain text)
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    // Check for localhost/private IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = parsed.hostname;
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.")
      ) {
        return null;
      }
    }

    return url;
  } catch {
    return null;
  }
}

/**
 * Escape special regex characters
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rate limiter for client-side operations
 */
export class RateLimiter {
  private timestamps: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canProceed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.timestamps.has(key)) {
      this.timestamps.set(key, [now]);
      return true;
    }

    const timestamps = this.timestamps.get(key) || [];
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }

    validTimestamps.push(now);
    this.timestamps.set(key, validTimestamps);
    return true;
  }

  getRemainingTime(key: string): number {
    const timestamps = this.timestamps.get(key) || [];
    if (timestamps.length === 0) return 0;

    const oldestTimestamp = Math.min(...timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldestTimestamp));
  }
}

// Create global rate limiter instance
export const globalRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
