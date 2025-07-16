import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Typography, Tag, Space, Tooltip } from "antd";
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
  const previewChartRef = useRef<HTMLDivElement>(null);
  const tooltipChartRef = useRef<HTMLDivElement>(null);
  const [showTooltipRadar, setShowTooltipRadar] = useState(false);

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

  // 创建雷达图的函数
  const createRadarChart = (container: HTMLDivElement, height: number) => {
    const chart = new Chart({
      container,
      autoFit: true,
      height,
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
        lineWidth: 2,
        strokeOpacity: 0.8,
        fill: "#1890ff",
        fillOpacity: 0.1,
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
            titleFontSize: height > 150 ? 10 : 8,
            titleSpacing: height > 150 ? 18 : 12,
            label: true,
            labelFill: "#000",
            labelOpacity: 0.45,
            labelFontSize: height > 150 ? 10 : 8,
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
    return chart;
  };

  // 预览雷达图初始化
  useEffect(() => {
    if (previewChartRef.current) {
      const chart = createRadarChart(previewChartRef.current, 100);
      return () => {
        chart.destroy();
      };
    }
  }, []);

  // Tooltip雷达图初始化
  useEffect(() => {
    if (tooltipChartRef.current && showTooltipRadar) {
      const chart = createRadarChart(tooltipChartRef.current, 300);
      return () => {
        chart.destroy();
      };
    }
  }, [showTooltipRadar]);

  return (
    <section
      id="skills"
      style={{
        padding: "80px 0 120px 0",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* 标题区域 - 包含六边形雷达图预览 */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
            <Title
              level={2}
              style={{
                fontSize: "36px",
                fontWeight: 300,
                color: "#262626",
                margin: 0,
              }}
            >
              技能矩阵
            </Title>
            
            {/* 六边形雷达图预览 */}
            <Tooltip
              title={
                <div>
                  <div style={{ marginBottom: "8px", fontWeight: "bold", textAlign: "center" }}>技能雷达图</div>
                  <div ref={tooltipChartRef} style={{ width: "300px", height: "300px" }} />
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#999", textAlign: "center" }}>
                    六边形战士的漫漫前路
                  </div>
                </div>
              }
              overlayStyle={{ 
                maxWidth: "350px",
                backgroundColor: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              }}
              color="white"
              onOpenChange={(visible) => setShowTooltipRadar(visible)}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                  height: "120px",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                  border: "2px solid #1890ff20",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(24, 144, 255, 0.15)";
                  e.currentTarget.style.borderColor = "#1890ff40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = "#1890ff20";
                }}
              >
                {/* 预览雷达图 */}
                <div ref={previewChartRef} style={{ width: "100px", height: "100px" }} />
                
                {/* 角标提示 */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#1890ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ⚡
                </div>
              </div>
            </Tooltip>
          </div>
          
          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #1890ff, #722ed1)",
              margin: "24px auto",
              borderRadius: "2px",
            }}
          />
          <Text style={{ fontSize: "16px", color: "#666" }}>
            全栈开发技术能力矩阵
          </Text>
        </div>

        {/* 技术栈内容区域 - 全屏宽度展示 */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <Row gutter={[24, 32]}>
            {techStackCategories.map((category, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div
                  style={{
                    background: "white",
                    padding: "28px 20px",
                    borderRadius: "16px",
                    border: `2px solid ${category.themeColor}15`,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    minHeight: "320px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${category.themeColor}20`;
                    e.currentTarget.style.borderColor = `${category.themeColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.06)";
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
                  
                  {/* 类别标题和图标 */}
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "center", 
                    marginBottom: "24px",
                    paddingTop: "8px",
                  }}>
                    <span style={{ 
                      color: category.themeColor, 
                      fontSize: "32px", 
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                    }}>
                      {category.icon}
                    </span>
                    <Text strong style={{ 
                      fontSize: "16px", 
                      color: "#1a1a1a",
                      fontWeight: "600",
                      textAlign: "center",
                    }}>
                      {category.category}
                    </Text>
                  </div>

                  {/* 技术项目 */}
                  <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}>
                    {category.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px",
                          borderRadius: "10px",
                          border: `1px solid ${tech.color}20`,
                          backgroundColor: `${tech.color}05`,
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${tech.color}15`;
                          e.currentTarget.style.borderColor = `${tech.color}40`;
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${tech.color}05`;
                          e.currentTarget.style.borderColor = `${tech.color}20`;
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        {/* 技能等级指示器 - 左侧 */}
                        <span style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: getLevelColor(tech.level),
                          marginRight: "12px",
                          flexShrink: 0,
                        }} />

                        {/* 图标 */}
                        <div style={{
                          fontSize: "20px",
                          color: tech.color,
                          display: "flex",
                          alignItems: "center",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}>
                          {tech.icon}
                        </div>

                        {/* 技术名称和等级 */}
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          minWidth: 0,
                        }}>
                          <Text style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#1a1a1a",
                            lineHeight: "1.2",
                            marginBottom: "2px",
                          }}>
                            {tech.name}
                          </Text>

                          <Text style={{
                            fontSize: "11px",
                            color: getLevelColor(tech.level),
                            fontWeight: "500",
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
          
          {/* 技能等级说明 - 固定在底部 */}
          <div style={{ 
            marginTop: "32px", 
            padding: "20px",
            backgroundColor: "#fafbfc",
            borderRadius: "16px",
            border: "1px solid #f0f0f0",
            textAlign: "center",
          }}>
            <Text style={{ fontSize: "14px", color: "#666", fontWeight: "500", marginBottom: "12px", display: "block" }}>
              技能等级说明
            </Text>
            <Space size={32}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ 
                  display: "inline-block", 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  backgroundColor: "#52c41a",
                  boxShadow: "0 0 6px #52c41a50",
                }} />
                <Text style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>精通</Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ 
                  display: "inline-block", 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  backgroundColor: "#1890ff",
                  boxShadow: "0 0 6px #1890ff50",
                }} />
                <Text style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>熟练</Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ 
                  display: "inline-block", 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  backgroundColor: "#faad14",
                  boxShadow: "0 0 6px #faad1450",
                }} />
                <Text style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>了解</Text>
              </span>
            </Space>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
