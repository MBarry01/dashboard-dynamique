import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dashboard-dynamique/', // Ajout du base path pour GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message?.includes('defaultProps')) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          'plotly': ['plotly.js-dist-min'],
          'react-vendor': ['react', 'react-dom'],
          'recharts': ['recharts']
        }
      }
    }
  }
});