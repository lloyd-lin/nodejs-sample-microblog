import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Button, 
  Card, 
  Space, 
  Typography, 
  Spin, 
  message, 
  Image, 
  Tag, 
  Divider,
  Row,
  Col,
  Progress,
  Alert
} from 'antd';
import { 
  UploadOutlined, 
  CameraOutlined, 
  RobotOutlined, 
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './PhotoAnalysis.css';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface AnalysisResult {
  objects: Array<{
    name: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
  scene: string;
  tags: string[];
  description: string;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

const PhotoAnalysis: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('图片大小不能超过20MB！');
      return false;
    }

    setUploading(true);
    
    // 创建预览URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      setImageUrl(e.target?.result as string);

      // 向后端发送图片的base64数据
      setLoading(false);
      setUploading(false);
    };
    reader.readAsDataURL(file);

    return false; // 阻止默认上传行为
  };

  // 重新分析
  const handleReanalyze = async () => {
    if (!imageUrl) {
      message.warning('请先上传图片！');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        // 'http://localhost:3001/api/gallery/analyze-image'  // 本地
        'https://openapi.lgforest.fun/api/gallery/analyze-image'
        , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('网络请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        setLoading(false);
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                const deltaContent = parsed.choices[0].delta.content;
                accumulatedContent += deltaContent;
                setAnalysisResult(accumulatedContent);

                // setTimeout(() => {
                // }, 100);             
              }
            } catch (error) {
              console.warn('解析SSE数据失败:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('分析图片失败:', error);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  // 下载分析报告
  const handleDownloadReport = () => {
    if (!analysisResult) {
      message.warning('没有分析结果可下载！');
      return;
    }
    
    const report = `
AI图片分析报告
  ${analysisResult}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI分析报告.txt';
    a.click();
    URL.revokeObjectURL(url);
    message.success('报告下载成功！');
  };

  // 上传配置
  const uploadProps = {
    name: 'image',
    multiple: false,
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  return (
    <div className="photo-analysis-container">
      <div className="photo-analysis-header">
        <Title level={2}>
          <CameraOutlined /> AI图片分析
        </Title>
        <Text type="secondary">
          上传图片，AI将为您分析图片内容、识别对象并提供详细描述
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：上传和预览区域 */}
        <Col xs={24} lg={12}>
          <Card title="图片上传" className="upload-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 上传区域 */}
              <Dragger {...uploadProps} disabled={uploading}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 JPG、PNG、GIF 格式，文件大小不超过 20MB
                </p>
              </Dragger>

              {/* 图片预览 */}
              {imageUrl && (
                <div className="image-preview">
                  <Title level={4}>图片预览</Title>
                  <div className="preview-container">
                    <Image
                      src={imageUrl}
                      alt="上传的图片"
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                      preview={{
                        mask: <EyeOutlined />,
                        maskClassName: 'preview-mask'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <Space>
                <Button 
                  type="primary" 
                  icon={<RobotOutlined />}
                  loading={loading}
                  onClick={handleReanalyze}
                  disabled={!imageUrl}
                >
                  {loading ? 'AI分析中...' : '开始分析'}
                </Button>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setImageUrl('');
                    setAnalysisResult(null);
                    setLoading(false);
                    setUploading(false);
                  }}
                >
                  重新上传
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 右侧：分析结果区域 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RobotOutlined />
                AI分析结果
                {analysisResult && (
                  <Button 
                    type="link" 
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadReport}
                    size="small"
                  >
                    下载报告
                  </Button>
                )}
              </Space>
            }
            className="analysis-card"
          >
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <Text style={{ marginTop: 16, display: 'block' }}>
                  AI正在分析图片内容...
                </Text>
                <Progress 
                  percent={75} 
                  status="active" 
                  style={{ marginTop: 16, width: 200 }}
                />
              </div>
            ) : analysisResult ? (
              <div className="analysis-result">
                <Text>{analysisResult}</Text>
              </div>
            ) : (
              <div className="empty-result">
                <RobotOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  请上传图片并点击"开始分析"按钮
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PhotoAnalysis; 