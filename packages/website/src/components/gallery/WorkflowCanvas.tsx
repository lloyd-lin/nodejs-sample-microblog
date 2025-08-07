import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, Button, Space, Typography, message, Input, Select, Switch, InputNumber, Form } from 'antd';
import { 
  PlayCircleOutlined, 
  PlusOutlined, 
  SaveOutlined, 
  ReloadOutlined,
  NodeIndexOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  BorderOutlined,
  BranchesOutlined,
  UndoOutlined,
  RedoOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SettingOutlined,
  CodeOutlined
} from '@ant-design/icons';
import {
  FreeLayoutEditorProvider,
  EditorRenderer,
  useNodeRender,
  WorkflowNodeRenderer,
  useService,
  usePlaygroundTools,
  useClientContext,
  WorkflowDragService,
  WorkflowJSON,
  WorkflowNodeRegistry,
  Field,
  WorkflowNodeProps,
  PlaygroundDragEvent,
  FieldRenderProps,
  FormMeta,
  ValidateTrigger,
  DataEvent,
  EffectFuncProps,
  FreeLayoutPluginContext
} from '@flowgram.ai/free-layout-editor';
import { FlowMinimapService, MinimapRender } from '@flowgram.ai/minimap-plugin';
import { createMinimapPlugin } from '@flowgram.ai/minimap-plugin';
import { createFreeSnapPlugin } from '@flowgram.ai/free-snap-plugin';
import '@flowgram.ai/free-layout-editor/index.css';
import './WorkflowCanvas.css';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 节点表单渲染器组件
const NodeFormRenderer: React.FC<{ node: any }> = ({ node }) => {
  const { form } = useNodeRender();
  // 添加调试信息
  React.useEffect(() => {
    console.log('NodeFormRenderer - node:', node);
    console.log('NodeFormRenderer - form:', form);
  }, [node, form]);

  // 直接使用form.render()，让FlowGram.AI自己处理表单渲染
  const renderNodeForm = () => {
    // 如果form存在，直接使用form.render()
    if (form && typeof form.render === 'function') {
      try {
        const renderedForm = form.render();
        console.log('Form rendered successfully:', renderedForm);
        return renderedForm;
      } catch (error) {
        console.error('Error rendering form:', error);
        return renderDefaultForm();
      }
    }
    
    // 否则渲染默认表单
    return renderDefaultForm();
  };

  const renderDefaultForm = () => (
    <div className="node-content">
      <div className="node-header" style={{ background: '#1890ff' }}>
        <NodeIndexOutlined /> 节点
      </div>
      <div style={{ padding: '12px 16px', color: '#666' }}>
        表单加载中...
      </div>
    </div>
  );

  return (
    <div className="node-form-container">
      {renderNodeForm()}
    </div>
  );
};

// 字段包装器组件 - 参考FlowGram.AI官方设计
const FieldWrapper: React.FC<{
  title: string;
  required?: boolean;
  error?: any;
  children: React.ReactNode;
}> = ({ title, required, error, children }) => (
  <div className="field-wrapper">
    <div className="field-label">
      {title}
      {required && <span className="required-mark">*</span>}
    </div>
    <div className="field-content">
      {children}
    </div>
    {error && <div className="field-error">{String(error)}</div>}
  </div>
);

