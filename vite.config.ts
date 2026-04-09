import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'pwa-192x192.png', 
        'pwa-512x512.png',
        'manifest.json'
      ],
      manifest: false,
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff,woff2}'
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(
        __dirname, 
        './src'
      ),
    },
  },
  server: {
    allowedHosts: ['all'],
    hmr: {
      clientPort: 443,
    },
  },
});
