import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Space, Typography, message } from 'antd';
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
  RedoOutlined
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
  WorkflowNodeProps
} from '@flowgram.ai/free-layout-editor';
import { FlowMinimapService, MinimapRender } from '@flowgram.ai/minimap-plugin';
import { createMinimapPlugin } from '@flowgram.ai/minimap-plugin';
import '@flowgram.ai/free-layout-editor/index.css';
import './WorkflowCanvas.css';

const { Text, Title } = Typography;

// 节点注册配置
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
        <>
          <Field<string> name="title">
            <div style={{ 
              padding: '8px 16px', 
              background: '#52c41a', 
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              开始节点
            </div>
          </Field>
        </>
      )
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
        <>
          <Field<string> name="title">
            <div style={{ 
              padding: '8px 16px', 
              background: '#f5222d', 
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              结束节点
            </div>
          </Field>
        </>
      )
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
        <>
          <Field<string> name="title">
            <div style={{ 
              padding: '8px 16px', 
              background: '#1890ff', 
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              自定义节点
            </div>
          </Field>
          <Field<string> name="description">
            <div style={{ 
              padding: '4px 8px', 
              fontSize: '12px',
              color: '#666'
            }}>
              可编辑内容
            </div>
          </Field>
        </>
      )
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
    const nodeData = {
      title: nodeType === 'start' ? '开始' : 
             nodeType === 'end' ? '结束' : '自定义节点',
      description: nodeType === 'custom' ? '可编辑内容' : ''
    };
    
    dragService.startDragCard(nodeType, event as any, { data: nodeData });
  }, [dragService]);

  return (
    <div className="node-add-panel">
      <Title level={5}>节点库</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          icon={<PlayCircleOutlined />}
          block
          onMouseDown={(e) => handleDragStart('start', e)}
          style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
        >
          开始节点
        </Button>
        <Button
          icon={<NodeIndexOutlined />}
          block
          onMouseDown={(e) => handleDragStart('custom', e)}
          style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}
        >
          自定义节点
        </Button>
        <Button
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
    console.log('执行工作流:', workflowData);
  }, [document]);

  const handleSave = useCallback(() => {
    const workflowData = document.toJSON();
    message.success('工作流保存成功');
    console.log('保存工作流:', workflowData);
  }, [document]);

  const handleReset = useCallback(() => {
    document.fromJSON(initialData);
    message.info('工作流已重置');
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
  return React.useMemo(() => ({
    background: true,
    readonly: false,
    initialData,
    nodeRegistries,
    onContentChange(ctx: any, event: any) {
      console.log('工作流数据变化:', event, ctx.document.toJSON());
    },
    nodeEngine: {
      enable: true,
    },
    history: {
      enable: true,
      enableChangeNode: true,
    },
    onInit: (ctx: any) => {
      console.log('编辑器初始化完成');
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
    ],
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
  const editorProps = useEditorProps();

  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <FlowgramEditorContent />
    </FreeLayoutEditorProvider>
  );
};

// 主组件
const WorkflowCanvas: React.FC = () => {
  return (
    <Card className="workflow-canvas-card">
      <div className="workflow-header">
        <Title level={4}>
          <BranchesOutlined /> FlowGram.AI 工作流编辑器
        </Title>
        <Text type="secondary">基于字节跳动开源工作流引擎</Text>
      </div>
      <FlowgramEditor />
    </Card>
  );
};

export default WorkflowCanvas; 