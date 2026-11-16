import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const shellPort = process.env.PORT;
  const env = loadEnv(mode, __dirname, "");
  const port = shellPort || env.PORT || "3000";
  process.env = { ...process.env, ...env };

  return {
    resolve: {
      alias: {
        "next/link": path.resolve(__dirname, "src/shims/next-link.tsx"),
        "next/navigation": path.resolve(
          __dirname,
          "src/shims/next-navigation.ts",
        ),
      },
    },
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        external: ["cloudflare:workers"],
      },
    },
    server: {
      port: Number(port),
      host: process.env.HOST ?? "127.0.0.1",
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_LOCAL_API_URL || "http://127.0.0.1:8787",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      tsconfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      ...(process.env.SKIP_CLOUDFLARE !== "true"
        ? [
            cloudflare({
              viteEnvironment: { name: "ssr" },
            }),
          ]
        : []),
      tanstackStart({
        start: { entry: "./src/client.tsx" },
        server: { entry: "./src/server.ts" },
      }),
      react(),
      // Bundle analyzer - run with ANALYZE=true bun run build
      ...(process.env.ANALYZE === "true"
        ? [
            visualizer({
              open: true,
              filename: "dist/stats.html",
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ].filter(Boolean),
  };
});
