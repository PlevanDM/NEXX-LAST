import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/static', // Кладем собранный JS в папку static внутри dist
    emptyOutDir: false, // Не очищаем dist, там уже может быть сервер
    rollupOptions: {
      input: 'src/client.tsx',
      output: {
        entryFileNames: 'client-v2.js', // Фиксированное имя, чтобы проще подключать
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
