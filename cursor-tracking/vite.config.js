import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "primevue/resources/themes/lara-light-blue/theme.css";
          @import "primevue/resources/primevue.min.css";
          @import "primeicons/primeicons.css";
        `
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
})