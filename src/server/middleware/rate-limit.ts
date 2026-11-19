import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createMiddleware } from "hono/factory";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "autism-platform",
});

export const rateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For") ??
    "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return c.json(
      {
        error: "Too many requests",
        message: "Please try again in a few seconds",
        retryAfter: 10,
      },
      429,
      {
        "Retry-After": "10",
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 10),
      },
    );
  }

  await next();
});

export const strictRateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For") ??
    "unknown";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return c.json(
      {
        error: "Rate limit exceeded",
        message: "You have made too many requests",
      },
      429,
    );
  }

  await next();
});

export const authRateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For") ??
    "unknown";

  const authRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "autism-platform-auth",
  });

  const { success } = await authRatelimit.limit(`${ip}:auth`);

  if (!success) {
    return c.json(
      {
        error: "Too many authentication attempts",
        message: "Please wait before trying again",
        retryAfter: 60,
      },
      429,
      {
        "Retry-After": "60",
      },
    );
  }

  await next();
});

export const apiRateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For") ??
    "unknown";

  const apiRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "autism-platform-api",
  });

  const { success } = await apiRatelimit.limit(`${ip}:api`);

  if (!success) {
    return c.json(
      {
        error: "API rate limit exceeded",
        message: "Please slow down your requests",
      },
      429,
    );
  }

  await next();
});
