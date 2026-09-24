import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages project site: set VITE_BASE_PATH=/your-repo-name/ in CI
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
  },
});
