import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.108.51.96:8000', // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Rewrite path
      }
    }
  }
})
