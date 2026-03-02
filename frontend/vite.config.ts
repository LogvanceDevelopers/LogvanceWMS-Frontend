import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Yerel backend (Postman'da calisiyorsa): https://localhost:5001
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
})

