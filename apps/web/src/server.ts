// const handler = { fetch: async () => new Response("Mock Handler Works (Node)") };
import { api } from "@autism-legacy-20260205/api/app";
import type { Env } from "@autism-legacy-20260205/env/cloudflare";
import handler from "@tanstack/react-start/server-entry";
import type { getRouter } from "./router";

export interface CloudflareRequestContext {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
}

declare module "@tanstack/react-start" {
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
