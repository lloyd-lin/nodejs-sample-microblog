import React from 'react';
import { Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined, CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PhotoAnalysis from './PhotoAnalysis';

const { Title } = Typography;

const PhotoAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            style={{ color: 'white' }}
          >
            返回首页
          </Button>
        </Space>
      </div>
      <PhotoAnalysis />
    </div>
  );
};

export default PhotoAnalysisPage; 