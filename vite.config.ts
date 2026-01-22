import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: 'src/index.tsx'
    })
  ],
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
