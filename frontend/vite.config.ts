import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:3000",
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
