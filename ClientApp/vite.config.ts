import { fileURLToPath, URL } from 'url'
import fs from 'fs'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`

const certificateArg = process.argv.map((arg) => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0]
const certificateName = certificateArg ? certificateArg.groups?.value : 'VueViteTemplate'

if (!certificateName) {
  console.error(
    'Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.'
  )
  process.exit(-1)
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`)
const keyFilePath = path.join(baseFolder, `${certificateName}.key`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath)
    },
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7096',
        secure: false,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
