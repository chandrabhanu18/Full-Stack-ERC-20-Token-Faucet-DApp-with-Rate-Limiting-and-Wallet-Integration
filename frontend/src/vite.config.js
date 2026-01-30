import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": "{}",
  },
  optimizeDeps: {
    include: ["ethers"],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        globals: {
          ethers: "ethers",
        },
      },
    },
  },
});