// 节点注册配置 - 优化版本
const nodeRegistries: WorkflowNodeRegistry[] = [
  {
    type: 'start',
    meta: {
      isStart: true,
      deleteDisable: true,
      copyDisable: true,
      defaultPorts: [{ type: 'output' }]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#52c41a' }}>
            <PlayCircleOutlined /> 开始节点
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message || null}
              >
                <Input
                  size="small"
                  placeholder="请输入开始节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="description">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="节点描述">
                <TextArea
                  size="small"
                  placeholder="请输入节点描述"
                  rows={2}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '工作流开始',
        description: '工作流的起始节点'
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined)
      },
      effect: {
        title: [{
          event: DataEvent.onValueChange,
          effect: ({ value }: EffectFuncProps<string, FormData>) => {
            console.log('field1 value:', value);
          },
        }]
      }
    }
  },
  {
    type: 'end',
    meta: {
      isEnd: true,
      deleteDisable: true,
      copyDisable: true,
      defaultPorts: [{ type: 'input' }]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#f5222d' }}>
            <BorderOutlined /> 结束节点
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入结束节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="resultType">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="返回类型">
                <Select
                  size="small"
                  placeholder="选择返回类型"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                >
                  <Option value="success">成功</Option>
                  <Option value="error">错误</Option>
                  <Option value="data">数据</Option>
                </Select>
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '工作流结束',
        resultType: 'success'
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined)
      }
    }
  },
  {
    type: 'custom',
    meta: {
      defaultPorts: [
        { type: 'input' },
        { type: 'output' }
      ]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#1890ff' }}>
            <CodeOutlined /> 自定义节点
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="description">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="节点描述">
                <TextArea
                  size="small"
                  placeholder="请输入节点描述"
                  rows={2}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="customCode">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="自定义代码">
                <TextArea
                  size="small"
                  placeholder="请输入自定义代码"
                  rows={4}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '自定义节点',
        description: '可编辑内容',
        customCode: '// 在这里编写自定义逻辑'
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined)
      }
    }
  },
  {
    type: 'condition',
    meta: {
      defaultPorts: [
        { type: 'input' },
        { type: 'output' },
        { type: 'output' }
      ]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#fa8c16' }}>
            <BranchesOutlined /> 条件判断
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入条件节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="condition">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="判断条件">
                <Select
                  size="small"
                  placeholder="选择判断条件"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                >
                  <Option value="equals">等于</Option>
                  <Option value="not_equals">不等于</Option>
                  <Option value="greater_than">大于</Option>
                  <Option value="less_than">小于</Option>
                  <Option value="contains">包含</Option>
                  <Option value="regex">正则匹配</Option>
                </Select>
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="value">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="比较值">
                <Input
                  size="small"
                  placeholder="请输入比较值"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="trueLabel">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="真值标签">
                <Input
                  size="small"
                  placeholder="真值分支标签"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="falseLabel">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="假值标签">
                <Input
                  size="small"
                  placeholder="假值分支标签"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '条件判断',
        condition: 'equals',
        value: '',
        trueLabel: '是',
        falseLabel: '否'
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined),
        condition: ({ value }) => (!value ? '请选择判断条件' : undefined)
      }
    }
  },
  {
    type: 'process',
    meta: {
      defaultPorts: [
        { type: 'input' },
        { type: 'output' }
      ]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#722ed1' }}>
            <SettingOutlined /> 处理节点
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入处理节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="processType">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="处理类型">
                <Select
                  size="small"
                  placeholder="选择处理类型"
                  {...field}
                >
                  <Option value="transform">数据转换</Option>
                  <Option value="filter">数据过滤</Option>
                  <Option value="aggregate">数据聚合</Option>
                  <Option value="validate">数据验证</Option>
                  <Option value="custom">自定义处理</Option>
                </Select>
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="processLogic">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="处理逻辑">
                <TextArea
                  size="small"
                  placeholder="请输入处理逻辑"
                  rows={3}
                  {...field}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<boolean> name="async">
            {({ field }: FieldRenderProps<boolean>) => (
              <FieldWrapper title="异步处理">
                <Switch
                  size="small"
                  {...field}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '处理节点',
        processType: 'transform',
        processLogic: '// 在这里编写处理逻辑',
        async: false
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined),
        processType: ({ value }) => (!value ? '请选择处理类型' : undefined)
      }
    }
  },
  {
    type: 'data',
    meta: {
      defaultPorts: [
        { type: 'output' }
      ]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#13c2c2' }}>
            <DatabaseOutlined /> 数据节点
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入数据节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="dataSource">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="数据源">
                <Select
                  size="small"
                  placeholder="选择数据源"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                >
                  <Option value="database">数据库</Option>
                  <Option value="api">API接口</Option>
                  <Option value="file">文件</Option>
                  <Option value="cache">缓存</Option>
                  <Option value="stream">数据流</Option>
                </Select>
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="connectionString">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="连接字符串">
                <Input
                  size="small"
                  placeholder="请输入连接字符串"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="query">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="查询语句">
                <TextArea
                  size="small"
                  placeholder="请输入查询语句"
                  rows={3}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<number> name="timeout">
            {({ field }: FieldRenderProps<number>) => (
              <FieldWrapper title="超时时间(秒)">
                <InputNumber
                  size="small"
                  min={1}
                  max={300}
                  placeholder="30"
                  defaultValue={field.value}
                  onChange={(value) => field.onChange(value || 0)}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: '数据节点',
        dataSource: 'database',
        connectionString: '',
        query: '',
        timeout: 30
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined),
        dataSource: ({ value }) => (!value ? '请选择数据源' : undefined)
      }
    }
  },
  {
    type: 'api',
    meta: {
      defaultPorts: [
        { type: 'input' },
        { type: 'output' }
      ]
    },
    formMeta: {
      render: () => (
        <div className="node-content">
          <div className="node-header" style={{ background: '#eb2f96' }}>
            <ApiOutlined /> API调用
          </div>
          <Field<string> name="title">
            {({ field, fieldState }: FieldRenderProps<string>) => (
              <FieldWrapper
                title="节点标题"
                required
                error={fieldState.errors?.[0]?.message}
              >
                <Input
                  size="small"
                  placeholder="请输入API节点标题"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="method">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="请求方法">
                <Select
                  size="small"
                  placeholder="选择请求方法"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                >
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="PATCH">PATCH</Option>
                </Select>
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="url">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="API地址">
                <Input
                  size="small"
                  placeholder="请输入API地址"
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="headers">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="请求头">
                <TextArea
                  size="small"
                  placeholder="请输入请求头(JSON格式)"
                  rows={2}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<string> name="body">
            {({ field }: FieldRenderProps<string>) => (
              <FieldWrapper title="请求体">
                <TextArea
                  size="small"
                  placeholder="请输入请求体"
                  rows={3}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
          <Field<number> name="timeout">
            {({ field }: FieldRenderProps<number>) => (
              <FieldWrapper title="超时时间(秒)">
                <InputNumber
                  size="small"
                  min={1}
                  max={300}
                  placeholder="30"
                  value={field.value}
                  onChange={(value) => field.onChange(value || 0)}
                  onBlur={field.onBlur}
                  onFocus={field.onFocus}
                />
              </FieldWrapper>
            )}
          </Field>
        </div>
      ),
      defaultValues: {
        title: 'API调用',
        method: 'GET',
        url: '',
        headers: '{}',
        body: '',
        timeout: 30
      },
      validateTrigger: ValidateTrigger.onChange,
      validate: {
        title: ({ value }) => (!value ? '标题是必填项' : undefined),
        method: ({ value }) => (!value ? '请选择请求方法' : undefined),
        url: ({ value }) => (!value ? 'API地址是必填项' : undefined)
      }
    }
  }
];

// 初始工作流数据
const initialData: WorkflowJSON = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      meta: {
        position: { x: 100, y: 100 }
      },
      data: {
        title: '开始'
      }
    },
    {
      id: 'end-1',
      type: 'end',
      meta: {
        position: { x: 400, y: 100 }
      },
      data: {
        title: '结束'
      }
    }
  ],
  edges: []
};

