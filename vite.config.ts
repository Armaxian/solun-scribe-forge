import path from "path";

import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    svgr(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable code splitting and optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js and related libraries
          'three-vendor': ['three'],
          // Separate UI library components
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          // Separate React Query and router
          'react-vendor': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
          // Separate utilities
          'utils-vendor': ['lucide-react', 'react-helmet-async', 'date-fns'],
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minimize bundle size
    minify: 'esbuild',
    // Set chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'react-helmet-async',
    ],
    exclude: ['three'], // Don't pre-bundle Three.js for lazy loading
  },
}));
