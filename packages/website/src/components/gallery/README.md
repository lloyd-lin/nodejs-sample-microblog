# WorkflowCanvas - FlowGram.AI 工作流编辑器

基于字节跳动开源的 FlowGram.AI 工作流引擎实现的专业级工作流编辑器组件。

## 🎯 项目特色

### ✨ 基于官方 FlowGram.AI
- 使用 `@flowgram.ai/free-layout-editor` 核心引擎
- 集成 `@flowgram.ai/minimap-plugin` 小地图功能
- 完全遵循 FlowGram.AI 官方 API 规范

### 🔧 核心功能特性

#### 🎨 专业节点类型
- **开始节点**: 工作流入口点，支持配置标题和描述
- **处理节点**: 执行业务逻辑，支持脚本配置
- **条件节点**: 条件判断分支，支持表达式配置
- **自定义节点**: 灵活的自定义功能节点
- **结束节点**: 工作流出口点

#### ⚡ 实时交互体验
- 拖拽式节点添加和连接
- 实时工作流状态监控
- 自动布局和手动调整
- 撤销/重做操作支持

#### 🎯 高级编辑功能
- 节点表单验证和配置
- 可视化连线管理
- 小地图导航
- 画布缩放和平移
- 背景网格显示

#### 💾 数据管理
- JSON 格式工作流保存/导出
- 完整的工作流状态持久化
- 实时变更日志记录

## 🚀 使用方法

### 基本集成

```tsx
import WorkflowCanvas from './components/gallery/WorkflowCanvas';

function App() {
  return (
    <div>
      <WorkflowCanvas />
    </div>
  );
}
```

### 节点操作指南

1. **添加节点**: 从左侧面板拖拽节点模板到画布
2. **连接节点**: 拖拽节点端口创建连线
3. **编辑节点**: 双击节点或在节点内编辑表单
4. **删除元素**: 选中后按 Delete 键或右键删除

### 工具栏功能

- **放大/缩小**: 控制画布缩放级别
- **适应画布**: 自动调整视图以显示所有内容
- **自动布局**: 智能排列节点位置
- **撤销/重做**: 操作历史管理

### 控制面板

- **执行工作流**: 模拟工作流执行过程
- **保存工作流**: 导出 JSON 格式文件
- **重置工作流**: 恢复到初始状态

## 🛠️ 技术实现

### 核心依赖
```json
{
  "@flowgram.ai/free-layout-editor": "^0.2.22",
  "@flowgram.ai/minimap-plugin": "^0.2.22",
  "antd": "^5.26.1",
  "react": "^19.1.0"
}
```

### 架构设计

#### 节点注册系统
```typescript
const nodeRegistries: WorkflowNodeRegistry[] = [
  {
    type: 'start',
    meta: {
      isStart: true,
      deleteDisable: true,
      defaultPorts: [{ type: 'output' }],
    },
    formMeta: {
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (value ? undefined : '标题是必填项'),
      },
      render: () => (/* 表单渲染 */),
    },
    component: StartNode,
  },
  // 更多节点类型...
];
```

#### 数据结构
```typescript
interface WorkflowJSON {
  nodes: Array<{
    id: string;
    type: string;
    meta: {
      position: { x: number; y: number };
    };
    data: Record<string, any>;
  }>;
  edges: Array<{
    sourceNodeID: string;
    targetNodeID: string;
  }>;
}
```

### 组件架构

#### 主要组件
- **FlowgramEditor**: 主编辑器容器
- **NodeAddPanel**: 节点模板面板
- **Tools**: 工具栏组件
- **ControlPanel**: 控制面板
- **ExecutionLog**: 执行日志
- **Minimap**: 小地图导航

#### 自定义节点
```typescript
const CustomNode: React.FC<any> = (props) => {
  const { form } = useNodeRender();
  
  return (
    <WorkflowNodeRenderer className="flowgram-custom-node" node={props.node}>
      <div className="node-content">
        {form?.render()}
      </div>
    </WorkflowNodeRenderer>
  );
};
```

## 🎨 样式定制

### CSS 类名规范
- `.flowgram-*`: FlowGram 相关组件
- `.node-*`: 节点相关样式
- `.panel-*`: 面板相关样式
- `.form-*`: 表单相关样式

### 主题定制
```css
.flowgram-start-node {
  border-color: #52c41a;
}

.flowgram-start-node .node-header {
  background: #52c41a;
}
```

## 📱 响应式支持

- **桌面端**: 完整功能体验
- **平板端**: 优化的触摸交互
- **移动端**: 简化的界面布局

## 🔧 高级配置

### 编辑器选项
```typescript
const editorProps = {
  background: true,        // 显示背景网格
  readonly: false,         // 编辑模式
  initialData,            // 初始数据
  nodeRegistries,         // 节点注册表
  nodeEngine: {
    enable: true,         // 启用节点引擎
  },
  history: {
    enable: true,         // 启用历史记录
    enableChangeNode: true, // 监听节点变化
  },
};
```

### 事件监听
```typescript
// 监听内容变化
document.onContentChange((event) => {
  switch (event.type) {
    case WorkflowContentChangeType.ADD_NODE:
      console.log('节点已添加');
      break;
    case WorkflowContentChangeType.DELETE_NODE:
      console.log('节点已删除');
      break;
  }
});
```

## 🚀 扩展开发

### 添加自定义节点类型

1. **定义节点组件**
```typescript
const MyCustomNode: React.FC<any> = (props) => {
  const { form } = useNodeRender();
  return (
    <WorkflowNodeRenderer className="my-custom-node" node={props.node}>
      {/* 自定义内容 */}
    </WorkflowNodeRenderer>
  );
};
```

2. **注册节点类型**
```typescript
{
  type: 'my-custom',
  meta: {
    defaultPorts: [{ type: 'input' }, { type: 'output' }],
  },
  formMeta: {
    // 表单配置
  },
  component: MyCustomNode,
}
```

3. **添加到模板面板**
```typescript
{ 
  type: 'my-custom', 
  label: '我的节点', 
  icon: <CustomIcon />, 
  description: '自定义功能节点' 
}
```

### 自定义样式主题
```css
.my-custom-node {
  border-color: #custom-color;
}

.my-custom-node .node-header {
  background: #custom-color;
}
```

## 📊 性能优化

- **虚拟化渲染**: 大型工作流的性能优化
- **懒加载**: 按需加载组件和资源
- **内存管理**: 自动清理事件监听器
- **缓存策略**: 智能缓存计算结果

## 🔍 调试和开发

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 调试技巧
- 使用浏览器开发者工具查看节点数据
- 监听 `onContentChange` 事件调试状态变化
- 使用 `document.toJSON()` 导出当前状态

## 📝 最佳实践

1. **节点设计**: 保持节点功能单一且明确
2. **数据验证**: 为所有表单字段添加验证规则
3. **错误处理**: 实现完善的错误处理机制
4. **用户体验**: 提供清晰的操作反馈

## 🌐 浏览器兼容性

- Chrome 70+
- Firefox 63+
- Safari 12+
- Edge 79+

## 📄 许可证

MIT License

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个组件。

---

*基于字节跳动 FlowGram.AI 开源工作流引擎，为企业级工作流设计提供专业解决方案。* 