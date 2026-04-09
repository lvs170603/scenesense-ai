import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/upload': 'http://127.0.0.1:5000',
      '/caption': 'http://127.0.0.1:5000',
      '/translate': 'http://127.0.0.1:5000',
      '/voice': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000',
      '/static': 'http://127.0.0.1:5000',
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/upload': 'http://127.0.0.1:5000',
      '/caption': 'http://127.0.0.1:5000',
      '/translate': 'http://127.0.0.1:5000',
      '/voice': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000',
      '/static': 'http://127.0.0.1:5000',
    },
  },
})
