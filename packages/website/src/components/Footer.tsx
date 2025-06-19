import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined, HeartFilled } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        backgroundColor: '#262626',
        color: '#8c8c8c',
        textAlign: 'center',
        padding: '48px 24px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 社交链接 */}
        <Space size="large" style={{ marginBottom: '32px' }}>
          <Button
            type="text"
            icon={<GithubOutlined />}
            size="large"
            style={{
              color: '#8c8c8c',
              fontSize: '20px',
              height: '48px',
              width: '48px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            }}
            className="footer-social-btn"
          />
          <Button
            type="text"
            icon={<LinkedinOutlined />}
            size="large"
            style={{
              color: '#8c8c8c',
              fontSize: '20px',
              height: '48px',
              width: '48px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            }}
            className="footer-social-btn"
          />
          <Button
            type="text"
            icon={<MailOutlined />}
            size="large"
            style={{
              color: '#8c8c8c',
              fontSize: '20px',
              height: '48px',
              width: '48px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
            }}
            className="footer-social-btn"
          />
        </Space>

        {/* 版权信息 */}
        <div style={{ borderTop: '1px solid #404040', paddingTop: '24px' }}>
          <Text
            style={{
              color: '#8c8c8c',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            © 2024 林高 (Lin Gao). Made with <HeartFilled style={{ color: '#ff4d4f' }} /> in Shanghai
          </Text>
        </div>
      </div>

      <style>{`
        .footer-social-btn:hover {
          color: #ffffff !important;
          background-color: #404040 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </AntFooter>
  );
};

export default Footer; 