// 节点添加面板组件
const NodeAddPanel: React.FC = () => {
  const dragService = useService<WorkflowDragService>(WorkflowDragService);

  const handleDragStart = useCallback((nodeType: string, event: React.MouseEvent) => {
    const nodeDataMap: Record<string, any> = {
      start: { 
        title: '工作流开始',
        description: '工作流的起始节点'
      },
      end: { 
        title: '工作流结束',
        resultType: 'success'
      },
      custom: { 
        title: '自定义节点',
        description: '可编辑内容',
        customCode: '// 在这里编写自定义逻辑'
      },
      condition: { 
        title: '条件判断',
        condition: 'equals',
        value: '',
        trueLabel: '是',
        falseLabel: '否'
      },
      process: { 
        title: '处理节点',
        processType: 'transform',
        processLogic: '// 在这里编写处理逻辑',
        async: false
      },
      data: { 
        title: '数据节点',
        dataSource: 'database',
        connectionString: '',
        query: '',
        timeout: 30
      },
      api: { 
        title: 'API调用',
        method: 'GET',
        url: '',
        headers: '{}',
        body: '',
        timeout: 30
      }
    };
    
    const nodeData = nodeDataMap[nodeType] || { title: '未知节点' };
    dragService.startDragCard(nodeType, event as any, { data: nodeData });
  }, [dragService]);

  return (
    <div className="node-add-panel">
      <Title level={5}>节点库</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          className='node-add-panel-button'
          icon={<PlayCircleOutlined />}
          block
          onMouseDown={(e) => handleDragStart('start', e)}
          style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
        >
          开始节点
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<NodeIndexOutlined />}
          block
          onMouseDown={(e) => handleDragStart('custom', e)}
          style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}
        >
          自定义节点
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<BranchesOutlined />}
          block
          onMouseDown={(e) => handleDragStart('condition', e)}
          style={{ background: '#fff7e6', borderColor: '#ffd591' }}
        >
          条件判断
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<NodeIndexOutlined />}
          block
          onMouseDown={(e) => handleDragStart('process', e)}
          style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}
        >
          处理节点
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<NodeIndexOutlined />}
          block
          onMouseDown={(e) => handleDragStart('data', e)}
          style={{ background: '#e6fffb', borderColor: '#87e8de' }}
        >
          数据节点
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<NodeIndexOutlined />}
          block
          onMouseDown={(e) => handleDragStart('api', e)}
          style={{ background: '#fff0f6', borderColor: '#ffadd2' }}
        >
          API调用
        </Button>
        <Button
          className='node-add-panel-button'
          icon={<BorderOutlined />}
          block
          onMouseDown={(e) => handleDragStart('end', e)}
          style={{ background: '#fff2e8', borderColor: '#ffbb96' }}
        >
          结束节点
        </Button>
      </Space>
    </div>
  );
};

