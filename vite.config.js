import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    // Same-origin API in dev, mirroring the /api rewrite in vercel.json.
    proxy: {
      // /api/consult-request is our own Vercel function (api/), so it is not forwarded; use `npx vercel dev` to run it locally.
      '^/api/(?!consult-request)': { target: 'https://medionic-apis.onrender.com', changeOrigin: true },
    },
  },
})
