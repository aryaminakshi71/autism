/// <reference types="@cloudflare/workers-types" />
import handler from "@tanstack/react-start/server-entry";
import "@tanstack/start-client-core";
import type { getRouter } from "./router";
import { api } from "./server/api/app";

interface Env {
  // Add your Cloudflare Worker environment variables here
  DATABASE?: Hyperdrive;
  DATABASE_URL?: string;
  [key: string]: unknown;
}

export interface CloudflareRequestContext {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
}

declare module "@tanstack/start-client-core" {
  interface Register {
    ssr: true;
    router: ReturnType<typeof getRouter>;
    server: {
      requestContext: CloudflareRequestContext;
    };
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Populate process.env with string vars only (env can contain bindings/objects).
    for (const [key, value] of Object.entries(env)) {
      if (typeof value === "string") {
        process.env[key] = value;
      }
    }

    // Prefer Hyperdrive connection string when available.
    if (env.DATABASE?.connectionString) {
      process.env.DATABASE_URL = env.DATABASE.connectionString;
    }
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return api.fetch(request, env as any, ctx);
    }

    return handler.fetch(request, {
      context: {
        cloudflare: { env, ctx },
      },
    } as Parameters<typeof handler.fetch>[1]);
  },
};
