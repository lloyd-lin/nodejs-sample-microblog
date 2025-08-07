import React, { useState } from 'react';
import { Row, Col, Typography, Card, Button, Tag, Modal, Image, Space, Divider } from 'antd';
import { GithubOutlined, LinkOutlined, CloseOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { 
  SiVuedotjs, SiTypescript, SiVite, SiOpenai, SiDocker, 
  SiKubernetes, SiRedis, SiMysql, SiReact, SiWebpack, SiJenkins,
  SiExpress, SiNodedotjs, SiAmazon, SiNginx, SiJavascript, SiApacheecharts
} from 'react-icons/si';
import { DiHtml5, DiCss3 } from 'react-icons/di';
import { CloudOutlined } from '@ant-design/icons';
import desc1 from '../assets/低代码1.png';
import abtest from '../assets/abtest.png';
import channel from '../assets/channel2.png';

const { Title, Paragraph, Text } = Typography;

interface ProjectDetails {
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  desc?: string;
  image: string;
  duration: string;
  team: string;
  role: string;
  achievements: string[];
  technologies: string[];
  challenges: string[];
  githubUrl?: string;
  demoUrl?: string;
  screenshots?: string[];
}

const Projects: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  // 技术图标映射
  const getTechIcon = (techName: string, size: number = 12) => {
    const iconStyle = { fontSize: `${size}px` };
    const iconMap: { [key: string]: React.ReactNode } = {
      'Vue': <SiVuedotjs style={{ color: '#4FC08D', ...iconStyle }} />,
      'Vue3': <SiVuedotjs style={{ color: '#4FC08D', ...iconStyle }} />,
      'Vue 3': <SiVuedotjs style={{ color: '#4FC08D', ...iconStyle }} />,
      'TypeScript': <SiTypescript style={{ color: '#3178C6', ...iconStyle }} />,
      'JavaScript': <SiJavascript style={{ color: '#F7DF1E', ...iconStyle }} />,
      'Vite': <SiVite style={{ color: '#646CFF', ...iconStyle }} />,
      'React': <SiReact style={{ color: '#61DAFB', ...iconStyle }} />,
      'React 18': <SiReact style={{ color: '#61DAFB', ...iconStyle }} />,
      'Node.js': <SiNodedotjs style={{ color: '#339933', ...iconStyle }} />,
      'Express': <SiExpress style={{ color: '#000000', ...iconStyle }} />,
      'Docker': <SiDocker style={{ color: '#2496ED', ...iconStyle }} />,
      'K8s': <SiKubernetes style={{ color: '#326CE5', ...iconStyle }} />,
      'Kubernetes': <SiKubernetes style={{ color: '#326CE5', ...iconStyle }} />,
      'Redis': <SiRedis style={{ color: '#DC382D', ...iconStyle }} />,
      'MySQL': <SiMysql style={{ color: '#4479A1', ...iconStyle }} />,
      'ECharts': <SiApacheecharts style={{ color: '#AA344D', ...iconStyle }} />,
      'Jenkins': <SiJenkins style={{ color: '#D24939', ...iconStyle }} />,
      'Webpack': <SiWebpack style={{ color: '#8DD6F9', ...iconStyle }} />,
      'Nginx': <SiNginx style={{ color: '#009639', ...iconStyle }} />,
      'OpenAI': <SiOpenai style={{ color: '#412991', ...iconStyle }} />,
      'GPT-4': <SiOpenai style={{ color: '#412991', ...iconStyle }} />,
      '阿里云': <CloudOutlined style={{ color: '#FF6A00', ...iconStyle }} />,
      'AWS': <SiAmazon style={{ color: '#FF9900', ...iconStyle }} />,
      'AI/LLM': <SiOpenai style={{ color: '#412991', ...iconStyle }} />,
      '低代码': <span style={{ color: '#722ed1', ...iconStyle }}>🧩</span>,
      '性能优化': <span style={{ color: '#eb2f96', ...iconStyle }}>⚡</span>,
      '微前端': <SiReact style={{ color: '#61DAFB', ...iconStyle }} />,
      'Hybrid': <span style={{ color: '#13c2c2', ...iconStyle }}>📱</span>,
      'Midwayjs': <span style={{ color: '#722ed1', ...iconStyle }} ><img src='https://midwayjs.org/en/img/logo.svg' style={{ width: '14px', height: '14px' }} /></span>,
      'Pinia': <span style={{ color: '#722ed1', ...iconStyle }} ><img src='https://pinia.vuejs.org/logo.svg' style={{ width: '14px', height: '14px' }} /></span>,
    };

    // 尝试匹配技术名称（忽略大小写，支持部分匹配）
    const normalizedTech = techName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalizedTech.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTech)) {
        return icon;
      }
    }
    
    // 默认图标
    return <span style={{ color: '#1890ff', ...iconStyle }}>🔧</span>;
  };

  const projects: ProjectDetails[] = [
    {
      title: '榫卯低代码平台 (蔚来)',
      description: '模型驱动的低代码平台，搭建端到端应用，集成AI能力实现代码生成和智能问数。单文件体积缩小75%，平台发布效率提升90%。',
      fullDescription: '榫卯是一个企业级的模型驱动低代码平台，旨在帮助开发者快速构建现代化的Web应用程序。平台集成了先进的AI能力，支持自然语言生成代码、智能问答等功能，大幅提升了开发效率。',
      tags: ['TypeScript', 'Vue3', 'Midwayjs', 'AI/LLM', '低代码', '微前端'],
      image: '#f0f8ff',
      desc: desc1,
      duration: '2023.10 - 2025.05',
      team: '12人团队',
      role: '资深全栈工程师',
      achievements: [
        '单文件体积缩小75%，打包速度提升300%',
        '平台发布效率提升90%，开发周期从周缩短到天',
        '集成AI代码生成，自动化程度达80%',
        '支持10+种组件类型，覆盖90%业务场景',
        '平台稳定性达99.9%，零事故运行'
      ],
      technologies: [
        'Vue 3 + TypeScript 前端框架',
        'Vite 构建',
        'Midway.js 全栈框架',
        'AI代码生成',
        'Docker + K8s 容器化部署',
        'Redis + MySQL 数据存储'
      ],
      challenges: [
        '模型驱动理念',
        '渲染自闭环',
        '复杂系统集成',
        'AI集成',
        '权限和国际化',
        '大型表单的动态渲染优化'
      ]
    },
    {
      title: 'A/B测试实验平台 (快手)',
      description: '数据中台A/B测试平台前端架构，支持万级数据量表格。加载性能从分钟级降至秒级，执行性能提升90%以上。',
      fullDescription: '为快手数据中台构建的企业级A/B测试平台，支持大规模实验管理和数据分析。平台每日处理超过10万个实验，支撑快手全业务线的产品优化决策。',
      tags: ['Vue3', 'Pinia', 'ECharts', 'Vite', '性能优化'],
      image: '#f6ffed',
      duration: '2022.08 - 2023.02',
      team: '12人团队',
      role: '前端技术专家',
      desc: abtest,
      achievements: [
        '万级数据表格加载性能从分钟级降至秒级',
        '内存占用优化60%，页面响应速度提升90%',
        '支持同时管理10000+个A/B实验',
        '实时数据可视化，支持自定义图表配置',
        '平台日活跃用户超过2000人'
      ],
      technologies: [
        'Vue 3 + Composition API',
        'Pinia 状态管理 + TypeScript',
        'ECharts 数据可视化',
        '虚拟滚动 + 分页优化',
        'WebSocket 实时数据推送',
        'Service Worker 离线缓存'
      ],
      challenges: [
        '大数据量表格的渲染性能优化',
        '复杂数据统计的实时计算',
        '多维度数据筛选的交互设计',
        '跨团队协作的组件标准化'
      ],
    },
    {
      title: '渠道平台 (陆金所)',
      description: '移动金融平台前端架构，支持5+外部APP集成。通过标准化流程，新渠道接入周期从3周缩短到5天。',
      fullDescription: '为陆金所构建的企业级渠道管理平台，支持多渠道统一接入和管理。平台采用微前端架构，实现了高度的可扩展性和维护性，服务于数百万金融用户。',
      tags: ['React', 'Node.js', 'Hybrid', '金融系统'],
      image: '#fff2e8',
      duration: '2021.10 - 2022.07',
      team: '25人团队',
      role: '前端Leader',
      desc: channel,
      achievements: [
        '新渠道接入周期从3周缩短到5天',
        '支持5+外部APP无缝集成',
        '微前端架构支持独立部署',
        'Hybrid容器性能提升200%',
        '渠道管理效率提升300%'
      ],
      technologies: [
        'React 18 + Redux Toolkit',
        'Micro-frontend 微前端架构',
        'Node.js + Express 中间层',
        'Hybrid App 容器技术',
        'Jenkins CI/CD 自动化部署',
        '阿里云服务器集群'
      ],
      challenges: [
        '多应用间的状态同步和通信',
        'Hybrid容器的性能优化',
        '金融级安全标准的实现',
        '复杂业务流程的抽象和复用'
      ],
    }
  ];

  const handleCardClick = (project: ProjectDetails) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProject(null);
  };

  return (
    <section
      id="projects"
      style={{
        padding: '80px 0 80px 0',
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
            核心项目
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
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: '24px' }}
                className="project-card"
                onClick={() => handleCardClick(project)}
                cover={
                  <div
                    style={{
                      height: '250px',
                      backgroundColor: project.image,
                      borderRadius: '12px 12px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#8c8c8c',
                      position: 'relative',
                    }}
                  >    
                    <div style={{
                      width: '80%',
                      height: '100%',
                      borderRadius: '12px 12px 0 0',
                      overflow: 'hidden',
                    }}>
                      <Image preview={false} src={project.desc} alt="project" style={{ width: '100%', height: '100%', borderRadius: '12px 12px 0 0' }} />
                    </div>
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
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {getTechIcon(tag)}
                      </span>
                      {tag}
                    </Tag>
                  ))}
                  {project.tags.length > 3 && (
                    <Tag
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#f5f5f5',
                        border: 'none',
                        color: '#999',
                        marginBottom: '4px',
                      }}
                    >
                      +{project.tags.length - 3}
                    </Tag>
                  )}
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
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<LinkOutlined />}
                    style={{
                      color: '#8c8c8c',
                      padding: '4px 8px',
                      height: 'auto',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 项目详情Modal */}
      <Modal
        title={null}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={900}
        centered
        style={{ maxHeight: '90vh' }}
        bodyStyle={{ 
          padding: 0, 
          overflow: 'hidden',
          borderRadius: '16px'
        }}
        closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '16px' }} />}
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          content: { 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        {selectedProject && (
          <div>
            {/* Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${selectedProject.image}dd, ${selectedProject.image}aa)`,
                padding: '40px 32px',
                color: '#333',
              }}
            >
              <Title level={2} style={{ color: '#333', marginBottom: '8px' }}>
                {selectedProject.title}
              </Title>
              <Space style={{ marginBottom: '16px' }}>
                <Text style={{ color: '#666' }}>
                  <CalendarOutlined style={{ marginRight: '4px' }} />
                  {selectedProject.duration}
                </Text>
                <Text style={{ color: '#666' }}>
                  <TeamOutlined style={{ marginRight: '4px' }} />
                  {selectedProject.team}
                </Text>
              </Space>
              <Paragraph style={{ color: '#555', marginBottom: 0, fontSize: '16px' }}>
                {selectedProject.fullDescription}
              </Paragraph>
            </div>

            {/* Content */}
            <div style={{ padding: '32px', maxHeight: '60vh', overflowY: 'auto' }}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
                    🎯 核心成果
                  </Title>
                  <ul style={{ paddingLeft: '20px' }}>
                    {selectedProject.achievements.map((achievement, index) => (
                      <li key={index} style={{ marginBottom: '8px', color: '#666' }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </Col>

                <Col span={12}>
                  <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
                    🛠️ 技术栈
                  </Title>
                  <ul style={{ paddingLeft: '20px' }}>
                    {selectedProject.technologies.map((tech, index) => (
                      <li key={index} style={{ marginBottom: '6px', color: '#666' }}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </Col>

                <Col span={12}>
                  <Title level={4} style={{ color: '#fa8c16', marginBottom: '16px' }}>
                    🧗 技术挑战
                  </Title>
                  <ul style={{ paddingLeft: '20px' }}>
                    {selectedProject.challenges.map((challenge, index) => (
                      <li key={index} style={{ marginBottom: '6px', color: '#666' }}>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </Col>

                <Col span={24}>
                  <Divider />
                  <Space size="large">
                    {selectedProject.githubUrl && (
                      <Button
                        type="primary"
                        icon={<GithubOutlined />}
                        size="large"
                        onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                      >
                        查看代码
                      </Button>
                    )}
                    {selectedProject.demoUrl && (
                      <Button
                        icon={<LinkOutlined />}
                        size="large"
                        onClick={() => window.open(selectedProject.demoUrl, '_blank')}
                      >
                        在线演示
                      </Button>
                    )}
                  </Space>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
        }
        
        .project-card:active {
          transform: translateY(-4px);
          transition: all 0.1s ease;
        }
      `}</style>
    </section>
  );
};

export default Projects; 