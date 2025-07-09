import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    // 初始检查
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 如果不可见则不渲染
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '110px',
        right: '30px',
        zIndex: 999,
      }}
    >
      <Tooltip title="回到顶部" placement="left">
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<UpOutlined />}
          onClick={scrollToTop}
          style={{
            width: '48px',
            height: '48px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          }}
        />
      </Tooltip>
    </div>
  );
};

export default BackToTopButton; 