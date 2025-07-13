import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Select, Typography, Row, Col, Statistic } from 'antd';
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

const StockChart: React.FC<StockChartProps> = ({ preview = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

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
    let basePrice = 150 + Math.random() * 100; // 基础价格
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 生成价格波动
      const volatility = 0.02; // 2% 波动率
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
      initChart();
    }
  }, [stockData, preview]);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

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
        <div 
          ref={chartRef} 
          className="stock-chart" 
          style={{ 
            height: preview ? '160px' : '400px',
            width: '100%'
          }}
        />
        
        {preview && (
          <div className="chart-preview-overlay">
            <Text type="secondary">股票K线图预览</Text>
          </div>
        )}
        
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <Text>加载中...</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart; 