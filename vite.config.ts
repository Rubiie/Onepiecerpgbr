import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // <-- Esta linha é crucial

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // <-- E o uso aqui também
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // UI components and utilities
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // PDF generation
          if (id.includes('node_modules/jspdf')) {
            return 'pdf';
          }
          // Charts
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Other large node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js']
  }
})
