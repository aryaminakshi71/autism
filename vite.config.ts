import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

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
    ].filter(Boolean),
  };
});
