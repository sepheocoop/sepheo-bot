import { defineConfig } from "vite";

const name = process.env.npm_package_name!;

export default defineConfig({
  // minimal configuration — Vite + vite-node + vitest can use this
  build: {
    ssr: true,
    outDir: "dist",
    target: "esnext",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: { index: "src/index.ts" },
      name,
      formats: ["es"],
    },
  },
  ssr: {
    noExternal: process.env.NODE_ENV === "production" || undefined,
  },
  esbuild: {
    target: "es2022",
  },
});
