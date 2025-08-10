import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [current, setCurrent] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // 检测当前可见的section
      const sections = ['hero', 'about', 'skills', 'projects', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3; // 使用视窗中心作为参考点
      
      let activeSection = 'hero'; // 默认激活hero
      
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const sectionBottom = sectionTop + section.offsetHeight;
          // 如果当前滚动位置在这个section范围内
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = sections[i];
            break;
          }
          // 如果滚动位置超过了这个section，继续检查下一个
          else if (scrollPosition >= sectionTop) {
            activeSection = sections[i];
          }
        }
      }
      setCurrent(activeSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { key: 'hero', label: '首页' },
    { key: 'about', label: '关于我' },
    { key: 'gallery', label: '样板间' },
    // { key: 'skills', label: '技术栈' },
    { key: 'projects', label: '项目经历' },
    { key: 'contact', label: '联系我' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrent(sectionId);
      // 关闭移动端菜单
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
        maxWidth: '1600px', 
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
          onClick={handleMobileMenuToggle}
        />
      </div>

              {/* Mobile Menu Drawer */}
        <Drawer
          placement="right"
          closable={false}
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
          styles={{
            body: { padding: 0 },
            header: { 
              borderBottom: '1px solid #f0f0f0',
              padding: '0 24px'
            }
          }}
        >
        <div style={{ padding: '0' }}>
          {menuItems.map(item => (
            <div
              key={item.key}
              onClick={() => scrollToSection(item.key)}
              style={{
                padding: '16px 24px',
                cursor: 'pointer',
                borderBottom: '1px solid #f5f5f5',
                color: current === item.key ? '#1890ff' : '#262626',
                fontWeight: current === item.key ? 600 : 400,
                transition: 'all 0.3s ease',
                backgroundColor: current === item.key ? '#f0f8ff' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = current === item.key ? '#e6f7ff' : '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = current === item.key ? '#f0f8ff' : 'transparent';
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </Drawer>

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

        /* 移动端菜单样式优化 */
        .ant-drawer-content-wrapper {
          z-index: 1001;
        }
        
        .ant-drawer-mask {
          z-index: 1000;
        }
      `}</style>
    </AntHeader>
  );
};

export default Header; 