import { defineConfig } from "vite";
import { nxReadySignal } from "@nx/vite/plugins/nx-ready-signal.plugin";

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/libs/portfolio-data-models",
  plugins: [nxReadySignal()],
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      reportsDirectory: "./test-output/vitest/coverage",
      provider: "v8" as const,
    },
  },
}));
