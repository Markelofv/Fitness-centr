import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- добавить импорт

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- добавить плагин
  ],
})