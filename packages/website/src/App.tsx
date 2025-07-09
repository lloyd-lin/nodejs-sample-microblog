import React from 'react';
import { Layout } from 'antd';
import StarField from './components/StarField';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatbotBubble from './components/ChatbotBubble';
import RainSection from './components/RainSection';
import BackToTopButton from './components/BackToTopButton';

const { Content } = Layout;

const App: React.FC = () => {
  const RainAbout = RainSection(About);
  const RainProjects = RainSection(Projects);
  const RainContact = RainSection(Contact);
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <StarField />
      <Header />
      <Content>
        <Hero />
        <RainAbout />
        <Skills />
        <RainProjects />
        <RainContact />
      </Content>
      <Footer />
      <ChatbotBubble />
      
      {/* 回到顶部按钮 */}
      <BackToTopButton />
    </Layout>
  );
};

export default App; 