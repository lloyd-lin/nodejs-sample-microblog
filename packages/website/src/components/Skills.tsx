import React, { useEffect, useRef } from "react";
import { Row, Col, Typography, Tag, Space } from "antd";
import { Chart } from "@antv/g2";
import {
  SiReact,
  SiVuedotjs,
  SiNextdotjs,
  SiNuxtdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiOpenjdk,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiKoa,
  SiMysql,
  SiRedis,
  SiMongodb,
  SiPostgresql,
  SiWebpack,
  SiVite,
  SiDocker,
  SiGit,
  SiVercel,
  SiNginx,
  SiKubernetes,
  SiIntellijidea,
  SiWebstorm,
  SiOpenai,
  SiGithubcopilot,
} from 'react-icons/si';
import { CloudOutlined, RobotOutlined, CodeOutlined, DesktopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Skills: React.FC = () => {
  const radarChartRef = useRef<HTMLDivElement>(null);

  const skillsPos = ["前端", "后端", "Devops", "AI集成", "团队管理", "架构设计"];
  const skillsData = [
    {
      前端: 9,
      后端: 7,
      Devops: 7,
      AI集成: 6,
      团队管理: 6,
      架构设计: 8,
    },
  ];

  // 重新设计的8项技术栈数据 - 使用统一的白色背景和精心搭配的主题色
  const techStackCategories = [
    {
      category: "前端框架",
      icon: <SiReact style={{ color: "#61dafb" }} />,
      themeColor: "#61dafb", // React蓝
      technologies: [
        { name: "React", level: "精通", color: "#61dafb", icon: <SiReact /> },
        { name: "Vue 3", level: "熟练", color: "#4fc08d", icon: <SiVuedotjs /> },
        { name: "Next.js", level: "熟练", color: "#000000", icon: <SiNextdotjs /> },
        { name: "Nuxt.js", level: "了解", color: "#00dc82", icon: <SiNuxtdotjs /> },
        { name: "TypeScript", level: "精通", color: "#3178c6", icon: <SiTypescript /> },
      ]
    },
    {
      category: "后端技术",
      icon: <SiNodedotjs style={{ color: "#339933" }} />,
      themeColor: "#339933", // Node绿
      technologies: [
        { name: "Node.js", level: "精通", color: "#339933", icon: <SiNodedotjs /> },
        { name: "NestJS", level: "熟练", color: "#e0234e", icon: <SiNestjs /> },
        { name: "Express", level: "熟练", color: "#000000", icon: <SiExpress /> },
        { name: "Python", level: "熟练", color: "#3776ab", icon: <SiPython /> },
        { name: "Java", level: "了解", color: "#ed8b00", icon: <SiOpenjdk /> },
      ]
    },
    {
      category: "数据库",
      icon: <SiMysql style={{ color: "#4479a1" }} />,
      themeColor: "#4479a1", // MySQL蓝
      technologies: [
        { name: "MySQL", level: "熟练", color: "#4479a1", icon: <SiMysql /> },
        { name: "Redis", level: "熟练", color: "#dc382d", icon: <SiRedis /> },
        { name: "PostgreSQL", level: "了解", color: "#336791", icon: <SiPostgresql /> },
        { name: "MongoDB", level: "了解", color: "#47a248", icon: <SiMongodb /> },
      ]
    },
    {
      category: "云服务&DevOps",
      icon: <CloudOutlined style={{ color: "#ff9900" }} />,
      themeColor: "#ff9900", // AWS橙
      technologies: [
        { name: "Docker", level: "熟练", color: "#2496ed", icon: <SiDocker /> },
        { name: "Kubernetes", level: "了解", color: "#326ce5", icon: <SiKubernetes /> },
        { name: "AWS", level: "了解", color: "#ff9900", icon: <CloudOutlined /> },
        { name: "Vercel", level: "熟练", color: "#000000", icon: <SiVercel /> },
        { name: "Nginx", level: "熟练", color: "#009639", icon: <SiNginx /> },
      ]
    },
    {
      category: "开发工具",
      icon: <SiWebpack style={{ color: "#8dd6f9" }} />,
      themeColor: "#8dd6f9", // Webpack蓝
      technologies: [
        { name: "Webpack", level: "熟练", color: "#8dd6f9", icon: <SiWebpack /> },
        { name: "Vite", level: "精通", color: "#646cff", icon: <SiVite /> },
        { name: "Git", level: "精通", color: "#f05032", icon: <SiGit /> },
        { name: "NPM/Yarn", level: "精通", color: "#cb3837", icon: <CodeOutlined /> },
      ]
    },
    {
      category: "IDE & 编辑器",
      icon: <DesktopOutlined style={{ color: "#007acc" }} />,
      themeColor: "#007acc", // VS Code蓝
      technologies: [
        { name: "VS Code", level: "精通", color: "#007acc", icon: <DesktopOutlined /> },
        { name: "Cursor", level: "熟练", color: "#000000", icon: <CodeOutlined /> },
        { name: "WebStorm", level: "熟练", color: "#000000", icon: <SiWebstorm /> },
        { name: "IntelliJ IDEA", level: "了解", color: "#000000", icon: <SiIntellijidea /> },
      ]
    },
    {
      category: "AI & 自动化",
      icon: <RobotOutlined style={{ color: "#722ed1" }} />,
      themeColor: "#722ed1", // 紫色主题
      technologies: [
        { name: "GitHub Copilot", level: "熟练", color: "#000000", icon: <SiGithubcopilot /> },
        { name: "ChatGPT/Claude", level: "熟练", color: "#10a37f", icon: <SiOpenai /> },
        { name: "AI集成开发", level: "了解", color: "#722ed1", icon: <RobotOutlined /> },
        { name: "自动化测试", level: "熟练", color: "#52c41a", icon: <CodeOutlined /> },
      ]
    },
    {
      category: "架构设计",
      icon: <CodeOutlined style={{ color: "#1890ff" }} />,
      themeColor: "#1890ff", // 蓝色主题
      technologies: [
        { name: "微前端架构", level: "熟练", color: "#1890ff", icon: <CodeOutlined /> },
        { name: "低代码平台", level: "精通", color: "#52c41a", icon: <CodeOutlined /> },
        { name: "性能优化", level: "精通", color: "#fa8c16", icon: <CodeOutlined /> },
        { name: "系统设计", level: "熟练", color: "#722ed1", icon: <CodeOutlined /> },
      ]
    },
  ];

  // 获取技能等级对应的颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case "精通": return "#52c41a";
      case "熟练": return "#1890ff";
      case "了解": return "#faad14";
      default: return "#d9d9d9";
    }
  };

  useEffect(() => {
    if (radarChartRef.current) {
      const chart = new Chart({
        container: radarChartRef.current,
        autoFit: true,
        height: 300,
      });

    chart.options({
      type: "line",
      data: skillsData,
      coordinate: { type: "radar" },
      encode: {
        position: skillsPos,
        color: "name",
      },
      style: {
        lineWidth: 1.5,
        strokeOpacity: 0.4,
      },
      scale: Object.fromEntries(
        Array.from({ length: skillsPos.length }, (_, i) => [
          `position${i === 0 ? "" : i}`,
          {
            domainMin: 0,
            domainMax: 10,
          },
        ])
      ),
      interaction: { tooltip: { series: false } },
      axis: Object.fromEntries(
        Array.from({ length: skillsPos.length }, (_, i) => [
          `position${i === 0 ? "" : i}`,
          {
            zIndex: 1,
            titleFontSize: 10,
            titleSpacing: 18,
            label: true,
            labelFill: "#000",
            labelOpacity: 0.45,
            labelFontSize: 10,
            line: true,
            lineFill: "#000",
            lineOpacity: 0.25,
            labelFilter: (d: any, index: number, data: any) => {
              if (i === 4 && d === 0) {
                return true;
              }
              return d % 4 === 2;
            },
          },
        ])
      ),
    });

      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
    <section
      id="skills"
      style={{
        padding: "80px 0",
        backgroundColor: "#f8f9fa", // 整体保持浅灰背景形成对比
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={[32, 32]}>
          {/* 左侧：技能雷达图 */}
          <Col xs={24} lg={8}>
            <div
              style={{
                background: "white", // 雷达图容器也改为白色
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f0f0f0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
                  技能雷达图
                </Title>
                <Text style={{ color: "#666", fontSize: "14px" }}>
                  ✊六边形战士的漫漫前路
                </Text>
              </div>
              <div ref={radarChartRef} style={{ flex: 1 }} />
            </div>
          </Col>

          {/* 右侧：技术栈详情 */}
          <Col xs={24} lg={16}>
            <div
              style={{
                background: "white", // 技术栈容器改为白色
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f0f0f0",
                height: "100%",
                maxHeight: "700px", // 设置最大高度
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
                  技术栈
                </Title>
                <Text style={{ color: "#666", fontSize: "14px" }}>
                  全栈开发技术能力矩阵
                </Text>
              </div>
              
              {/* 可滚动的技术栈内容区域 */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingRight: "8px",
                  // 自定义滚动条样式
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d9d9d9 transparent",
                }}
                className="tech-stack-scroll"
              >
                <Row gutter={[16, 16]}>
                  {techStackCategories.map((category, index) => (
                    <Col xs={24} md={24} key={index}>
                      <div
                        style={{
                          background: "white", // 卡片背景为纯白色
                          padding: "24px",
                          borderRadius: "12px",
                          border: `2px solid ${category.themeColor}15`, // 使用主题色作为边框
                          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                          transition: "all 0.3s ease",
                          height: "auto",
                          minHeight: "260px", // 设置最小高度保证布局一致
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = `0 8px 24px ${category.themeColor}20`;
                          e.currentTarget.style.borderColor = `${category.themeColor}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.06)";
                          e.currentTarget.style.borderColor = `${category.themeColor}15`;
                        }}
                      >
                        {/* 顶部主题色装饰条 */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: `linear-gradient(90deg, ${category.themeColor}, ${category.themeColor}80)`,
                          }}
                        />
                        
                        {/* 类别标题和图标 - 水平布局 */}
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          marginBottom: "20px",
                          paddingTop: "8px",
                        }}>
                          <span style={{ 
                            color: category.themeColor, 
                            fontSize: "24px", 
                            marginRight: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}>
                            {category.icon}
                          </span>
                          <Text strong style={{ 
                            fontSize: "18px", 
                            color: "#1a1a1a",
                            fontWeight: "600", 
                          }}>
                            {category.category}
                          </Text>
                        </div>

                        {/* 技术项目 - 上下结构网格布局 */}
                        <div style={{ 
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                          gap: "16px",
                          justifyItems: "center",
                        }}>
                          {category.technologies.map((tech, techIndex) => (
                            <div
                              key={techIndex}
                              className="tech-item"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "16px 12px",
                                borderRadius: "12px",
                                border: `1px solid ${tech.color}20`,
                                backgroundColor: `${tech.color}05`,
                                cursor: "pointer",
                                minWidth: "90px",
                                position: "relative",
                                height: "120px", // 固定高度保证对齐
                                justifyContent: "space-between",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${tech.color}12`;
                                e.currentTarget.style.borderColor = `${tech.color}40`;
                                e.currentTarget.style.boxShadow = `0 6px 16px ${tech.color}25`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `${tech.color}05`;
                                e.currentTarget.style.borderColor = `${tech.color}20`;
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {/* 技能等级指示器 - 右上角 */}
                              <span style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: getLevelColor(tech.level),
                                boxShadow: `0 0 6px ${getLevelColor(tech.level)}60`,
                                border: "2px solid white",
                              }} />

                              {/* 图标 - 更大的尺寸 */}
                              <div style={{
                                fontSize: "40px",
                                color: tech.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "50px",
                                flex: "0 0 auto",
                              }}>
                                {tech.icon}
                              </div>

                              {/* 技术名称和等级 */}
                              <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                                flex: "1 1 auto",
                                justifyContent: "center",
                              }}>
                                <Text style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#1a1a1a",
                                  textAlign: "center",
                                  lineHeight: "1.2",
                                  wordBreak: "break-word",
                                  maxWidth: "100%",
                                }}>
                                  {tech.name}
                                </Text>

                                <Text style={{
                                  fontSize: "10px",
                                  color: getLevelColor(tech.level),
                                  fontWeight: "600",
                                  textAlign: "center",
                                  padding: "2px 6px",
                                  borderRadius: "8px",
                                  backgroundColor: `${getLevelColor(tech.level)}15`,
                                  border: `1px solid ${getLevelColor(tech.level)}30`,
                                }}>
                                  {tech.level}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
              
              {/* 技能等级说明 - 固定在底部 */}
              <div style={{ 
                marginTop: "16px", 
                padding: "16px",
                backgroundColor: "#fafbfc",
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
                textAlign: "center",
                flexShrink: 0, // 防止被压缩
              }}>
                <Text style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>技能等级说明</Text>
                <Space size={24} style={{ marginTop: "8px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ 
                      display: "inline-block", 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#52c41a",
                      boxShadow: "0 0 4px #52c41a50",
                    }} />
                    <Text style={{ fontSize: "12px", color: "#666" }}>精通</Text>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ 
                      display: "inline-block", 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#1890ff",
                      boxShadow: "0 0 4px #1890ff50",
                    }} />
                    <Text style={{ fontSize: "12px", color: "#666" }}>熟练</Text>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ 
                      display: "inline-block", 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#faad14",
                      boxShadow: "0 0 4px #faad1450",
                    }} />
                    <Text style={{ fontSize: "12px", color: "#666" }}>了解</Text>
                  </span>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Skills;