// 工具栏组件
const Tools: React.FC = () => {
  const { history } = useClientContext();
  const tools = usePlaygroundTools();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const disposable = history.undoRedoService.onChange(() => {
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    });
    return () => disposable.dispose();
  }, [history]);

  return (
    <div className="flowgram-tools">
      <Space>
        <Button
          icon={<ZoomInOutlined />}
          onClick={() => tools.zoomin()}
          title="放大"
        />
        <Button
          icon={<ZoomOutOutlined />}
          onClick={() => tools.zoomout()}
          title="缩小"
        />
        <Button
          icon={<BorderOutlined />}
          onClick={() => tools.fitView()}
          title="适应视图"
        />
        <Button
          icon={<BranchesOutlined />}
          onClick={() => tools.autoLayout()}
          title="自动布局"
        />
        <Button
          icon={<UndoOutlined />}
          onClick={() => history.undo()}
          disabled={!canUndo}
          title="撤销"
        />
        <Button
          icon={<RedoOutlined />}
          onClick={() => history.redo()}
          disabled={!canRedo}
          title="重做"
        />
        <Text type="secondary">
          {Math.floor(tools.zoom * 100)}%
        </Text>
      </Space>
    </div>
  );
};

// 小地图组件
const Minimap: React.FC = () => {
  const minimapService = useService(FlowMinimapService);
  
  return (
    <div className="flowgram-minimap">
      <MinimapRender
        service={minimapService}
        containerStyles={{
          pointerEvents: 'auto',
          position: 'relative',
          top: 'unset',
          right: 'unset',
          bottom: 'unset',
          left: 'unset',
        }}
        inactiveStyle={{
          opacity: 1,
          scale: 1,
          translateX: 0,
          translateY: 0,
        }}
      />
    </div>
  );
};

// 控制面板组件
const ControlPanel: React.FC = () => {
  const { document } = useClientContext();

  const handleExecute = useCallback(() => {
    const workflowData = document.toJSON();
    message.success('工作流执行模拟完成');
    // console.log('执行工作流:', workflowData);
  }, [document]);

  const handleSave = useCallback(() => {
    const workflowData = document.toJSON();
    message.success('工作流保存成功');
    // console.log('保存工作流:', workflowData);
  }, [document]);

  const handleReset = useCallback(() => {
    try {
      // 清空当前数据并重置到初始状态
      document.clear();
      setTimeout(() => {
        document.fromJSON(initialData);
        message.info('工作流已重置');
        // console.log('重置工作流:', initialData);
      }, 50);
    } catch (error) {
      console.error('重置失败:', error);
      message.error('重置失败，请重试');
    }
  }, [document]);

  return (
    <div className="control-panel">
      <Title level={5}>控制面板</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          block
          onClick={handleExecute}
        >
          执行工作流
        </Button>
        <Button
          icon={<SaveOutlined />}
          block
          onClick={handleSave}
        >
          保存工作流
        </Button>
        <Button
          icon={<ReloadOutlined />}
          block
          onClick={handleReset}
        >
          重置工作流
        </Button>
      </Space>
    </div>
  );
};

