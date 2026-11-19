import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { auth } from "../auth";
import { captureError, initSentry } from "../observability/sentry";
import { createContext } from "../orpc/context";
import { router } from "../orpc/router";
import {
  cacheMiddleware,
  rateLimitMiddleware,
  versionMiddleware,
} from "./middleware";
import { API_VERSION } from "./protocol";

const appName =
  process.env.APP_NAME ?? process.env.VITE_PUBLIC_APP_NAME ?? "App";

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [new BatchHandlerPlugin()],
});

const openAPIHandler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export const api = new Hono<{ Bindings: Env }>();

initSentry();

api.use("/api/*", versionMiddleware, rateLimitMiddleware);

api.get("/api/health", (c) => {
  return c.json({ ok: true, version: API_VERSION });
});

api.all("/api/auth/*", (c) => auth.handler(c.req.raw));

api.all("/api/rpc/*", async (c) => {
  const { response } = await rpcHandler.handle(c.req.raw, {
    prefix: "/api/rpc",
    context: await createContext(c.req.raw, c.env),
  });

  return response ?? c.text("Not Found", 404);
});

api.get("/api/openapi/spec.json", cacheMiddleware(300), async (c) => {
  const origin = new URL(c.req.url).origin;
  const spec = await openAPIGenerator.generate(router, {
    info: {
      title: `${appName} API`,
      version: API_VERSION,
      description: "Type-safe APIs for Autism Care Platform",
    },
    servers: [{ url: `${origin}/api/openapi` }],
  });

  return c.json(spec);
});

api.all("/api/openapi/*", async (c) => {
  const { response } = await openAPIHandler.handle(c.req.raw, {
    prefix: "/api/openapi",
    context: await createContext(c.req.raw, c.env),
  });

  return response ?? c.text("Not Found", 404);
});

api.onError((err, c) => {
  captureError(err);
  return c.json(
    { error: "internal_error", message: "Unexpected server error." },
    500,
  );
});
