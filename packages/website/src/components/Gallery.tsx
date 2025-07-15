import React, { useState, useRef } from 'react';
import { Typography, Card, Button, Modal, Row, Col, Space } from 'antd';
import { LeftOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import WorkflowCanvas from './gallery/WorkflowCanvas';
import StockChart from './gallery/StockChart';
import ZustandDemo from './gallery/ZustandDemo';
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
    }
  ];

  const handleItemClick = (item: GalleryItem) => {
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
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <div className="demo-container">
                    <selectedItem.component preview={false} />
                  </div>
                </Col>
                <Col xs={24} lg={8}>
                  <div className="demo-info">
                    <div className="info-item">
                      <h4>类别</h4>
                      <p>{selectedItem.category}</p>
                    </div>
                    <div className="info-item">
                      <h4>描述</h4>
                      <p>{selectedItem.description}</p>
                    </div>
                    <div className="info-item">
                      <h4>标签</h4>
                      <Space wrap>
                        {selectedItem.tags.map((tag, index) => (
                          <span key={index} className="info-tag">
                            {tag}
                          </span>
                        ))}
                      </Space>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default Gallery; 