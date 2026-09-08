import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  root,
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/.next/**", "**/src/generated/**"],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.join(root, "vitest.setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    root,
    maxWorkers: 2,
  },
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
});
