import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Lets us import from '@shared/types' instead of '../../shared/types'
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
