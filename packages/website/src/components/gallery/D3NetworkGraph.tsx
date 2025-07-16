import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

interface D3NetworkGraphProps {
  preview?: boolean;
}

const D3NetworkGraph: React.FC<D3NetworkGraphProps> = ({ preview = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = preview ? 280 : 800;
    const height = preview ? 200 : 600;

    // 清理之前的内容
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 简单的示例数据
    const nodes = [
      { id: 'React', group: 1, x: width * 0.3, y: height * 0.3 },
      { id: 'Node.js', group: 2, x: width * 0.7, y: height * 0.3 },
      { id: 'TypeScript', group: 3, x: width * 0.5, y: height * 0.7 },
      { id: 'D3.js', group: 4, x: width * 0.5, y: height * 0.1 }
    ];

    const links = [
      { source: 'React', target: 'TypeScript' },
      { source: 'Node.js', target: 'TypeScript' },
      { source: 'D3.js', target: 'React' }
    ];

    // 创建力模拟
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 创建连线
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // 创建节点
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', preview ? 15 : 25)
      .attr('fill', (d: any) => d3.schemeCategory10[d.group]);

    // 添加节点标签
    if (!preview) {
      const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text((d: any) => d.id)
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', 'white')
        .style('font-weight', 'bold');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);

        label
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y);
      });
    } else {
      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });
    }

    return () => {
      simulation.stop();
    };
  }, [preview]);

  if (preview) {
    return (
      <div style={{ 
        width: '280px', 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg ref={svgRef} style={{ background: 'transparent' }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          color: 'white',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          D3 技术栈关系图
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
          🌐 D3 技术栈关系网络图
        </Title>
        <Text style={{ color: '#666', fontSize: '14px' }}>
          基于D3.js的交互式力导向图，展示技术栈之间的关系和依赖
        </Text>
      </div>

      <Card style={{ width: '100%' }}>
        <div style={{ 
          width: '100%', 
          height: '600px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'radial-gradient(ellipse at center, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '8px'
        }}>
          <svg ref={svgRef} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '12px' }}>
          💡 D3.js力导向图演示 • 展示技术栈关系网络
        </div>
      </Card>
    </div>
  );
};

export default D3NetworkGraph; 