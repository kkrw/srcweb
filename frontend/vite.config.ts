import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SRC Web Application',
        short_name: 'SRC Web',
        description: 'Silumation RPG construction Web版',
        start_url: '/',
        display: 'standalone',
        background_color: '#242424',
        theme_color: '#646cff',
        icons: [
          {
            "src": "/vite.svg",
            "sizes": "any",
            "type": "image/svg+xml",
            "purpose": "any maskable"
          },
          {
            "src": "favicon.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
          },
          {
            "src": "logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "logo512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ],
})
