import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the Vercel functions in api/ on the Vite dev server, so the site's forms work with
// `npm run dev` and not only on Vercel. Put SMTP_USER / SMTP_PASS in a .env.local file
// (or run `npx vercel env pull`) so the functions can actually send email locally.
function localVercelApi() {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      const { root, mode } = server.config
      for (const [key, value] of Object.entries(loadEnv(mode, root, ''))) {
        if (process.env[key] === undefined) process.env[key] = value
      }
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        server.config.logger.warn(
          '[api] SMTP_USER / SMTP_PASS are not set, so form submissions cannot be emailed locally. ' +
            'Add them to .env.local (see server/mail.js).'
        )
      }

      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([\w-]+)\/?(?:\?|$)/)
        if (!match) return next()
        const file = path.join(root, 'api', `${match[1]}.js`)
        if (!fs.existsSync(file)) return next()

        let body = ''
        for await (const chunk of req) body += chunk
        req.body = body

        const vres = {
          setHeader: (k, v) => res.setHeader(k, v),
          status(code) {
            res.statusCode = code
            return vres
          },
          json(payload) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
            return vres
          },
          send(payload) {
            res.end(payload)
            return vres
          },
        }

        try {
          const mod = await server.ssrLoadModule(file)
          await mod.default(req, vres)
        } catch (err) {
          server.config.logger.error(`[api] ${match[1]} failed: ${err.stack || err}`)
          if (!res.headersSent) vres.status(500).json({ success: false, message: `Local API error: ${err.message}` })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localVercelApi()],
  server: {
    port: 3001,
    // Same-origin API in dev, mirroring the /api rewrite in vercel.json.
    proxy: {
      // /api/consult-request and /api/lead are our own Vercel functions (api/), served by localVercelApi above.
      '^/api/(?!consult-request|lead)': { target: 'https://medionic-apis.onrender.com', changeOrigin: true },
    },
  },
})
