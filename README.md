# Node.js Sample Microblog

一个基于 TypeScript 和 Node.js 的示例微博项目。

## 📋 项目简介

这是一个用 TypeScript 构建的 Node.js 微博应用项目，采用现代化的开发工具链和最佳实践。

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式（热重载）
```bash
pnpm run dev
```

### 构建项目
```bash
pnpm run build
```

### 运行生产版本
```bash
pnpm start
```

### 其他脚本
```bash
pnpm run clean       # 清理构建目录
pnpm run type-check  # 类型检查
```

### Monorepo 管理
```bash
pnpm build:all       # 构建所有包
pnpm clean:all       # 清理所有包的构建目录
pnpm install:all     # 安装所有包的依赖
pnpm dev:website     # 开发模式运行 website 包
pnpm build:website   # 构建 website 包
pnpm dev:mcp         # 开发模式运行 mcp_server 包
pnpm build:mcp       # 构建 mcp_server 包
```

## 🛠 技术栈

- **运行时**: Node.js
- **语言**: TypeScript
- **包管理器**: pnpm
- **开发工具**: nodemon, ts-node
- **构建工具**: TypeScript Compiler

## 📁 项目结构

```
nodejs-sample-microblog/
├── packages/            # Monorepo 包目录
│   └── website/        # Website 前端包
│       ├── src/        # Website 源代码
│       ├── dist/       # Website 编译输出
│       ├── package.json # Website 包配置
│       └── tsconfig.json # Website TypeScript 配置
├── mcp_server/         # MCP Server 包
│   ├── src/            # MCP Server 源代码
│   ├── dist/           # MCP Server 编译输出
│   ├── package.json    # MCP Server 包配置
│   ├── tsconfig.json   # MCP Server TypeScript 配置
│   └── README.md       # MCP Server 文档
├── src/                # 根项目源代码目录
│   └── index.ts        # 根项目入口文件
├── dist/               # 根项目编译输出目录
├── .cursor/            # Cursor 配置
│   └── rules/          # Cursor 规则文件
├── pnpm-workspace.yaml # pnpm 工作区配置
├── tsconfig.base.json  # 共享 TypeScript 基础配置
├── package.json        # 根项目配置
├── tsconfig.json       # 根 TypeScript 配置
├── .gitignore          # Git 忽略文件
└── README.md           # 项目说明
```

## 📝 变更记录

### 2024-06-18
- **Monorepo 配置**:
  - 文件: `pnpm-workspace.yaml`, `package.json`
  - 内容: 配置 pnpm 工作区，添加 monorepo 管理脚本
  - 影响: 支持多包项目架构，便于模块化开发

- **Website 包创建**:
  - 文件: `packages/website/package.json`, `packages/website/tsconfig.json`
  - 内容: 创建第一个子包 @microblog/website，配置 TypeScript 和 React 环境
  - 影响: 建立网站前端模块，为后续功能开发打基础

- **个人主页实现**:
  - 文件: `packages/website/src/`, `packages/website/webpack.config.js`, `packages/website/public/index.html`
  - 内容: 实现完整的极简风格个人介绍主页，包含 Header、Hero、About、Skills、Projects、Contact、Footer 组件
  - 技术栈: React + TypeScript + Ant Design + Webpack
  - 特性: 响应式设计、平滑滚动、微动画、极简美学
  - 影响: 提供了完整的个人品牌展示平台，支持快速定制和部署

- **宇宙星空背景特效**:
  - 文件: `packages/website/src/components/StarField.tsx`
  - 内容: 使用 HTML5 Canvas 实现宇宙星空背景，包含 200+ 动态星星粒子、跟随鼠标的交互连线、星星闪烁动画
  - 技术特性: 渐变宇宙背景、粒子物理系统、鼠标交互响应、性能优化的动画循环
  - 视觉效果: 深空渐变背景、动态星星群、鼠标引力场、粒子连线、毛玻璃模糊效果
  - 影响: 大幅提升用户体验和视觉冲击力，创造沉浸式的太空主题界面

### 2024-06-19
- **MCP Server 包创建**:
  - 文件: `mcp_server/package.json`, `mcp_server/tsconfig.json`, `tsconfig.base.json`
  - 内容: 创建 Word 文档读取服务包，基于 mammoth.js 实现 .docx 文件解析
  - 技术栈: TypeScript + mammoth.js + Node.js
  - 功能: `readWordFileToString()` API，支持异步文档读取和错误处理
  - 影响: 扩展项目功能模块，提供文档处理能力

- **构建系统完善**:
  - 文件: `pnpm-workspace.yaml`, `package.json`, `tsconfig.base.json`
  - 内容: 添加 mcp_server 到工作区，新增构建脚本（dev:mcp, build:mcp, install:all）
  - 配置: 创建共享 TypeScript 基础配置，统一编译选项和类型定义
  - 影响: 优化 monorepo 管理，提供统一的开发和构建流程

- **类型定义优化**:
  - 文件: `mcp_server/src/types/mammoth.d.ts`
  - 内容: 为 mammoth.js 创建完整的 TypeScript 类型定义
  - 特性: MammothResult、MammothOptions 接口，全局模块声明
  - 影响: 提供完整的类型安全支持，改善开发体验

### 2024-06-18
- **项目初始化**:
  - 文件: `package.json`
  - 内容: 使用 pnpm 初始化项目，设置基本信息
  - 影响: 建立项目基础结构

- **Git 配置**:
  - 文件: `.gitignore`
  - 内容: 配置 Node.js 项目的 Git 忽略规则
  - 影响: 防止不必要的文件被提交到版本控制

- **TypeScript 配置**:
  - 文件: `tsconfig.json`, `package.json`
  - 内容: 初始化 TypeScript 配置，安装相关依赖（typescript, @types/node, ts-node, nodemon, rimraf）
  - 影响: 支持 TypeScript 开发、热重载和构建流程

- **项目结构**:
  - 文件: `src/index.ts`
  - 内容: 创建项目入口文件，包含示例代码和导出函数
  - 影响: 建立基本的代码结构和开发起点

- **开发脚本**:
  - 文件: `package.json`
  - 内容: 配置 build、dev、start、clean、type-check 等开发脚本
  - 影响: 提供完整的开发工作流

- **Cursor 规则**:
  - 文件: `.cursor/rules/update-readme.mdc`
  - 内容: 创建自动更新 README 变更记录的规则
  - 影响: 确保项目文档始终保持最新状态

## 📄 许可证

ISC
