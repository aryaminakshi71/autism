import { createMiddleware } from "hono/factory";

export const securityHeaders = createMiddleware(async (c, next) => {
  c.header("X-DNS-Prefetch-Control", "on");
  c.header(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: wss:; worker-src 'self' blob:;`,
  );
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  await next();
});

export const noCacheHeaders = createMiddleware(async (c, next) => {
  c.header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  c.header("Surrogate-Control", "no-store");

  await next();
});

export const corsHeaders = createMiddleware(async (c, next) => {
  c.header("Access-Control-Allow-Origin", c.req.header("Origin") ?? "*");
  c.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-API-Version",
  );
  c.header("Access-Control-Max-Age", "86400");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

export const rateLimitHeaders = createMiddleware(async (c, next) => {
  const limit = 100;
  const remaining = "99";
  const reset = "60";

  c.header("X-RateLimit-Limit", String(limit));
  c.header("X-RateLimit-Remaining", remaining);
  c.header("X-RateLimit-Reset", reset);

  await next();
});
