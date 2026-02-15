import { defineConfig } from "vite";
import bundleAnalyzer from "vite-bundle-visualizer";

export default defineConfig({
  plugins: [
    bundleAnalyzer({
      template: "treemap",
      open: true,
      gzipSize: true,
      excludeAssets: ["*.map"],
    }),
  ],
});
