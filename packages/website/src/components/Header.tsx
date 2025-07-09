import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [current, setCurrent] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // 检测当前可见的section
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100; // 添加偏移量
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setCurrent(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { key: 'hero', label: '首页' },
    { key: 'about', label: '关于' },
    { key: 'skills', label: '技能' },
    { key: 'projects', label: '作品' },
    { key: 'contact', label: '联系' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrent(sectionId);
    }
  };

  // 根据滚动状态确定字体颜色
  const textColor = isScrolled ? '#262626' : '#ffffff';

  return (
    <AntHeader
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid #f0f0f0' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
        height: '64px',
        lineHeight: '64px',
      }}
    >
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo */}
        <div 
          style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            color: textColor,
            cursor: 'pointer',
            transition: 'color 0.3s ease'
          }}
          onClick={() => scrollToSection('hero')}
        >
          欢迎
        </div>

        {/* Desktop Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            flex: 1,
            justifyContent: 'center',
            minWidth: 0,
          }}
          items={menuItems.map(item => ({
            ...item,
            onClick: () => scrollToSection(item.key),
            style: {
              color: textColor,
              fontWeight: 400,
              transition: 'color 0.3s ease'
            }
          }))}
        />

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          style={{
            display: 'none',
            color: textColor,
            transition: 'color 0.3s ease'
          }}
          className="mobile-menu-btn"
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ant-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        
        .ant-menu-item:hover {
          transform: scale(1.05);
          color: ${isScrolled ? '#1890ff' : '#e6f7ff'} !important;
        }
        
        .ant-menu-item-selected {
          color: ${isScrolled ? '#1890ff' : '#e6f7ff'} !important;
        }
        
        .ant-menu-horizontal {
          line-height: 64px;
        }
        
        .ant-menu-item {
          transition: color 0.3s ease !important;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header; 