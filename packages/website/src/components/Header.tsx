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
            color: '#262626',
            cursor: 'pointer'
          }}
          onClick={() => scrollToSection('hero')}
        >
          林高
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
              color: '#262626',
              fontWeight: 400,
            }
          }))}
        />

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          style={{
            display: 'none',
            color: '#262626',
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
          color: #1890ff !important;
        }
        
        .ant-menu-item-selected {
          color: #1890ff !important;
        }
        
        .ant-menu-horizontal {
          line-height: 64px;
        }
        
        .ant-menu-horizontal > .ant-menu-item {
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .ant-menu-horizontal > .ant-menu-item-selected {
          border-bottom-color: #1890ff;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header; 