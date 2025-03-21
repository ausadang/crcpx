import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: 5173,
    open: true,
    allowedHosts: ['fdce-2001-44c8-4554-5c06-a8a4-a665-c84d-a283.ngrok-free.app']
  },
})