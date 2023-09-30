import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend', import.meta.url))
    }
  },
  define: {
    "process.env.NODE_ENV": "'development'",
  },
  root: "frontend",
  build: {
    outDir: '../js',
    sourcemap: true,
    minify:false,
    lib: {
      entry: resolve(__dirname, 'frontend/main.ts'),
      name: 'WebTexting',
      fileName: 'webtexting',
    },
  },
})
