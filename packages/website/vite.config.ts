import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    publicDir: 'public',
    plugins: [
      react()
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@microblog': resolve(__dirname, '../../packages')
      }
    },
    
    server: {
      port: 3000,
      host: true,
      open: true,
      proxy: {
        // 代理本地/api路径到后端服务
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[Local API Proxy] ${req.method} ${req.url} -> http://localhost:3001${req.url}`)
            })
            proxy.on('error', (err, req, res) => {
              console.error('[Local API Proxy Error]', err.message)
            })
          }
        },
        // 代理所有对welcome.lgforest.fun的请求到本地API
        '^.*welcome\\.lgforest\\.fun': {
          target: 'http://localhost:3001/api',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/.*welcome\.lgforest\.fun/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[Domain Proxy] ${req.method} ${req.url} -> http://localhost:3001/api`)
              proxyReq.setHeader('Host', 'localhost:3001')
            })
            proxy.on('error', (err, req, res) => {
              console.error('[Domain Proxy Error]', err.message)
            })
          }
        }
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'public/index.html')
        },
        output: {
          // 保持与webpack相似的输出结构
          entryFileNames: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
          chunkFileNames: isProduction ? 'js/[name].[hash].js' : 'js/[name].js',
          assetFileNames: (assetInfo) => {
            if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(assetInfo.name || '')) {
              return isProduction ? `images/[name].[hash][extname]` : `images/[name][extname]`
            }
            if (/\.(css)$/i.test(assetInfo.name || '')) {
              return isProduction ? `css/[name].[hash][extname]` : `css/[name][extname]`
            }
            return isProduction ? `assets/[name].[hash][extname]` : `assets/[name][extname]`
          }
        }
      }
    },
    
    css: {
      devSourcemap: !isProduction
    },
    
    // 优化选项
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    
    // 定义环境变量
    define: {
      __DEV__: !isProduction
    }
  }
}) 