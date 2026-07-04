import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Use a dedicated port so no stale service worker / cache from a previous
    // project on the old port can intercept requests. strictPort fails loudly
    // instead of silently falling back to another port.
    port: 5180,
    strictPort: true,
    watch: {
      // Native FS events are unreliable on Windows non-C: drives (project is on D:).
      // Polling makes the watcher detect file changes so HMR works reliably.
      usePolling: true,
      interval: 100,
    },
  },
})
