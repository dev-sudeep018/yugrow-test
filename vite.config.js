import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cpSync, mkdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // The GitHub Pages build is served from /yugrow-test/; local preview stays at /.
  base: process.env.GITHUB_ACTIONS === "true" ? "/yugrow-test/" : "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-local-site-assets",
      apply: "build",
      closeBundle() {
        const destination = `${projectRoot}dist/assets`;
        mkdirSync(destination, { recursive: true });
        cpSync(`${projectRoot}assets`, destination, { recursive: true, force: true });
      },
    },
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "0.0.0.0", port: 8765, strictPort: true },
});