// 编辑器配置Hook
const useEditorProps = () => {
  // const { document } = useClientContext();
  
  return React.useMemo(() => ({
    background: true,
    readonly: false,
    initialData,
    nodeRegistries,
     /**
       * 节点数据转换, 由 ctx.document.fromJSON 调用
       * Node data transformation, called by ctx.document.fromJSON
       * @param node
       * @param json
       */
     fromNodeJSON(node: any, json: any) {
      return json;
    },
    /**
     * 节点数据转换, 由 ctx.document.toJSON 调用
     * Node data transformation, called by ctx.document.toJSON
     * @param node
     * @param json
     */
    toNodeJSON(node: any, json: any) {
      return json;
    },
    materials: {
      renderDefaultNode: (props: WorkflowNodeProps) => {
        return (
          <div 
            onContextMenu={(e) => {
              e.preventDefault();
              const { node } = props;
              if (node.type !== 'start' && node.type !== 'end') {
                const confirmDelete = window.confirm('确定要删除这个节点吗？');
                if (confirmDelete) {
                  // document.removeNode
                  message.success('节点已删除');
                }
              } else {
                message.warning('开始和结束节点不能删除');
              }
            }}
          >
            <WorkflowNodeRenderer className="demo-free-node" node={props.node}>
              <NodeFormRenderer node={props.node} />
            </WorkflowNodeRenderer>
          </div>
        );
      },
    },
    onContentChange(ctx: any, event: any) {
      // console.log('工作流数据变化:', event, ctx.document.toJSON());
    },
    nodeEngine: {
      enable: true,
    },
    history: {
      enable: true,
      enableChangeNode: true, 
    },
    onInit: (ctx: any) => {
      // console.log('编辑器初始化完成');
    },
    onAllLayersRendered(ctx: any) {
      ctx.document.fitView(false);
    },
    onDispose() {
      console.log('编辑器已销毁');
    },
    plugins: () => [
      createMinimapPlugin({
        disableLayer: true,
        canvasStyle: {
          canvasWidth: 182,
          canvasHeight: 102,
          canvasPadding: 50,
          canvasBackground: 'rgba(245, 245, 245, 1)',
          canvasBorderRadius: 10,
          viewportBackground: 'rgba(235, 235, 235, 1)',
          viewportBorderRadius: 4,
          viewportBorderColor: 'rgba(201, 201, 201, 1)',
          viewportBorderWidth: 1,
          viewportBorderDashLength: 2,
          nodeColor: 'rgba(255, 255, 255, 1)',
          nodeBorderRadius: 2,
          nodeBorderWidth: 0.145,
          nodeBorderColor: 'rgba(6, 7, 9, 0.10)',
          overlayColor: 'rgba(255, 255, 255, 0)',
        },
        inactiveDebounceTime: 1,
      }),
      // 自动对齐插件
      createFreeSnapPlugin({
        edgeColor: '#00B2B2',
        alignColor: '#00B2B2',
        edgeLineWidth: 1,
        alignLineWidth: 1,
        alignCrossWidth: 8,
      }),
    ],
    canDeleteNode: (ctx: any, node: any) => {
      return node.type !== 'start' && node.type !== 'end';
    }
  }), []);
};

// 内部编辑器内容组件（在Provider内部）
const FlowgramEditorContent: React.FC = () => {
  return (
    <div className="flowgram-editor-container">
      <div className="flowgram-layout">
        <div className="flowgram-sidebar">
          <NodeAddPanel />
          <ControlPanel />
        </div>
        <div className="flowgram-main">
          <EditorRenderer className="flowgram-canvas" />
          <Tools />
          <Minimap />
        </div>
      </div>
    </div>
  );
};

// 主编辑器组件
const FlowgramEditor: React.FC = () => {
  const ref = useRef<FreeLayoutPluginContext>(null);
  const editorProps = useEditorProps();
  
  return (
    <FreeLayoutEditorProvider {...editorProps} ref={ref}>
      <FlowgramEditorContent />
    </FreeLayoutEditorProvider>
  );
};

// 主组件
const WorkflowCanvas: React.FC = () => {
  return (
    <div className="workflow-canvas-container">
      <FlowgramEditor />
    </div>
  );
};

export default WorkflowCanvas; 