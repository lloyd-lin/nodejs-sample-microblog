# Microblog Website

基于 React + TypeScript 的个人作品集网站前端应用。

## 📋 项目概述

这是一个现代化的个人作品集网站，展示专业技能、工作经历和项目作品。采用响应式设计，支持多种设备访问。

## 🛠 技术栈

- **框架**: React 19.x + TypeScript 5.x
- **构建工具**: Webpack 5.x
- **UI组件**: Ant Design 5.x
- **样式**: CSS + CSS Modules
- **3D渲染**: Three.js
- **markdown渲染**: react-markdown + rehype
- **包管理**: pnpm

## ✨ 核心功能

- 🎨 **响应式设计**: 支持桌面端和移动端
- 🌟 **3D星空背景**: Three.js 实现的动态星空效果
- 📱 **导航菜单**: 智能激活状态，跟随页面滚动
- 🤖 **聊天机器人**: 集成AI聊天功能
- 🔝 **回到顶部**: 平滑滚动体验
- 📊 **项目展示**: markdown支持的项目详情
- 📧 **联系方式**: 多种社交媒体链接

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 在项目根目录
pnpm install

# 或仅安装前端依赖
pnpm --filter @microblog/website install
```

### 本地开发

```bash
# 开发模式
pnpm --filter @microblog/website dev

# 或
cd packages/website
pnpm dev
```

访问：http://localhost:3000

### 生产构建

```bash
# 构建
pnpm --filter @microblog/website build

# 预览构建结果
pnpm --filter @microblog/website start
```

## 📁 项目结构

```
packages/website/
├── src/
│   ├── components/           # React 组件
│   │   ├── Header.tsx       # 导航头部
│   │   ├── Hero.tsx         # 首页英雄区
│   │   ├── About.tsx        # 关于我
│   │   ├── Skills.tsx       # 技能展示
│   │   ├── Projects.tsx     # 项目展示
│   │   ├── Contact.tsx      # 联系方式
│   │   ├── Footer.tsx       # 页脚
│   │   ├── StarField.tsx    # 3D星空背景
│   │   └── ChatbotBubble.tsx # 聊天机器人
│   ├── assets/              # 静态资源
│   │   └── profile.png      # 头像图片
│   ├── styles/              # 样式文件
│   │   └── global.css       # 全局样式
│   ├── types/               # TypeScript 类型
│   │   └── assets.d.ts      # 资源模块声明
│   ├── App.tsx              # 根组件
│   └── index.tsx            # 应用入口
├── public/                   # 公共资源
│   ├── index.html           # HTML模板
│   ├── favicon.svg          # 网站图标
│   ├── favicon-16x16.svg
│   └── favicon-32x32.svg
├── dist/                    # 构建输出
├── webpack.config.js        # Webpack配置
├── tsconfig.json           # TypeScript配置
├── package.json
└── README.md
```

## 🔄 最近重要更新

### 🎯 资源管理优化 (2025-01)

#### 1. 哈希文件名支持
- ✅ 所有资源文件（JS、CSS、图片）支持contenthash
- ✅ 实现最佳缓存策略和long-term caching
- ✅ 自动生成带哈希的文件名

#### 2. 构建产物目录分类
```
dist/
├── js/                    # JavaScript文件
│   └── main.[hash].js
├── css/                   # 样式文件
│   └── main.[hash].css
├── images/                # 图片资源
│   ├── profile.[hash].png
│   └── favicon.[hash].svg
└── index.html             # 入口文件
```

#### 3. 图片资源管理
- ✅ JS中的图片通过import导入，自动应用哈希
- ✅ 支持TypeScript类型检查
- ✅ webpack自动处理图片优化

#### 4. 自定义Webpack插件
创建`FaviconHashPlugin`插件：
- ✅ 自动替换HTML中的favicon路径为带哈希版本
- ✅ 支持Open Graph和Twitter meta标签
- ✅ 只在生产环境运行

#### 5. CORS跨域支持
- ✅ nginx配置支持`*.sealoshzh.site`域名
- ✅ 使用map指令实现高效域名匹配
- ✅ 分层CORS策略：静态资源、API路由、健康检查

### 🎨 UI/UX 优化

#### 1. Header组件增强
- ✅ 动态字体颜色：根据滚动状态自适应
- ✅ 菜单激活状态：自动跟随页面section
- ✅ 焦点效果优化：区分focus、active、selected状态

#### 2. Hero组件升级
- ✅ 真实头像：替换文字占位为profile.png
- ✅ 悬停动画：头像缩放和阴影效果
- ✅ 响应式设计：移动端适配

#### 3. 交互功能
- ✅ 回到顶部按钮：全局平滑滚动
- ✅ 滚动监听：智能菜单激活状态
- ✅ 无障碍支持：键盘导航和tabIndex

## 🔧 开发脚本

```bash
# 开发服务器
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm start

# 清理构建文件
pnpm clean

# TypeScript类型检查
pnpm type-check
```

## 🐳 Docker部署

### 基础部署
```bash
# 构建Docker镜像
docker build -t microblog-website .

# 运行容器
docker run -p 80:80 microblog-website
```

### 详细配置
参考以下文档：
- [Docker部署指南](./README-Docker.md)
- [Sealos部署指南](./SEALOS-README.md)

## 🌐 环境配置

### 开发环境
- webpack-dev-server自动代理API请求到后端
- 热重载支持
- 支持本地API调试

### 生产环境
- nginx静态文件服务
- gzip压缩
- 静态资源长期缓存
- CORS跨域支持

## 🔗 API集成

### 后端代理
开发环境自动代理以下请求：
- `/api/*` → `http://localhost:3001`
- `welcome.lgforest.fun` → 本地API

### 聊天机器人
集成AI聊天功能，支持：
- 实时对话
- markdown渲染
- 代码高亮

## 📈 性能优化

### 构建优化
- 资源哈希：最佳缓存策略
- 目录分类：便于CDN配置
- gzip压缩：减少传输大小

### 运行时优化
- 图片懒加载
- 平滑滚动
- 防抖优化

## 🤝 与后端对接

### API基地址
- 开发环境：`http://localhost:3001/api`
- 生产环境：通过nginx反向代理

### 认证方式
支持JWT Bearer Token认证（如果需要）

## 📝 开发注意事项

### 图片资源
- 将图片放在`src/assets/`目录
- 通过`import`导入，自动应用哈希
- 支持png、jpg、jpeg、gif、svg、ico格式

### 样式文件
- 使用CSS Modules或全局样式
- 生产环境自动提取到独立CSS文件
- 支持自动前缀和压缩

### TypeScript
- 严格类型检查
- 资源模块类型声明
- IDE智能提示支持

---

## 🔗 相关链接

- [后端API文档](../backend/README.md)
- [项目整体说明](../../README.md)
- [Docker部署文档](./DOCKER-README.md) 