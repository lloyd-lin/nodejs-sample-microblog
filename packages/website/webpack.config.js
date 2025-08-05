const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 自定义插件：在HTML中替换favicon路径为带哈希的版本
class FaviconHashPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('FaviconHashPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'FaviconHashPlugin',
        (data, cb) => {
          if (compiler.options.mode === 'production') {
            // 获取所有带哈希的资源
            const assets = compilation.assets;
            const assetNames = Object.keys(assets);
            
            // 查找带哈希的favicon文件
            const faviconMap = {};
            assetNames.forEach(assetName => {
              if (assetName.startsWith('images/favicon') && assetName.endsWith('.svg')) {
                const originalName = assetName.replace(/^images\//, '').replace(/\.[a-f0-9]+\.svg$/, '.svg');
                faviconMap[originalName] = '/' + assetName;
              }
            });
            
            // 替换HTML中的favicon路径
            let html = data.html;
            Object.keys(faviconMap).forEach(originalName => {
              // 替换 link 标签中的 href
              const hrefRegex = new RegExp(`href="/${originalName}"`, 'g');
              html = html.replace(hrefRegex, `href="${faviconMap[originalName]}"`);
              
              // 替换 meta 标签中的 content (Open Graph, Twitter)
              const contentRegex = new RegExp(`content="/${originalName}"`, 'g');
              html = html.replace(contentRegex, `content="${faviconMap[originalName]}"`);
            });
            
            data.html = html;
          }
          cb(null, data);
        }
      );
    });
  }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    mode: isProduction ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'bundle.js',
      assetModuleFilename: isProduction ? 'images/[name].[contenthash][ext]' : 'assets/[name][ext]',
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
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: '随影而来 - 个人作品集',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/favicon*.svg',
            to: isProduction ? 'images/[name].[contenthash][ext]' : '[name][ext]',
          },

        ],
      }),
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[id].[contenthash].css',
        }),
        new FaviconHashPlugin()
      ] : []),
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
      port: 3001,
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
}; 