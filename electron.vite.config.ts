import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tailwindcss from './node_modules/@tailwindcss/vite/dist/index.mjs'

import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'src/main/db/migrations',
            dest: '.'
          }
        ]
      }),
      externalizeDepsPlugin()
    ]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
