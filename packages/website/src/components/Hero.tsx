import React from 'react';
import { Row, Col, Typography, Button, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined, DownOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(1px)',
        paddingTop: '64px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Col xs={24} md={16} lg={12}>
            <div style={{ textAlign: 'center' }}>
              {/* 头像占位 */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  margin: '0 auto 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#8c8c8c',
                  border: '2px solid #f0f0f0',
                }}
              >
                林高
              </div>

              {/* 主标题 */}
              <Title
                level={1}
                style={{
                  fontSize: '48px',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '16px',
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                林高 (Lin Gao)
              </Title>

              {/* 副标题 */}
              <Title
                level={3}
                style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#e0e0e0',
                  marginBottom: '24px',
                  lineHeight: 1.4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                资深全栈工程师 / 前端专家 / Tech Lead
              </Title>

              {/* 简介 */}
              <Paragraph
                style={{
                  fontSize: '18px',
                  color: '#d0d0d0',
                  maxWidth: '600px',
                  margin: '0 auto 40px',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                10+年全栈开发经验，4年Tech Lead经验。专注前端架构、性能优化和AI技术集成。热爱技术创新，追求代码质量与用户体验的完美平衡。
              </Paragraph>

              {/* 社交链接 */}
              <Space size="large" style={{ marginBottom: '48px' }}>
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  size="large"
                  style={{
                    color: '#262626',
                    fontSize: '20px',
                    height: '48px',
                    width: '48px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                  }}
                  className="social-btn"
                />
                <Button
                  type="text"
                  icon={<LinkedinOutlined />}
                  size="large"
                  style={{
                    color: '#262626',
                    fontSize: '20px',
                    height: '48px',
                    width: '48px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                  }}
                  className="social-btn"
                />
                <Button
                  type="text"
                  icon={<MailOutlined />}
                  size="large"
                  style={{
                    color: '#262626',
                    fontSize: '20px',
                    height: '48px',
                    width: '48px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                  }}
                  className="social-btn"
                />
              </Space>

              {/* 滚动指示器 */}
              <div style={{ marginTop: '64px' }}>
                <Button
                  type="text"
                  icon={<DownOutlined />}
                  onClick={scrollToAbout}
                  style={{
                    color: '#8c8c8c',
                    fontSize: '16px',
                    animation: 'bounce 2s infinite',
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        .social-btn:hover {
          background-color: #f5f5f5 !important;
          color: #1890ff !important;
          transform: translateY(-2px);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px !important;
          }
          .hero-subtitle {
            font-size: 20px !important;
          }
          .hero-description {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero; 