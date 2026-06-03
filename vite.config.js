import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

let pwaPlugin = null
try {
  const { VitePWA } = await import('vite-plugin-pwa')
  pwaPlugin = VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.openweathermap\.org\/.*$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'openweather-api',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
      ],
    },
  })
} catch {
  pwaPlugin = null
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwaPlugin].filter(Boolean),
  server: {
    port: 3000,
    host: true,
  },
}) 
