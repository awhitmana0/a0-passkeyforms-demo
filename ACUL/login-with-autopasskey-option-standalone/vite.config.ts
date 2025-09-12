import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
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
        name: "LoginWithAutopasskeyOption",
        entryFileNames: "login-with-autopasskey-option.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/login-with-autopasskey-option.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
    minify: true,
    sourcemap: true,
  },
});