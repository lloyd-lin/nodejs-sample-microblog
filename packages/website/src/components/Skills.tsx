import React from 'react';
import { Row, Col, Typography, Progress, Tag } from 'antd';

const { Title } = Typography;

const Skills: React.FC = () => {
  const technicalSkills = [
    { name: '前端架构设计', level: 95 },
    { name: 'React/Vue 生态', level: 90 },
    { name: 'Node.js 全栈', level: 85 },
    { name: '性能优化', level: 90 },
    { name: 'AI 技术集成', level: 80 },
    { name: '团队管理', level: 85 },
  ];

  const tools = [
    'TypeScript', 'React', 'Vue3', 'Node.js', 'Express', 'Koa', 'Eggjs', 'Midwayjs',
    'Vite', 'Webpack', 'Pinia', 'Mobx', 'ECharts', 'Ant Design', 'Element UI',
    'MySQL', 'Redis', 'WebSocket', 'WASM', 'Docker', 'CI/CD', 'Git',
    'AI/LLM', '低代码平台', 'A/B测试', '微前端', 'Hybrid', 'SSR'
  ];

  return (
    <section
      id="skills"
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
            技能专长
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

        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <Title level={3} style={{ fontSize: '24px', marginBottom: '32px' }}>
              核心技能
            </Title>
            {technicalSkills.map((skill, index) => (
              <div key={index} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#262626' }}>{skill.name}</span>
                  <span style={{ fontSize: '14px', color: '#8c8c8c' }}>{skill.level}%</span>
                </div>
                <Progress
                  percent={skill.level}
                  showInfo={false}
                  strokeColor="#1890ff"
                  trailColor="#f0f0f0"
                />
              </div>
            ))}
          </Col>

          <Col xs={24} lg={12}>
            <Title level={3} style={{ fontSize: '24px', marginBottom: '32px' }}>
              技术栈
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {tools.map((tool, index) => (
                <Tag
                  key={index}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    borderRadius: '20px',
                    border: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa',
                    color: '#595959',
                  }}
                >
                  {tool}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Skills; 