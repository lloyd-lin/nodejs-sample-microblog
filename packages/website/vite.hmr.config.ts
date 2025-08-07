import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 专门的热更新配置
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@microblog': resolve(__dirname, '../../packages')
    }
  },
  
  server: {
    port: 3000,
    host: '0.0.0.0', // 允许外部访问
    open: true,
    
    // 详细的热更新配置
    hmr: {
      port: 24678,
      overlay: true,
      // 客户端重连配置
      clientPort: 24678,
      // 热更新协议
      protocol: 'ws'
    },
    
    // 文件监听配置
    watch: {
      usePolling: false,
      interval: 100,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/test-results/**',
        '**/*.log',
        '**/temp/**'
      ]
    },
    
    // 开发服务器优化
    cors: true,
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[HMR API Proxy] ${req.method} ${req.url} -> http://localhost:3001${req.url}`)
          })
          proxy.on('error', (err, req, res) => {
            console.error('[HMR API Proxy Error]', err.message)
          })
        }
      }
    }
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'antd',
      'echarts',
      'd3',
      'three',
      'zustand'
    ],
    force: true,
    // 排除不需要预构建的包
    exclude: []
  },
  
  // CSS热更新优化
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  // 定义环境变量
  define: {
    __DEV__: true,
    __HMR__: true
  }
}) 