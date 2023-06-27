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
    "process.env.NODE_ENV": "'production'",
  },
  root: "frontend",
  build: {
    outDir: '../js',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'frontend/main.ts'),
      name: 'WebTexting',
      // the proper extensions will be added
      fileName: 'webtexting-thread',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ['vue'],
      // output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    },
  },
})


// export default defineConfig({
//   build: {
//     outDir: '../js',
//     lib: {
//       // Could also be a dictionary or array of multiple entry points
//       entry: resolve(__dirname, 'frontend/main.ts'),
//       name: 'WebTexting',
//       // the proper extensions will be added
//       fileName: 'webtexting-thread',
//     },
//     rollupOptions: {
//       // make sure to externalize deps that shouldn't be bundled
//       // into your library
//       external: ['vue'],
//       output: {
//         // Provide global variables to use in the UMD build
//         // for externalized deps
//         globals: {
//           vue: 'Vue',
//         },
//       },
//     },
//   },
// })
