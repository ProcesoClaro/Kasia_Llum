import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    // Compatibilidad: transpila la sintaxis JS moderna (?. ?? etc.) y añade
    // fallbacks rgb() a los colores oklch() del CSS de Tailwind 4. El suelo
    // efectivo pasa a ser el de las cascade layers (@layer): Chrome/Edge 99+,
    // Safari/iOS 15.4+, Firefox 97+ (todos de principios de 2022).
    target: ["chrome80", "safari13.1", "firefox74", "edge80"],
    cssTarget: ["chrome99", "safari15.4", "firefox97"],
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "CoanfiChat",
      formats: ["iife"],
      fileName: () => "coanfi-chat.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "coanfi-chat.[ext]",
      },
    },
    cssCodeSplit: false,
    outDir: resolve(__dirname, "../plugin/coanfi-chat/assets"),
    emptyOutDir: true,
  },
});
