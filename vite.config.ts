import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [
    // Dev server: runs Hono API routes in dev mode (localhost)
    // Keep defaults (.ts/.tsx/.css/.js/static/node_modules/etc) + add SPA & asset routes
    devServer({
      entry: 'src/index.tsx',
      exclude: [
        // — Default excludes from @hono/vite-dev-server (must keep!) —
        /.*\.css$/, /.*\.ts$/, /.*\.tsx$/, /.*\.mdx?$/,
        /^\/@.+$/, /\?t=\d+$/, /.*\.js$/, /.*\.jsx$/,
        /.*\.svelte$/, /.*\.vue$/,
        /^\/favicon\.ico$/, /^\/static\/.+/, /^\/node_modules\/.*/,
        // — Custom: SPA routes & paths using ASSETS.fetch —
        /^\/$/, // root → index.html
        /^\/cabinet\b/, // SPA client route
        /^\/index\.html/, // main HTML
        /^\/images\//, // images → Vite serves from public/
        /^\/data\//, // data files → Vite serves from public/
      ],
    }),
    // Build: compiles Hono app to _worker.js for Cloudflare Pages
    pages(),
  ],
  // Classic JSX so that React.createElement is used (same React instance as CDN)
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // In dev: resolve react/react-dom to the shim that reads window.React (CDN)
      // This prevents dual-React (CDN + node_modules) which crashes hooks
      'react-dom/client': path.resolve(__dirname, './src/react-shim.ts'),
      'react-dom': path.resolve(__dirname, './src/react-shim.ts'),
      'react': path.resolve(__dirname, './src/react-shim.ts'),
    }
  },
  optimizeDeps: {
    // Don't pre-bundle react — use our shim (window.React from CDN) instead
    exclude: ['react', 'react-dom', 'react-dom/client']
  },
  server: {
    allowedHosts: true,
    // Open browser automatically in dev
    open: true
  }
})
