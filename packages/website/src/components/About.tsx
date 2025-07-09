import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { CodeOutlined, BgColorsOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const highlights = [
    {
      icon: <CodeOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '全栈技术专家',
      description: '10+年开发经验，精通前后端技术栈，具备完整的Web全栈开发能力'
    },
    {
      icon: <BgColorsOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '团队领导力',
      description: '4年Tech Lead经验，管理5-10人团队，具备跨团队协作和项目管理能力'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'AI技术创新',
      description: '积极拥抱AI技术，有大模型集成、智能化场景落地等实践经验'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '120px 0',
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* 标题 */}
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
            关于我
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

        <Row gutter={[48, 48]} align="middle">
          {/* 左侧文字介绍 */}
          <Col xs={24} lg={12}>
            <div>
              <Paragraph
                style={{
                  fontSize: '18px',
                  color: '#595959',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                我是一名资深全栈工程师，拥有10+年开发经验和4年团队管理经验。
                曾就职于蔚来、快手、陆金所等知名公司，参与了多个大型项目的架构设计和技术选型。
              </Paragraph>
              
              <Paragraph
                style={{
                  fontSize: '18px',
                  color: '#595959',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                专注于前端架构、性能优化和工程化建设，具备从代码优化到全链路调优的丰富经验。
                在AI技术集成、低代码平台、数据中台等方向有深度实践，推动技术创新和业务增长。
              </Paragraph>

              <Paragraph
                style={{
                  fontSize: '18px',
                  color: '#595959',
                  lineHeight: 1.8,
                }}
              >
                作为Tech Lead，擅长团队管理和人才培养，建立完善的Code Review机制和知识管理体系。
                热衷于技术分享和开源贡献，始终保持对新技术的学习热情。
              </Paragraph>
            </div>
          </Col>

          {/* 右侧特色卡片 */}
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {highlights.map((item, index) => (
                <Card
                  key={index}
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{ padding: '24px' }}
                  className="about-card"
                >
                  <Row align="middle" gutter={16} wrap={false}>
                    <Col flex="none">
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: '#f0f8ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </div>
                    </Col>
                    <Col flex="auto">
                      <Title
                        level={4}
                        style={{
                          fontSize: '18px',
                          fontWeight: 500,
                          color: '#262626',
                          marginBottom: '8px',
                        }}
                      >
                        {item.title}
                      </Title>
                      <Paragraph
                        style={{
                          fontSize: '14px',
                          color: '#8c8c8c',
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        .about-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 80px 0 !important;
          }
          .about-title {
            font-size: 28px !important;
          }
          .about-text {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About; 