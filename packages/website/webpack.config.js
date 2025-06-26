const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '随影而来 - 个人作品集',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/favicon*.svg',
          to: '[name][ext]',
        },
      ],
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname),
        publicPath: '/',
        serveIndex: true,
      },
    ],
    compress: true,
    port: 3000,
    hot: true,
    proxy: [
      // 代理本地/api路径到后端服务
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log(`[Local API Proxy] ${req.method} ${req.url} -> http://localhost:3001${req.url}`);
        },
        onError: (err, req, res) => {
          console.error('[Local API Proxy Error]', err.message);
        },
      },
      // 代理所有对welcome.lgforest.fun的请求到本地API
      {
        context: (pathname, req) => {
          // 检查请求头中的Host或者URL中包含welcome.lgforest.fun
          const host = req.headers.host;
          const referer = req.headers.referer;
          const origin = req.headers.origin;
          
          return (host && host.includes('welcome.lgforest.fun')) ||
                 (referer && referer.includes('welcome.lgforest.fun')) ||
                 (origin && origin.includes('welcome.lgforest.fun')) ||
                 pathname.includes('welcome.lgforest.fun');
        },
        target: 'http://localhost:3001/api',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^.*welcome\\.lgforest\\.fun': '',
          '^/welcome\\.lgforest\\.fun': '',
        },
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log(`[Domain Proxy] ${req.method} ${req.url} -> http://localhost:3001/api`);
          // 修改Host头部
          proxyReq.setHeader('Host', 'localhost:3001');
        },
        onError: (err, req, res) => {
          console.error('[Domain Proxy Error]', err.message);
        },
      },
    ],
  },
}; 