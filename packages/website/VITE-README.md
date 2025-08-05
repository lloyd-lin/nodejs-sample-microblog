# Vite 配置说明

本项目现在支持两种构建工具：
- **Webpack** (原有配置)
- **Vite** (新增配置)

## Vite 优势

1. **更快的启动速度** - 冷启动时间大幅减少
2. **更快的热更新** - 模块热替换速度更快
3. **更简单的配置** - 开箱即用的配置
4. **更好的开发体验** - 更快的构建和预览

## 使用方法

### 开发环境

```bash
# 使用 Vite 启动开发服务器
npm run vite:dev

# 或者使用原有的 Webpack
npm run dev
```

### 生产构建

```bash
# 使用 Vite 构建生产版本
npm run vite:build

# 或者使用原有的 Webpack
npm run build
```

### 预览生产构建

```bash
# 预览 Vite 构建结果
npm run vite:preview
```

## 配置对比

### 端口配置
- **Webpack**: 3001 端口
- **Vite**: 3000 端口

### 代理配置
两者都支持相同的代理配置：
- `/api` -> `http://localhost:3001`
- `welcome.lgforest.fun` -> `http://localhost:3001/api`

### 路径别名
- `@` -> `src/`
- `@microblog` -> `../../packages`

### 输出结构
Vite 构建输出与 Webpack 保持一致：
- `js/[name].[hash].js` - JavaScript 文件
- `css/[name].[hash].css` - CSS 文件  
- `images/[name].[hash].[ext]` - 图片资源

## 环境变量

Vite 使用 `VITE_` 前缀的环境变量：

- `VITE_APP_TITLE` - 应用标题
- `VITE_API_BASE_URL` - API 基础URL
- `VITE_APP_ENV` - 应用环境

## 注意事项

1. **同时运行**：可以同时运行 Webpack 和 Vite 开发服务器（不同端口）
2. **构建输出**：两种构建工具的输出目录都是 `dist/`
3. **依赖管理**：Vite 会自动处理依赖预构建
4. **TypeScript**：Vite 原生支持 TypeScript，无需额外配置

## 迁移建议

1. **开发阶段**：建议使用 Vite 进行开发，享受更快的启动和热更新
2. **生产构建**：可以对比两种构建工具的输出，选择更适合的
3. **渐进迁移**：可以逐步将团队迁移到 Vite，保持 Webpack 作为备选方案

## 故障排除

### 常见问题

1. **端口冲突**：如果 3000 端口被占用，Vite 会自动选择下一个可用端口
2. **依赖问题**：如果遇到依赖相关错误，尝试删除 `node_modules/.vite` 缓存目录
3. **代理问题**：确保后端服务在 3001 端口运行

### 调试命令

```bash
# 清理 Vite 缓存
rm -rf node_modules/.vite

# 重新安装依赖
npm install

# 检查端口占用
lsof -i :3000
lsof -i :3001
``` 