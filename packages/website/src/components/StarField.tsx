import React, { useEffect, useRef } from 'react';

/**
 * 星星对象接口定义
 */
interface Star {
  x: number;        // 星星的X坐标
  y: number;        // 星星的Y坐标
  vx: number;       // X轴速度分量
  vy: number;       // Y轴速度分量
  size: number;     // 星星大小（半径）
  opacity: number;  // 透明度
}

/**
 * 3D星空背景组件
 * 创建一个动态的星空背景，支持鼠标交互和粒子连线效果
 * 
 * 功能特性：
 * - 随机生成200个星星
 * - 鼠标悬停时星星会被吸引
 * - 大星星具有闪烁效果
 * - 鼠标附近的星星会产生连线
 * - 响应式画布大小调整
 */
const StarField: React.FC = () => {
  // Canvas元素引用，用于绘制星空
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 动画帧ID引用，用于控制动画循环
  const animationRef = useRef<number>(0);
  // 鼠标位置引用，实时追踪鼠标坐标
  const mouseRef = useRef({ x: 0, y: 0 });
  // 星星数组引用，存储所有星星对象
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // 设置画布尺寸为全屏
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    /**
     * 初始化星星数组
     * 随机生成指定数量的星星，每个星星具有随机的位置、速度、大小和透明度
     */
    const initStars = () => {
      const stars: Star[] = [];
      const starCount = 200; // 星星总数

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,           // 随机X坐标（0到画布宽度）
          y: Math.random() * canvas.height,          // 随机Y坐标（0到画布高度）
          vx: (Math.random() - 0.5) * 0.5,          // 随机X速度（-0.25到0.25）
          vy: (Math.random() - 0.5) * 0.5,          // 随机Y速度（-0.25到0.25）
          size: Math.random() * 2 + 0.5,            // 随机大小（0.5到2.5）
          opacity: Math.random() * 0.8 + 0.2,       // 随机透明度（0.2到1.0）
        });
      }
      
      starsRef.current = stars;
    };

    /**
     * 鼠标移动事件处理函数
     * 实时更新鼠标位置，用于星星的交互效果
     */
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,  // 鼠标X坐标
        y: event.clientY,  // 鼠标Y坐标
      };
    };

    /**
     * 创建径向渐变背景
     * 从中心的深蓝色渐变到边缘的深紫黑色，营造深空效果
     */
    const createGradient = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,           // 内圆：中心点，半径0
        canvas.width / 2, canvas.height / 2, canvas.width // 外圆：中心点，半径为画布宽度
      );
      gradient.addColorStop(0, '#0a0a23');    // 中心：深蓝色
      gradient.addColorStop(0.5, '#1a1a3a');  // 中间：紫蓝色
      gradient.addColorStop(1, '#000011');    // 边缘：深黑紫色
      return gradient;
    };

    /**
     * 绘制星星并处理鼠标交互
     * 主要功能：
     * 1. 计算鼠标对星星的引力作用
     * 2. 更新星星位置和速度
     * 3. 处理边界循环
     * 4. 绘制星星主体和闪烁效果
     */
    const drawStars = () => {
      const stars = starsRef.current;
      
      stars.forEach((star) => {
        // === 鼠标引力计算 ===
        const dx = mouseRef.current.x - star.x;  // X轴距离
        const dy = mouseRef.current.y - star.y;  // Y轴距离
        const distance = Math.sqrt(dx * dx + dy * dy);  // 欧几里得距离
        
        // 鼠标150像素范围内产生引力效果
        if (distance < 150) {
          const force = (150 - distance) / 150;  // 归一化力度（0-1）
          star.vx += dx * force * 0.0001;        // 应用X轴引力
          star.vy += dy * force * 0.0001;        // 应用Y轴引力
        }

        // === 位置更新 ===
        star.x += star.vx;  // 根据速度更新X坐标
        star.y += star.vy;  // 根据速度更新Y坐标

        // === 边界循环处理 ===
        // 星星超出边界时从对面重新出现，营造无限空间感
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // === 速度衰减 ===
        // 模拟阻力效果，防止星星速度无限增加
        star.vx *= 0.999;
        star.vy *= 0.999;

        // === 星星绘制 ===
        ctx.save();  // 保存当前绘制状态
        
        // 设置星星主体样式
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = star.size * 2;    // 发光效果
        ctx.shadowColor = '#ffffff';
        
        // 绘制星星主体
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // === 大星星闪烁效果 ===
        // 只有较大的星星才有蓝色闪烁核心
        if (star.size > 1.5) {
          // 使用正弦波创建闪烁效果，基于时间和位置
          const twinkle = Math.sin(Date.now() * 0.005 + star.x) * 0.3 + 0.7;
          ctx.globalAlpha = star.opacity * twinkle;
          ctx.fillStyle = '#4fc3f7';  // 蓝色核心
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();  // 恢复绘制状态
      });
    };

    /**
     * 绘制鼠标与星星之间的粒子连线
     * 在鼠标100像素范围内的星星会与鼠标产生连线
     * 连线透明度根据距离动态调整，距离越近越明显
     */
    const drawParticleConnections = () => {
      const stars = starsRef.current;
      const mouse = mouseRef.current;
      
      // 设置连线样式
      ctx.strokeStyle = 'rgba(79, 195, 247, 0.2)';  // 半透明蓝色
      ctx.lineWidth = 1;  // 细线条
      
      stars.forEach((star) => {
        // === 距离计算 ===
        const dx = mouse.x - star.x;    // X轴距离
        const dy = mouse.y - star.y;    // Y轴距离
        const distance = Math.sqrt(dx * dx + dy * dy);  // 欧几里得距离
        
        // === 连线绘制 ===
        // 只有在100像素范围内才绘制连线
        if (distance < 100) {
          // 根据距离计算透明度：距离越近，连线越明显
          const opacity = (100 - distance) / 100 * 0.5;  // 透明度范围：0到0.5
          
          ctx.save();  // 保存绘制状态
          ctx.globalAlpha = opacity;  // 应用动态透明度
          
          // 绘制从星星到鼠标的连线
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);    // 起点：星星位置
          ctx.lineTo(mouse.x, mouse.y);  // 终点：鼠标位置
          ctx.stroke();  // 绘制线条
          
          ctx.restore();  // 恢复绘制状态
        }
      });
    };

    /**
     * 动画主循环
     * 每帧执行的操作：
     * 1. 绘制渐变背景（清除上一帧）
     * 2. 绘制所有星星和交互效果
     * 3. 绘制粒子连线
     * 4. 请求下一帧动画
     */
    const animate = () => {
      // 绘制渐变背景，同时清除上一帧内容
      ctx.fillStyle = createGradient();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星（包含交互效果）
      drawStars();
      // 绘制鼠标连线效果
      drawParticleConnections();
      
      // 请求下一帧动画，形成60fps的流畅动画
      animationRef.current = requestAnimationFrame(animate);
    };

    // === 初始化和启动 ===
    initStars();  // 初始化星星数组
    animate();    // 启动动画循环

    /**
     * 画布尺寸调整处理函数
     * 当窗口大小变化时重新调整画布尺寸并重新初始化星星
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;   // 更新画布宽度
      canvas.height = window.innerHeight; // 更新画布高度
      initStars();  // 重新初始化星星位置
    };
    
    // === 事件监听器注册 ===
    resizeCanvas();  // 首次调用确保画布尺寸正确
    window.addEventListener('mousemove', handleMouseMove);  // 监听鼠标移动
    window.addEventListener('resize', resizeCanvas);        // 监听窗口大小变化

    // === 清理函数 ===
    // 组件卸载时移除事件监听器和取消动画帧，防止内存泄漏
    return () => {
      window.removeEventListener('resize', resizeCanvas);     // 移除窗口大小监听
      window.removeEventListener('mousemove', handleMouseMove); // 移除鼠标移动监听
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);  // 取消动画循环
      }
    };
  }, []);

  // === 组件渲染 ===
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',        // 固定定位，不随页面滚动
        top: 0,                   // 顶部对齐
        left: 0,                  // 左侧对齐
        width: '100%',            // 占满视窗宽度
        height: '100%',           // 占满视窗高度
        zIndex: -1,               // 置于所有内容之后作为背景
        pointerEvents: 'none',    // 不拦截鼠标事件，让用户可以点击页面内容
      }}
    />
  );
};

export default StarField; 