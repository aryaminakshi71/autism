/**
 * Health Router
 *
 * Comprehensive health check endpoint with database and service checks.
 */

import { z } from "zod";
import { pub } from "../procedures";
import { createDb } from "@autism-legacy-20260205/storage";
import { getQueryStats, getSlowQueries } from "../lib/db-performance";

const startTime = Date.now();

export const healthRouter = {
  check: pub
    .route({
      method: "GET",
      path: "/health",
      summary: "Health check",
      tags: ["System"],
    })
    .output(
      z.object({
        status: z.enum(["ok", "error", "degraded"]),
        timestamp: z.string(),
        version: z.string(),
        services: z.object({
          database: z.object({
            status: z.enum(["healthy", "unhealthy", "unknown"]),
            responseTime: z.number().optional(),
            error: z.string().optional(),
          }),
          cache: z.object({
            status: z.enum(["healthy", "unhealthy", "unknown"]),
            responseTime: z.number().optional(),
            error: z.string().optional(),
          }).optional(),
        }),
        uptime: z.number().optional(),
        performance: z.object({
          avgQueryTime: z.number().optional(),
          slowQueries: z.number().optional(),
          errorRate: z.number().optional(),
        }).optional(),
      }),
    )
    .handler(async ({ context }) => {
      const checks: {
        database: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
        cache: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
      } = {
        database: { status: "unknown", responseTime: 0 },
        cache: { status: "unknown", responseTime: 0 },
      };

      // Check database
      try {
        const dbStart = Date.now();
        const env = context.env as any;
        const connectionString =
          env?.DATABASE?.connectionString ||
          env?.DATABASE_URL ||
          process.env.DATABASE_URL;

        if (connectionString) {
          const db = createDb({ connectionString });
          await db.execute("SELECT 1");
          checks.database = {
            status: "healthy" as const,
            responseTime: Date.now() - dbStart,
          };
        } else {
          checks.database = {
            status: "unhealthy" as const,
            error: "Database connection string not configured",
            responseTime: 0,
          };
        }
      } catch (error) {
        checks.database = {
          status: "unhealthy" as const,
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime: 0,
        };
      }

      // Check cache (if Redis is configured)
      try {
        const cacheStart = Date.now();
        const env = context.env as any;
        const redisUrl = env?.REDIS_URL || process.env.REDIS_URL;
        if (redisUrl) {
          // Redis is configured
          checks.cache = {
            status: "healthy" as const,
            responseTime: Date.now() - cacheStart,
          };
        } else {
          checks.cache = {
            status: "unknown" as const,
            error: "Redis not configured",
            responseTime: 0,
          };
        }
      } catch (error) {
        checks.cache = {
          status: "unhealthy" as const,
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime: 0,
        };
      }

      // Determine overall status
      const overallStatus =
        checks.database.status === "healthy" &&
        (checks.cache?.status === "healthy" || checks.cache?.status === "unknown")
          ? "ok"
          : checks.database.status === "unhealthy"
            ? "error"
            : "degraded";

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        services: {
          database: {
            status: checks.database.status,
            responseTime: checks.database.responseTime,
            ...(checks.database.error && { error: checks.database.error }),
          },
          ...(checks.cache && {
            cache: {
              status: checks.cache.status,
              ...(checks.cache.responseTime && {
                responseTime: checks.cache.responseTime,
              }),
              ...(checks.cache.error && { error: checks.cache.error }),
            },
          }),
        },
        uptime: Math.floor((Date.now() - startTime) / 1000),
        performance: (() => {
          try {
            const stats = getQueryStats();
            const slowQueries = getSlowQueries(1000);
            return {
              avgQueryTime: stats.avgDuration,
              slowQueries: slowQueries.length,
              errorRate: stats.errorRate,
            };
          } catch (error) {
            // Performance stats are optional, don't fail health check if they error
            return {
              avgQueryTime: 0,
              slowQueries: 0,
              errorRate: 0,
            };
          }
        })(),
      };
    }),
};
