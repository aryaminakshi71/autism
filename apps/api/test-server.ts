/**
 * Simple test server for autism API
 */
import { createApp } from "./src/app";

const PORT = 3003;

const app = createApp();

Bun.serve({
  port: PORT,
  fetch: (req) =>
    app.fetch(
      req,
      {
        DATABASE: { connectionString: "" },
        NODE_ENV: "development",
      } as any,
      undefined,
    ),
});

console.log(`autism API running on http://localhost:${PORT}`);
