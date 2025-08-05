import React, { useState, useRef } from 'react';
import { Typography, Card, Button, Modal, Row, Col, Space, Divider } from 'antd';
import { LeftOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import WorkflowCanvas from './gallery/WorkflowCanvas';
import StockChart from './gallery/StockChart';
import ZustandDemo from './gallery/ZustandDemo';
import D3NetworkGraph from './gallery/D3NetworkGraph';
import Gomoku from './gallery/Gomoku';
import './gallery/Gallery.css';

const { Title, Paragraph } = Typography;

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  component: React.ComponentType<any>;
  thumbnail?: string;
  tags: string[];
}

const Gallery: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const galleryItems: GalleryItem[] = [
    {
      id: 'workflow-canvas',
      title: '工作流画布',
      description: '拖拽式工作流设计器，支持节点连接和流程编排',
      category: '工具',
      component: WorkflowCanvas,
      tags: ['拖拽', '流程', '画布', '节点编辑']
    },
    {
      id: 'stock-chart',
      title: '股票K线图',
      description: '实时股票数据可视化，支持技术指标和交互式分析',
      category: '可视化',
      component: StockChart,
      tags: ['图表', 'K线', '股票', '数据可视化']
    },
    {
      id: 'zustand-demo',
      title: 'Zustand 状态管理',
      description: '轻量级React状态管理库演示，包含计数器、待办事项和用户管理',
      category: '状态管理',
      component: ZustandDemo,
      tags: ['状态管理', 'React', 'TypeScript', 'Zustand']
    },
    {
      id: 'd3-network-graph',
      title: 'D3 技术栈关系图',
      description: '基于D3.js的交互式力导向图，展示技术栈之间的关系和依赖',
      category: '数据可视化',
      component: D3NetworkGraph,
      tags: ['D3.js', '网络图', '力导向', '技术栈', '交互式']
    },
    {
      id: 'gomoku',
      title: '五子棋',
      description: '五子棋游戏，支持双人对战和AI对战',
      category: '游戏',
      component: Gomoku,
      tags: ['五子棋', '游戏', '双人对战', 'AI对战']
    }
  ];  

  const handleItemClick = (item: GalleryItem) => {
    // 工作流画布特殊处理 - 导航到独立页面
    if (item.id === 'workflow-canvas') {
      navigate('/workflow');
      return;
    }
    
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="section-title">
            Gallery
          </Title>
          <Paragraph className="section-subtitle">
            探索工具和代码案例的世界
          </Paragraph>
        </div>

        <div className="gallery-container">
          <Button 
            className="scroll-button scroll-left"
            icon={<LeftOutlined />}
            onClick={scrollLeft}
            size="large"
          />
          
          <div className="gallery-scroll" ref={scrollContainerRef}>
            <div className="gallery-track">
              {galleryItems.map((item) => (
                <Card
                  key={item.id}
                  className="gallery-card"
                  hoverable
                  onClick={() => handleItemClick(item)}
                  cover={
                    <div className="gallery-card-cover">
                      <div className="gallery-preview">
                        <item.component preview={true} />
                      </div>
                      <div className="gallery-overlay">
                        <EyeOutlined className="view-icon" />
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={item.title}
                    description={
                      <div>
                        <div className="card-category">{item.category}</div>
                        <div className="card-description">{item.description}</div>
                        <div className="card-tags">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="card-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
          </div>

          <Button 
            className="scroll-button scroll-right"
            icon={<RightOutlined />}
            onClick={scrollRight}
            size="large"
          />
        </div>

        <Modal
          title={selectedItem?.title}
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          width="90%"
          style={{ maxWidth: '1200px' }}
          className="gallery-modal"
        >
          {selectedItem && (
            <div className="modal-content">
              {/* 标题下方的详细信息 - 上下布局 */}
              <div className="modal-header-info">
                <div className="header-info-row">
                  <span className="info-label">类别：</span>
                  <span className="info-category">{selectedItem.category}</span>
                  <Divider type="vertical" />
                  <span className="info-description">{selectedItem.description}</span>
                </div>
                <div className="header-tags-row">
                  <Space wrap size={[8, 4]}>
                    {selectedItem.tags.map((tag, index) => (
                      <span key={index} className="header-tag">
                        {tag}
                      </span>
                    ))}
                  </Space>
                </div>
              </div>
              
              {/* 组件展示区域 - 全宽度 */}
              <div className="demo-container-full">
                <selectedItem.component preview={false} />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default Gallery; 