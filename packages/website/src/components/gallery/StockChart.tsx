import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Space, Select, Typography, Row, Col, Statistic } from 'antd';
import { ReloadOutlined, FullscreenOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import './StockChart.css';

const { Text } = Typography;

interface StockData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

interface StockChartProps {
  preview?: boolean;
}

interface CanvasLayers {
  background: HTMLCanvasElement | null;
  data: HTMLCanvasElement | null;
  interaction: HTMLCanvasElement | null;
  overlay: HTMLCanvasElement | null;
}

const StockChart: React.FC<StockChartProps> = ({ preview = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasLayers = useRef<CanvasLayers>({
    background: null,
    data: null,
    interaction: null,
    overlay: null
  });
  const animationFrameRef = useRef<number>();
  
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<StockData | null>(null);

  const stockSymbols = [
    { value: 'AAPL', label: 'Apple Inc.' },
    { value: 'MSFT', label: 'Microsoft' },
    { value: 'GOOGL', label: 'Alphabet Inc.' },
    { value: 'TSLA', label: 'Tesla Inc.' },
    { value: 'AMZN', label: 'Amazon' }
  ];

  // 生成模拟股票数据
  const generateMockData = (symbol: string, days: number = 30): StockData[] => {
    const data: StockData[] = [];
    let basePrice = 150 + Math.random() * 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * 2 * volatility;
      const open = basePrice;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000000) + 1000000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        close: Number(close.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        volume
      });
      
      basePrice = close;
    }
    
    return data;
  };

  // 初始化Canvas层
  const initCanvasLayers = useCallback(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;

    // 清除现有canvas
    container.innerHTML = '';

    // 创建四个canvas层
    const layerNames: (keyof CanvasLayers)[] = ['background', 'data', 'interaction', 'overlay'];
    
    layerNames.forEach((layerName, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = `${index + 1}`;
      canvas.style.pointerEvents = layerName === 'interaction' ? 'auto' : 'none';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      
      container.appendChild(canvas);
      canvasLayers.current[layerName] = canvas;
    });

    // 设置交互层事件
    if (canvasLayers.current.interaction) {
      const interactionCanvas = canvasLayers.current.interaction;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = interactionCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        
        // 计算悬停的数据点
        const dataIndex = Math.floor((x / rect.width) * stockData.length);
        if (dataIndex >= 0 && dataIndex < stockData.length) {
          setHoveredDataPoint(stockData[dataIndex]);
        }
      };

      const handleMouseLeave = () => {
        setMousePosition(null);
        setHoveredDataPoint(null);
      };

      interactionCanvas.addEventListener('mousemove', handleMouseMove);
      interactionCanvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // 绘制背景层
    drawBackgroundLayer();
  }, [stockData]);

  // 绘制背景层
  const drawBackgroundLayer = useCallback(() => {
    const canvas = canvasLayers.current.background;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#ffffff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制网格线
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    
    // 垂直网格线
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // 水平网格线
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, []);

  // 绘制数据层
  const drawDataLayer = useCallback(() => {
    const canvas = canvasLayers.current.data;
    if (!canvas || stockData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 计算价格范围
    const prices = stockData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // 绘制K线图
    const candleWidth = (width / stockData.length) * 0.6;
    const candleSpacing = width / stockData.length;
    
    stockData.forEach((data, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const openY = height - ((data.open - minPrice) / priceRange) * height;
      const closeY = height - ((data.close - minPrice) / priceRange) * height;
      const highY = height - ((data.high - minPrice) / priceRange) * height;
      const lowY = height - ((data.low - minPrice) / priceRange) * height;
      
      const isRising = data.close > data.open;
      const candleColor = isRising ? '#22c55e' : '#ef4444';
      
      // 绘制影线
      ctx.strokeStyle = candleColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // 绘制实体
      ctx.fillStyle = candleColor;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      
      if (bodyHeight < 1) {
        // 十字星
        ctx.fillRect(x - candleWidth / 2, bodyTop - 0.5, candleWidth, 1);
      } else {
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }
    });
    
    // 绘制价格趋势线
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    stockData.forEach((data, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const y = height - ((data.close - minPrice) / priceRange) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }, [stockData]);

  // 绘制交互层
  const drawInteractionLayer = useCallback(() => {
    const canvas = canvasLayers.current.interaction;
    if (!canvas || !mousePosition) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制十字线
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    // 垂直线
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, 0);
    ctx.lineTo(mousePosition.x, height);
    ctx.stroke();
    
    // 水平线
    ctx.beginPath();
    ctx.moveTo(0, mousePosition.y);
    ctx.lineTo(width, mousePosition.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }, [mousePosition]);

  // 绘制覆盖层
  const drawOverlayLayer = useCallback(() => {
    const canvas = canvasLayers.current.overlay;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制悬停信息
    if (hoveredDataPoint && mousePosition) {
      const padding = 12;
      const lineHeight = 16;
      const lines = [
        `日期: ${hoveredDataPoint.date}`,
        `开盘: ${hoveredDataPoint.open.toFixed(2)}`,
        `收盘: ${hoveredDataPoint.close.toFixed(2)}`,
        `最高: ${hoveredDataPoint.high.toFixed(2)}`,
        `最低: ${hoveredDataPoint.low.toFixed(2)}`,
        `成交量: ${hoveredDataPoint.volume.toLocaleString()}`
      ];
      
      // 计算tooltip尺寸
      ctx.font = '12px Arial';
      const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
      const tooltipWidth = maxWidth + padding * 2;
      const tooltipHeight = lines.length * lineHeight + padding * 2;
      
      // 计算tooltip位置
      let tooltipX = mousePosition.x + 10;
      let tooltipY = mousePosition.y - tooltipHeight - 10;
      
      if (tooltipX + tooltipWidth > width) {
        tooltipX = mousePosition.x - tooltipWidth - 10;
      }
      if (tooltipY < 0) {
        tooltipY = mousePosition.y + 10;
      }
      
      // 绘制tooltip背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
      
      // 绘制tooltip文本
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      
      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          tooltipX + padding,
          tooltipY + padding + (index + 1) * lineHeight
        );
      });
    }
    
    // 绘制加载动画
    if (isLoading) {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 20;
      
      ctx.strokeStyle = '#1890ff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      const angle = (Date.now() / 10) % 360;
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = startAngle + Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.stroke();
    }
  }, [hoveredDataPoint, mousePosition, isLoading]);

  // 动画循环
  const animate = useCallback(() => {
    drawInteractionLayer();
    drawOverlayLayer();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawInteractionLayer, drawOverlayLayer]);

  // 初始化图表
  const initChart = () => {
    if (!chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    
    chartInstance.current = echarts.init(chartRef.current);
    
    const option = {
      grid: [
        {
          left: '60px',
          right: '60px',
          top: '10%',
          height: '60%'
        },
        {
          left: '60px',
          right: '60px',
          top: '75%',
          height: '20%'
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: stockData.map(item => item.date),
          scale: true,
          splitLine: { show: false },
          axisLabel: { show: !preview }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: stockData.map(item => item.date),
          scale: true,
          axisLabel: { show: false }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitLine: { 
            lineStyle: { color: '#f0f0f0' }
          },
          axisLabel: { show: !preview }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: preview ? [] : [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 70,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 70,
          end: 100
        }
      ],
      series: [
        {
          name: selectedSymbol,
          type: 'candlestick',
          data: stockData.map(item => [item.open, item.close, item.low, item.high]),
          itemStyle: {
            color: '#ef4444',
            color0: '#22c55e',
            borderColor: '#ef4444',
            borderColor0: '#22c55e'
          },
          markPoint: preview ? undefined : {
            data: [
              {
                name: '最高值',
                type: 'max',
                valueDim: 'highest'
              },
              {
                name: '最低值',
                type: 'min',
                valueDim: 'lowest'
              }
            ]
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: stockData.map(item => item.volume),
          itemStyle: {
            color: function(params: any) {
              const dataIndex = params.dataIndex;
              if (dataIndex === 0) return '#1890ff';
              return stockData[dataIndex].close >= stockData[dataIndex].open ? '#22c55e' : '#ef4444';
            }
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params: any) {
          if (params.length < 2) return '';
          const candleData = params[0];
          const volumeData = params[1];
          return `
            ${candleData.name}<br/>
            开盘: ${candleData.data[1]}<br/>
            收盘: ${candleData.data[2]}<br/>
            最低: ${candleData.data[3]}<br/>
            最高: ${candleData.data[4]}<br/>
            成交量: ${volumeData.data.toLocaleString()}
          `;
        }
      }
    };
    
    chartInstance.current.setOption(option);
  };

  // 加载数据
  const loadData = async (symbol: string) => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = generateMockData(symbol);
    setStockData(data);
    
    // 更新价格信息
    const latestData = data[data.length - 1];
    const previousData = data[data.length - 2];
    
    setCurrentPrice(latestData.close);
    const change = latestData.close - previousData.close;
    const changePercent = (change / previousData.close) * 100;
    
    setPriceChange(change);
    setPriceChangePercent(changePercent);
    
    setIsLoading(false);
  };

  // 刷新数据
  const refreshData = () => {
    loadData(selectedSymbol);
  };

  // 符号变更
  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    loadData(symbol);
  };

  useEffect(() => {
    loadData(selectedSymbol);
  }, []);

  useEffect(() => {
    if (stockData.length > 0) {
      if (preview) {
        initChart();
      } else {
        initCanvasLayers();
        drawDataLayer();
        // 启动动画循环
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animate();
      }
    }
  }, [stockData, preview, initCanvasLayers, drawDataLayer, animate]);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
      if (!preview && stockData.length > 0) {
        initCanvasLayers();
        drawDataLayer();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [preview, stockData, initCanvasLayers, drawDataLayer]);

  return (
    <div className="stock-chart-container">
      {!preview && (
        <div className="stock-toolbar">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space size="large">
                <Space>
                  <Text strong>股票代码：</Text>
                  <Select
                    style={{ width: 140 }}
                    value={selectedSymbol}
                    onChange={handleSymbolChange}
                    options={stockSymbols}
                  />
                </Space>
                <Space direction="vertical" size={0}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>当前价格</Text>
                  <Statistic
                    value={currentPrice}
                    precision={2}
                    prefix="$"
                    valueStyle={{ 
                      fontSize: '18px',
                      color: priceChange >= 0 ? '#22c55e' : '#ef4444'
                    }}
                  />
                </Space>
                <Space direction="vertical" size={0}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>涨跌幅</Text>
                  <Statistic
                    value={priceChangePercent}
                    precision={2}
                    suffix="%"
                    valueStyle={{ 
                      fontSize: '16px',
                      color: priceChange >= 0 ? '#22c55e' : '#ef4444'
                    }}
                    prefix={priceChange >= 0 ? '+' : ''}
                  />
                </Space>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={refreshData}
                  loading={isLoading}
                >
                  刷新
                </Button>
                <Button icon={<FullscreenOutlined />}>
                  全屏
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}
      
      <div className={`stock-chart-wrapper ${preview ? 'preview-mode' : ''}`}>
        {preview ? (
          <>
            <div 
              ref={chartRef} 
              className="stock-chart" 
              style={{ 
                height: '160px',
                width: '100%'
              }}
            />
            <div className="chart-preview-overlay">
              <Text type="secondary">股票K线图预览</Text>
            </div>
          </>
        ) : (
          <div 
            ref={canvasContainerRef}
            className="canvas-container"
            style={{
              position: 'relative',
              width: '100%',
              height: '400px'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StockChart; 