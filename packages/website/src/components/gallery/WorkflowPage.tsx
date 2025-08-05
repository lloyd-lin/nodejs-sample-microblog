import React from 'react';
import { Card, Typography, Button } from 'antd';
import { BranchesOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import WorkflowCanvas from './WorkflowCanvas';
import './WorkflowPage.css';

const { Text, Title } = Typography;

const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="workflow-page-container">
      <div className="workflow-page-content">
        <div className="workflow-page-card">
          <div className="workflow-page-header">
            <div>
              <Title level={2} className="workflow-page-title">
                <BranchesOutlined style={{ marginRight: '12px', color: '#667eea' }} />
                FlowGram.AI 工作流编辑器
              </Title>
              <Text type="secondary" className="workflow-page-subtitle">
                基于字节跳动开源工作流引擎，支持可视化流程设计和节点编排
              </Text>
            </div>
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              className="workflow-page-back-button"
            >
              返回首页
            </Button>
          </div>
          
          <div className="workflow-page-body">
            <WorkflowCanvas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage; 