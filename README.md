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

## 🛠 技术栈

- **运行时**: Node.js
- **语言**: TypeScript
- **包管理器**: pnpm
- **开发工具**: nodemon, ts-node
- **构建工具**: TypeScript Compiler

## 📁 项目结构

```
nodejs-sample-microblog/
├── src/                 # 源代码目录
│   └── index.ts        # 项目入口文件
├── dist/               # 编译输出目录
├── .cursor/            # Cursor 配置
│   └── rules/          # Cursor 规则文件
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── .gitignore          # Git 忽略文件
└── README.md           # 项目说明
```

## 📝 变更记录

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
