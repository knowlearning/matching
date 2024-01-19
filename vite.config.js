import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: { port: 6061 },
  plugins: [
    vue(),
    basicSsl()
  ],
  build: {
    sourcemap: true,
    devToolsEnabled: true
  }
})
