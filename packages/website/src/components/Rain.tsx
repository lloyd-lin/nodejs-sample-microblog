import React, { useEffect, useRef } from 'react';

const getRandomColor = () => {
  // 随机生成一个颜色，透明度0.5
  return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`;
}

const getRandomChar = () => {
  const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return chars[Math.floor(Math.random() * chars.length)];
}

const fontSize = 16;
const columnWidth = fontSize;
const columnCount = Math.floor(window.innerWidth / columnWidth);

const Rain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<any[]>([]);
  const nextChars = new Array(columnCount).fill(Math.floor(Math.random() * 100));

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // 更新所有雨滴的canvas尺寸
        dropsRef.current.forEach(drop => {
          drop.updateCanvasSize(canvas.width, canvas.height);
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 每次draw画一个文字
    const drawText = () => {
        // 需要一个颜色、字符、字体大小、位置
        // 刷一层
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < columnCount; i++) {
            const char = getRandomChar();
            const color = getRandomColor();
            const x = i * columnWidth;
            const index = nextChars[i];
            ctx.textBaseline = 'top';
            const y = index * fontSize;
            ctx.fillStyle = color;
            ctx.font = `${fontSize}px 'Roboto Mono', sans-serif`;
            ctx.fillText(char, x, y);
            if (Math.random() > 0.99) {
                nextChars[i] = 0;
            } else {
                nextChars[i]++;
            }
        }
    }

    drawText();
    setInterval(() => {
        drawText();
    }, 80);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,                    // 背景层，在StarField(-1)之上，在内容之下
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    />
  );
};

export default Rain; 