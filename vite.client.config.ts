import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  build: {
    outDir: 'dist/static',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        database: 'src/client.tsx',
        landing: 'src/landing-client.tsx'
      },
      output: {
        entryFileNames: (chunkInfo) => chunkInfo.name === 'database' ? 'client-v2.js' : 'landing.min.js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-dom/client': path.resolve(__dirname, './src/react-shim.ts'),
      'react-dom': path.resolve(__dirname, './src/react-shim.ts'),
      'react': path.resolve(__dirname, './src/react-shim.ts')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
