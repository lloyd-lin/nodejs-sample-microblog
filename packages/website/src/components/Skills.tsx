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
        {/* 标题区域 - 横向紧凑布局 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "24px", marginBottom: "32px" }}>
          <Title
            level={2}
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#262626",
              margin: 0,
              whiteSpace: "nowrap",
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
                width: "80px",
                height: "80px",
                backgroundColor: "white",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                border: "2px solid #1890ff20",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 预览雷达图 */}
              <div ref={previewChartRef} style={{ width: "60px", height: "60px" }} />
              {/* 角标提示 */}
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#1890ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ⚡
              </div>
            </div>
          </Tooltip>
          {/* 副标题紧跟主标题右侧 */}
          <Text style={{ fontSize: "15px", color: "#666", marginLeft: 16 }}>
            全栈开发技术能力矩阵
          </Text>
          {/* 技能等级说明 Tooltip */}
          <Tooltip
            title={
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>技能等级说明</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#52c41a", display: "inline-block", boxShadow: "0 0 6px #52c41a50" }} />
                    <span style={{ fontSize: 13, color: "#666" }}>精通</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1890ff", display: "inline-block", boxShadow: "0 0 6px #1890ff50" }} />
                    <span style={{ fontSize: 13, color: "#666" }}>熟练</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#faad14", display: "inline-block", boxShadow: "0 0 6px #faad1450" }} />
                    <span style={{ fontSize: 13, color: "#666" }}>了解</span>
                  </span>
                </div>
              </div>
            }
            placement="bottom"
          >
            <span style={{ marginLeft: 16, cursor: "pointer", color: "#1890ff", fontSize: 16 }}>🛈</span>
          </Tooltip>
        </div>

        {/* 技术栈内容区域 - 横向一行展示所有类别 */}
        <div
          style={{
            background: "white",
            padding: "24px 16px",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f0f0f0",
            overflowX: "auto",
          }}
        >
          <Row gutter={[16, 16]} wrap={false} style={{ minWidth: 1200 }}>
            {techStackCategories.map((category, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={3} key={index} style={{ minWidth: 180, flex: "0 0 180px" }}>
                <div
                  style={{
                    background: "white",
                    padding: "16px 8px",
                    borderRadius: "12px",
                    border: `2px solid ${category.themeColor}15`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    minHeight: "160px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* 顶部主题色装饰条 */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${category.themeColor}, ${category.themeColor}80)`,
                    }}
                  />
                  {/* 类别标题和图标横向排列 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", paddingTop: "4px", gap: 8 }}>
                    <span style={{ color: category.themeColor, fontSize: "22px", display: "flex", alignItems: "center" }}>
                      {category.icon}
                    </span>
                    <Text strong style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: 600, textAlign: "center", marginLeft: 4 }}>
                      {category.category}
                    </Text>
                  </div>
                  {/* 技术项目横向排列 */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                    {category.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          border: `1px solid ${tech.color}20`,
                          backgroundColor: `${tech.color}05`,
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s ease",
                          minWidth: 0,
                        }}
                      >
                        {/* 技能等级指示器 - 左侧小圆点 */}
                        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: getLevelColor(tech.level), marginRight: "6px", flexShrink: 0 }} />
                        {/* 图标 */}
                        <span style={{ fontSize: "16px", color: tech.color, display: "flex", alignItems: "center", marginRight: "6px", flexShrink: 0 }}>
                          {tech.icon}
                        </span>
                        {/* 技术名称 */}
                        <Text style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", marginRight: 4, whiteSpace: "nowrap" }}>
                          {tech.name}
                        </Text>
                        {/* 技能等级（仅用颜色/圆点区分，文字可省略或缩写） */}
                        <Text style={{ fontSize: "11px", color: getLevelColor(tech.level), fontWeight: 500, marginLeft: 2, whiteSpace: "nowrap" }}>
                          {tech.level}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default Skills;
