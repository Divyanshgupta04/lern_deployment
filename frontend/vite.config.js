// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    // Frontend dev server port (alag rakho backend se)
    port: 5173,

    // Proxy all /api calls to backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // ✅ same as backend PORT
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
