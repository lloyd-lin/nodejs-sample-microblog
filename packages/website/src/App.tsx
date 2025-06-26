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

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <StarField />
      <Header />
      <Content>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Content>
      <Footer />
      <ChatbotBubble />
    </Layout>
  );
};

export default App; 