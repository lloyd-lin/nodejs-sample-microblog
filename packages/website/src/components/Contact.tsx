import React from 'react';
import { Row, Col, Typography, Button, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: '邮箱',
      content: 'frankgts@hotmail.com',
      action: 'mailto:frankgts@hotmail.com'
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: '微信',
      content: '暂不可见哦~',
      action: ''
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: '位置',
      content: '上海, 中国',
      action: ''
    }
  ];

  return (
    <section
      id="contact"
      style={{
        padding: '120px 0',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
            联系我
          </Title>
          <div
            style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#1890ff',
              margin: '0 auto 24px',
            }}
          />
          <Paragraph
            style={{
              fontSize: '18px',
              color: '#8c8c8c',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            欢迎讨论技术话题、合作机会或任何有趣的想法
          </Paragraph>
        </div>

        <Row gutter={[32, 32]} justify="center">
          {contactInfo.map((item, index) => (
            <Col key={index} xs={24} sm={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                  borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.3s ease',
                  cursor: item.action ? 'pointer' : 'default',
                }}
                className="contact-item"
                onClick={() => item.action && window.open(item.action)}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  {item.icon}
                </div>
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
                    fontSize: '16px',
                    color: '#595959',
                    margin: 0,
                  }}
                >
                  {item.content}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Button
            type="primary"
            size="large"
            style={{
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px',
            }}
            onClick={() => window.open('mailto:lingao.dev@gmail.com')}
          >
            发送邮件
          </Button>
        </div>
      </div>

      <style>{`
        .contact-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </section>
  );
};

export default Contact; 