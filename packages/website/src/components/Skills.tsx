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
} from 'react-icons/si';
import { CloudOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Skills: React.FC = () => {
  const radarChartRef = useRef<HTMLDivElement>(null);

  const skillsPos = ["前端", "后端", "Devops", "AI集成", "团队管理"];
  const skillsData = [
    {
      前端: 8,
      后端: 7,
      Devops: 7,
      AI集成: 6,
      团队管理: 5,
    },
  ];

  // 技术栈数据（按分类组织，包含官方logo）
  const techStackCategories = [
    {
      category: "前端框架",
      icon: <SiReact style={{ color: "#61dafb" }} />,
      color: "#1890ff",
      technologies: [
        { name: "React", level: "精通", color: "#61dafb", icon: <SiReact /> },
        { name: "Vue 3", level: "熟练", color: "#4fc08d", icon: <SiVuedotjs /> },
        { name: "Next.js", level: "熟练", color: "#000000", icon: <SiNextdotjs /> },
        { name: "Nuxt.js", level: "了解", color: "#00dc82", icon: <SiNuxtdotjs /> },
      ]
    },
    {
      category: "编程语言",
      icon: <SiTypescript style={{ color: "#3178c6" }} />,
      color: "#52c41a",
      technologies: [
        { name: "TypeScript", level: "精通", color: "#3178c6", icon: <SiTypescript /> },
        { name: "JavaScript", level: "精通", color: "#f7df1e", icon: <SiJavascript /> },
        { name: "Python", level: "熟练", color: "#3776ab", icon: <SiPython /> },
        { name: "Java", level: "了解", color: "#ed8b00", icon: <SiOpenjdk /> },
      ]
    },
    {
      category: "后端技术",
      icon: <SiNodedotjs style={{ color: "#339933" }} />,
      color: "#fa8c16",
      technologies: [
        { name: "Node.js", level: "精通", color: "#339933", icon: <SiNodedotjs /> },
        { name: "Express", level: "熟练", color: "#000000", icon: <SiExpress /> },
        { name: "NestJS", level: "熟练", color: "#e0234e", icon: <SiNestjs /> },
        { name: "Koa", level: "了解", color: "#33333d", icon: <SiKoa /> },
      ]
    },
    {
      category: "数据库",
      icon: <SiMysql style={{ color: "#4479a1" }} />,
      color: "#722ed1",
      technologies: [
        { name: "MySQL", level: "熟练", color: "#4479a1", icon: <SiMysql /> },
        { name: "Redis", level: "熟练", color: "#dc382d", icon: <SiRedis /> },
        { name: "MongoDB", level: "了解", color: "#47a248", icon: <SiMongodb /> },
        { name: "PostgreSQL", level: "了解", color: "#336791", icon: <SiPostgresql /> },
      ]
    },
    {
      category: "开发工具",
      icon: <SiWebpack style={{ color: "#8dd6f9" }} />,
      color: "#eb2f96",
      technologies: [
        { name: "Webpack", level: "熟练", color: "#8dd6f9", icon: <SiWebpack /> },
        { name: "Vite", level: "精通", color: "#646cff", icon: <SiVite /> },
        { name: "Docker", level: "熟练", color: "#2496ed", icon: <SiDocker /> },
        { name: "Git", level: "精通", color: "#f05032", icon: <SiGit /> },
      ]
    },
    {
      category: "云服务",
      icon: <CloudOutlined style={{ color: "#ff9900" }} />,
      color: "#13c2c2",
      technologies: [
        { name: "AWS", level: "了解", color: "#ff9900", icon: <CloudOutlined /> },
        { name: "Sealos", level: "熟练", color: "#1c7ed6", icon: <SiKubernetes /> },
        { name: "Vercel", level: "熟练", color: "#000000", icon: <SiVercel /> },
        { name: "Nginx", level: "熟练", color: "#009639", icon: <SiNginx /> },
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

  // 初始化雷达图
  useEffect(() => {
    if (!radarChartRef.current) return;

    // 清除之前的图表
    radarChartRef.current.innerHTML = "";

    // 设置极坐标系（雷达图）

    const chart = new Chart({
      container: radarChartRef.current,
      autoFit: true,
      paddingTop: 16,
      height: 350,
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
              console.log(d, index, data, i);
              if (i === 4 && d === 0) {
                return true;
              }
              return d % 4 === 2;
            },
          },
        ])
      ),
    });
    console.log(
      Object.fromEntries(
        Array.from({ length: skillsPos.length }, (_, i) => [
          `position${i === 0 ? "" : i}`,
          {
            zIndex: 1,
            titleFontSize: 10,
            titleSpacing: 8,
            label: true,
            labelFill: "#000",
            labelOpacity: 0.45,
            labelFontSize: 10,
            line: true,
            lineFill: "#000",
            lineOpacity: 0.25,
          },
        ])
      )
    );

    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <section
      id="skills"
      style={{
        padding: "120px 0",
        backgroundColor: "white",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <Title
            level={2}
            style={{
              fontSize: "36px",
              fontWeight: 300,
              color: "#262626",
              marginBottom: "16px",
            }}
          >
            技能专长
          </Title>
          <div
            style={{
              width: "60px",
              height: "2px",
              backgroundColor: "#1890ff",
              margin: "0 auto",
            }}
          />
        </div>

        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <Title
              level={3}
              style={{
                fontSize: "24px",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              能力经验
            </Title>
            <div
              style={{
                marginTop: "-24px",
                left: '-12px',
                textAlign: "center",
                color: "#8c8c8c",
                position: "absolute",
                width: "100%"
              }}
            >
              <p>💡 基于项目经验和实际应用的技能评估</p>
            </div>
            <div
              ref={radarChartRef}
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fafafa",
              }}
            />
          </Col>

          <Col xs={24} lg={12}>
            <Title
              level={3}
              style={{
                fontSize: "24px",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              技术栈
            </Title>
            <div
              style={{
                width: "100%",
                height: "400px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fafafa",
                overflowY: "auto",
              }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {techStackCategories.map((category, index) => (
                  <div key={index}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "12px",
                      borderBottom: "1px solid #e8e8e8",
                      paddingBottom: "8px"
                    }}>
                      <span style={{ 
                        color: category.color, 
                        fontSize: "16px", 
                        marginRight: "8px" 
                      }}>
                        {category.icon}
                      </span>
                      <Text strong style={{ 
                        fontSize: "15px", 
                        color: "#262626" 
                      }}>
                        {category.category}
                      </Text>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "8px",
                      marginLeft: "24px"
                    }}>
                      {category.technologies.map((tech, techIndex) => (
                        <Tag
                          key={techIndex}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: `1px solid ${tech.color}20`,
                            backgroundColor: `${tech.color}10`,
                            color: tech.color,
                            fontSize: "12px",
                            fontWeight: "500",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span style={{ 
                            fontSize: "14px", 
                            color: tech.color,
                            display: "flex",
                            alignItems: "center"
                          }}>
                            {tech.icon}
                          </span>
                          {tech.name}
                          <span style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: getLevelColor(tech.level),
                            marginLeft: "2px",
                            verticalAlign: "middle",
                          }} />
                        </Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </Space>
              
              {/* 技能等级说明 */}
              <div style={{ 
                marginTop: "20px", 
                padding: "12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#666"
              }}>
                <Text style={{ fontSize: "11px", color: "#888" }}>技能等级：</Text>
                <Space size={8} style={{ marginLeft: "8px" }}>
                  <span><span style={{ 
                    display: "inline-block", 
                    width: "6px", 
                    height: "6px", 
                    borderRadius: "50%", 
                    backgroundColor: "#52c41a", 
                    marginRight: "4px" 
                  }} />精通</span>
                  <span><span style={{ 
                    display: "inline-block", 
                    width: "6px", 
                    height: "6px", 
                    borderRadius: "50%", 
                    backgroundColor: "#1890ff", 
                    marginRight: "4px" 
                  }} />熟练</span>
                  <span><span style={{ 
                    display: "inline-block", 
                    width: "6px", 
                    height: "6px", 
                    borderRadius: "50%", 
                    backgroundColor: "#faad14", 
                    marginRight: "4px" 
                  }} />了解</span>
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
