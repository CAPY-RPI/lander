import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Setting base to '/' as we're using React Router for /app routing,
    // and '/app/' was breaking asset resolution from the public folder.
    base: '/',
    server: {
      port: 5173,
      proxy: apiTarget
        ? {
            '/api': {
              target: apiTarget,
              changeOrigin: true,
              secure: false,
              xfwd: true,
              cookieDomainRewrite: 'localhost',
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  proxyReq.setHeader('X-Dev-Proto', 'http')
                  proxyReq.setHeader('X-Dev-Host', 'localhost:5173')
                })
              },
            },
          }
        : undefined,
    },
  }
})
