# MCP Server - Resume Reader

一个基于 Model Context Protocol (MCP) 的简历读取服务器，提供 Word 文档读取和简历分析功能。

## 功能特性

- 🔌 **MCP 协议**: 基于 Model Context Protocol 标准构建
- 📄 **Word 文档读取**: 支持 .docx 格式的简历文档
- 🧠 **AI 集成**: 可与 Claude、GPT 等 AI 助手无缝集成
- 📡 **StdIO 传输**: 通过标准输入输出进行通信
- 🛡️ **类型安全**: 完整的 TypeScript 类型支持
- ⚡ **异步处理**: 高性能的异步文档处理
- 🚨 **错误处理**: 完善的错误处理和验证机制

## 安装

```bash
# 在项目根目录
pnpm install

# 仅安装 mcp_server 依赖
pnpm --filter @nodejs-microblog/mcp-server install
```

## 使用方法

### 作为 MCP 服务器运行

```bash
# 启动 MCP 服务器
pnpm start

# 或开发模式
pnpm dev
```

### 在 Cursor 中配置

在 `.cursor/mcp.json` 中添加配置：

```json
{
  "mcpServers": {
    "resumeReader": {
      "command": "node",
      "args": [
        "/path/to/mcp_server/dist/index.js"
      ]
    }
  }
}
```

### 作为库使用

```typescript
import { readWordFileToString } from '@nodejs-microblog/mcp-server';

// 读取 Word 文档
async function example() {
  try {
    const content = await readWordFileToString('./resume.docx');
    console.log(content);
  } catch (error) {
    console.error('读取简历失败:', error.message);
  }
}
```

## API 参考

### `readWordFileToString(filePath: string): Promise<string>`

读取 Word 文档并返回纯文本内容。

**参数:**
- `filePath`: Word 文件的绝对路径或相对路径

**返回:**
- `Promise<string>`: 解析为文档文本内容的 Promise

**异常:**
- 当文件不存在时抛出错误
- 当文件格式不支持时抛出错误

## 开发脚本

```bash
# 构建
pnpm build

# 开发模式
pnpm dev

# 监听模式
pnpm watch

# 类型检查
pnpm type-check

# 清理输出
pnpm clean
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **mammoth.js**: Word 文档解析库
- **Node.js**: 运行时环境

## 项目结构

```
mcp_server/
├── src/
│   ├── types/
│   │   └── mammoth.d.ts          # mammoth.js 类型声明
│   ├── word_reader/
│   │   └── index.ts              # 核心功能实现
│   └── index.ts                  # 主入口文件
├── dist/                         # 构建输出
├── package.json                  # 包配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 文档
```

## 许可证

MIT 