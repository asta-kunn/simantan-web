import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const computeBaseFromMode = (mode) => {
    if (env.VITE_PUBLIC_URL && env.VITE_PUBLIC_URL.length > 0) {
      return env.VITE_PUBLIC_URL.endsWith("/")
        ? env.VITE_PUBLIC_URL
        : env.VITE_PUBLIC_URL + "/";
    }
    switch (mode) {
      case "develop":
        return "/develop/";
      case "uat":
        return "/uat/";
      default:
        return "/";
    }
  };
  const base = computeBaseFromMode(mode);

  return {
    base,

    // Enhanced ESBuild configuration
    esbuild: {
      target: "es2020",
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      legalComments: "none",
    },

    resolve: {
      alias: {
        "@": "/src",
      },
      extensions: [".js", ".jsx", ".json"],
    },

    plugins: [
      react({
        // Enable React Fast Refresh optimizations
        fastRefresh: true,
      }),

      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "PLM Web Application",
          short_name: "PLM Web",
          description: "Product Lifecycle Management Web Application",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "innolife-logo.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "innolife-logo.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "vite.svg",
              sizes: "any",
              type: "image/svg+xml",
            },
          ],
          id: base,
          start_url: base,
          scope: base,
          orientation: "portrait",
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB instead of default 2 MiB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/jsonplaceholder.typicode.com\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
              },
            },
          ],
        },
      }),
      // Only include visualizer in analysis mode
      ...(process.env.ANALYZE
        ? [
            visualizer({
              open: true,
              gzipSize: true,
              brotliSize: true,
              filename: "dist/stats.html",
            }),
          ]
        : []),
    ],

    // Enhanced build optimizations
    build: {
      // Target modern browsers for smaller bundles
      target: "es2020",

      // Enable minification
      minify: "esbuild",

      // Generate source maps only for development
      sourcemap: mode !== "production",

      // Reduce chunk size warnings threshold
      chunkSizeWarningLimit: 1000,

      // Advanced Rollup options for optimal chunking
      rollupOptions: {
        output: {
          // Optimized file naming with shorter hashes
          entryFileNames: "js/[name]-[hash:8].js",
          chunkFileNames: "js/[name]-[hash:8].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            const extType = info[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash:8].[ext]`;
            }
            if (/\.(css)$/i.test(assetInfo.name)) {
              return `css/[name]-[hash:8].[ext]`;
            }
            return `assets/[name]-[hash:8].[ext]`;
          },

          // Strategic manual chunks for optimal loading
          manualChunks: {
            // React ecosystem
            "react-vendor": ["react", "react-dom", "react-router-dom"],

            // UI Libraries
            "ui-vendor": [
              "@radix-ui/react-accordion",
              "@radix-ui/react-alert-dialog",
              "@radix-ui/react-checkbox",
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
              "@radix-ui/react-toast",
            ],

            // Animation and Motion
            "animation-vendor": ["framer-motion"],

            // Data Management
            "data-vendor": [
              "@tanstack/react-query",
              "@tanstack/react-table",
              "zustand",
              "axios",
            ],

            // Form and Validation
            "form-vendor": [
              "react-hook-form",
              "@hookform/resolvers",
              "yup",
              "zod",
            ],

            // Icons and Assets
            "icon-vendor": [
              "lucide-react",
              "@heroicons/react",
              "react-icons",
              "boxicons",
            ],

            // Date and Time
            "date-vendor": ["dayjs", "react-day-picker"],

            // Utilities
            "utils-vendor": [
              "clsx",
              "class-variance-authority",
              "tailwind-merge",
              "js-cookie",
              "jwt-decode",
            ],

            // Heavy libraries in separate chunks
            "editor-vendor": ["@tiptap/react", "@tiptap/starter-kit"],
            "flow-vendor": ["reactflow", "dagre"],
            "excel-vendor": ["xlsx"],
            "alert-vendor": ["sweetalert2"],
          },
        },
      },

      // Enhanced CSS code splitting
      cssCodeSplit: true,

      // Asset inlining threshold (reduce HTTP requests)
      assetsInlineLimit: 4096,
    },

    // Performance optimizations
    optimizeDeps: {
      // Pre-bundle these dependencies for faster dev server
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "framer-motion",
        "lucide-react",
        "@tanstack/react-query",
        "zustand",
        "axios",
      ],

      // Exclude problematic dependencies from pre-bundling
      exclude: ["@vitejs/plugin-react-swc"],
    },

    // Server optimizations for development
    server: {
      // Enable file system caching
      fs: {
        cachedChecks: false,
      },
    },
  };
});
