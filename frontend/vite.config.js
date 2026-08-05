import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mi-proyecto-autos.onrender.com', // Apunta al backend en Render
        changeOrigin: true,
        secure: false,
      },
    },
  },
})