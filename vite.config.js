import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/mkw-random-map-selector/', // GitHub Pages base path
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['mkw-favicon.svg'],
      manifest: {
        name: 'Mario Kart World Random Map Selector',
        short_name: 'MKW Selector',
        description: 'Random circuit selector for Mario Kart World multiplayer sessions',
        theme_color: '#FF0000',
        background_color: '#0066CC',
        display: 'standalone',
        start_url: '/mkw-random-map-selector/',
        icons: [
          {
            src: 'mkw-favicon.svg',
            sizes: '32x32',
            type: 'image/svg+xml'
          },
          {
            src: 'mkw-favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'mkw-favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
