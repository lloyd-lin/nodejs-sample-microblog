import React from 'react';
import { Row, Col, Typography, Card, Button, Tag } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Projects: React.FC = () => {
  const projects = [
    {
      title: '榫卯低代码平台 (蔚来)',
      description: '模型驱动的低代码平台，搭建端到端应用，集成AI能力实现代码生成和智能问数。单文件体积缩小75%，平台发布效率提升90%。',
      tags: ['TypeScript', 'Vue3', 'Midwayjs', 'AI/LLM', '低代码'],
      image: '#f0f8ff'
    },
    {
      title: 'A/B测试实验平台 (快手)',
      description: '数据中台A/B测试平台前端架构，支持万级数据量表格。加载性能从分钟级降至秒级，执行性能提升90%以上。',
      tags: ['Vue3', 'Pinia', 'ECharts', 'Vite', '性能优化'],
      image: '#f6ffed'
    },
    {
      title: '渠道平台 (陆金所)',
      description: '移动金融平台前端架构，支持5+外部APP集成。通过标准化流程，新渠道接入周期从3周缩短到5天。',
      tags: ['React', 'Node.js', 'Hybrid', '微前端'],
      image: '#fff2e8'
    }
  ];

  return (
    <section
      id="projects"
      style={{
        padding: '120px 0',
        backgroundColor: 'rgba(250, 250, 250, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={2}
            style={{
              fontSize: '36px',
              fontWeight: 300,
              color: '#262626',
              marginBottom: '16px',
            }}
          >
            精选作品
          </Title>
          <div
            style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#1890ff',
              margin: '0 auto',
            }}
          />
        </div>

        <Row gutter={[32, 32]}>
          {projects.map((project, index) => (
            <Col key={index} xs={24} md={12} lg={8}>
              <Card
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                }}
                bodyStyle={{ padding: '24px' }}
                className="project-card"
                cover={
                  <div
                    style={{
                      height: '200px',
                      backgroundColor: project.image,
                      borderRadius: '12px 12px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#8c8c8c',
                    }}
                  >
                    📱
                  </div>
                }
              >
                <Title
                  level={4}
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#262626',
                    marginBottom: '12px',
                  }}
                >
                  {project.title}
                </Title>
                
                <Paragraph
                  style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}
                >
                  {project.description}
                </Paragraph>

                <div style={{ marginBottom: '20px' }}>
                  {project.tags.map((tag, tagIndex) => (
                    <Tag
                      key={tagIndex}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#f0f8ff',
                        border: 'none',
                        color: '#1890ff',
                        marginBottom: '4px',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="text"
                    icon={<GithubOutlined />}
                    style={{
                      color: '#8c8c8c',
                      padding: '4px 8px',
                      height: 'auto',
                    }}
                  />
                  <Button
                    type="text"
                    icon={<LinkOutlined />}
                    style={{
                      color: '#8c8c8c',
                      padding: '4px 8px',
                      height: 'auto',
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <style>{`
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default Projects; 