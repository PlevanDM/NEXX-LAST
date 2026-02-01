import pages from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [pages()],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    allowedHosts: true
  }
})
