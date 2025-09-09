import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  clearScreen: false,
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      output: {
        format: "umd",
        name: "PasskeyEnrollmentTheme",
        entryFileNames: "passkey-enrollment-theme.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/passkey-enrollment-theme.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
    minify: true,
    sourcemap: true,
  },
});