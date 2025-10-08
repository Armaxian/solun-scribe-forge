import path from "path";

import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env to optionally enable/disable dev-only plugins safely
  const env = loadEnv(mode, process.cwd(), "");
  const enableTagger = mode === "development" && env.VITE_ENABLE_TAGGER === "true";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      svgr(),
      // Guard the dev-only tagger behind an explicit env flag to avoid
      // transform errors that can break dynamic imports in dev.
      enableTagger && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Add alias for lodash.debounce to fix import issues
        'lodash.debounce': 'lodash.debounce',
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
      // Disable source maps for production
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
      exclude: ['three', '@splinetool/react-spline', '@splinetool/runtime'], // Don't pre-bundle Three.js and Spline for lazy loading
    },
    // Define global variables for better module resolution
    define: {
      global: 'globalThis',
    },
  };
});
