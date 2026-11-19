// const handler = { fetch: async () => new Response("Mock Handler Works (Node)") };
import { api } from "@autism-legacy-20260205/api/app";
import handler from "@tanstack/react-start/server-entry";
import "@tanstack/start-client-core";
import type { getRouter } from "./router";

interface Env {
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
    const url = new URL(request.url);

    // Handle API routes - integrated API
    if (url.pathname.startsWith("/api")) {
      return api.fetch(request, env as any, ctx);
    }

    return await handler.fetch(request, {
      context: {
        cloudflare: { env, ctx },
      },
    } as Parameters<typeof handler.fetch>[1]);
  },
};
