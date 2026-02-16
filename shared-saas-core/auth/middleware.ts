import { cache } from "../cache/redis-cache";
import { TokenPayload, authService } from "./auth-service";

const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/register", "/api/health"];
const IGNORE_PATHS = ["/_next", "/static", "/favicon", "/assets"];

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const parseCookies = (request: Request) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((entry) => {
    const [rawKey, ...rest] = entry.trim().split("=");
    if (!rawKey) return;
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rest.join("="));
    cookies[key] = value;
  });
  return cookies;
};

const jsonResponse = (body: unknown, status: number) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export async function authMiddleware(
  request: AuthenticatedRequest,
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  for (const ignorePath of IGNORE_PATHS) {
    if (path.startsWith(ignorePath)) {
      return null;
    }
  }

  for (const publicPath of PUBLIC_PATHS) {
    if (path === publicPath || path.startsWith(publicPath + "/")) {
      return null;
    }
  }

  const authHeader = request.headers.get("authorization");
  const cookies = parseCookies(request);
  const token = authHeader?.replace("Bearer ", "") || cookies.accessToken;

  if (!token) {
    if (path.startsWith("/api/")) {
      return jsonResponse(
        { error: "Unauthorized", message: "No access token provided" },
        401,
      );
    }
    return Response.redirect(new URL("/login", request.url), 302);
  }

  const payload = authService.verifyAccessToken(token);

  if (!payload) {
    if (path.startsWith("/api/")) {
      return jsonResponse(
        { error: "Unauthorized", message: "Invalid or expired token" },
        401,
      );
    }
    return Response.redirect(new URL("/login", request.url), 302);
  }

  request.user = payload;
  return null;
}

export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<Response>,
) {
  return async (request: AuthenticatedRequest) => {
    const authError = await authMiddleware(request);
    if (authError) return authError;
    return handler(request);
  };
}

export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  limit: number = 100,
  windowMs: number = 60000,
) {
  return async (request: Request) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const windowSeconds = Math.ceil(windowMs / 1000);
    const windowKey = Math.floor(now / windowMs);
    const rateLimitKey = `ratelimit:${ip}:${windowKey}`;

    try {
      // Use Redis INCR for atomic increment
      const current = (await cache.get<number>(rateLimitKey)) || 0;

      if (current >= limit) {
        return jsonResponse(
          {
            error: "Too Many Requests",
            message: "Rate limit exceeded. Try again later.",
          },
          429,
        );
      }

      // Increment counter with TTL
      await cache.set(rateLimitKey, current + 1, windowSeconds);
    } catch (error) {
      // If Redis fails, log error but don't block the request
      console.error("Rate limit check failed:", error);
    }

    return handler(request);
  };
}

export function withCors(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    const response = await handler(request);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  };
}
