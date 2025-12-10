import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Expose to Docker network
    watch: {
        usePolling: true // Required for Docker hot-reload on some systems
    }
  }
});