// packages/website/src/components/ChatbotBubble.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Badge, Tooltip, message } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

const defualtPadding = 64;
const ChatbotBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalWidth, setModalWidth] = useState('50%');
  const [wasDragging, setWasDragging] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `你好！我是微博应用的AI助手 🤖

## 我可以帮助你：

- **了解微博应用功能** - 介绍各种功能特性
- **回答使用问题** - 解决你遇到的困难
- **提供技术支持** - 技术问题咨询
- **创作建议** - 内容创作灵感

### 支持功能特性：

1. **Markdown渲染** - 支持格式化文本显示
2. **代码高亮** - 代码块语法高亮
3. **表格展示** - 结构化数据显示
4. **链接支持** - 可点击的超链接

> 💡 **提示**: 我的回复支持完整的Markdown语法，包括代码块、表格、列表等格式！

试试问我一些问题吧！比如：
\`\`\`
如何使用这个聊天功能？
能展示一些代码示例吗？
\`\`\`

有什么可以帮助你的吗？`,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 打开聊天时清零未读计数
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // 响应式宽度计算
  useEffect(() => {
    const updateModalWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        // 小屏幕：全屏显示
        setModalWidth('100%');
      } else if (screenWidth <= 1200) {
        // 中等屏幕：80%宽度
        setModalWidth('80%');
      } else {
        // 大屏幕：最少50%宽度
        setModalWidth('50%');
      }
    };

    // 只在Modal打开时计算，避免全局影响
    if (isOpen) {
      updateModalWidth();
      window.addEventListener('resize', updateModalWidth);
      return () => window.removeEventListener('resize', updateModalWidth);
    }
  }, [isOpen]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // 发送消息到后端（流式）
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 创建助手消息
    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('http://localhost:3001/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: content,
            },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('网络请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: accumulatedContent, isStreaming: false }
                    : msg
                )
              );
              
              // 如果聊天窗口关闭，增加未读计数
              if (!isOpen) {
                setUnreadCount(prev => prev + 1);
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                const deltaContent = parsed.choices[0].delta.content;
                accumulatedContent += deltaContent;
                
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (error) {
              console.warn('解析SSE数据失败:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('消息发送失败，请重试');
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                content: '抱歉，我暂时无法回复。请稍后再试或检查网络连接。',
                isStreaming: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 拖拽处理函数
  const handleMouseDown = (e: React.MouseEvent) => {
    // 判断是否是icon
    const startX = e.clientX;
    const startY = e.clientY;
    let dragStarted = false;
    
    setDragStart({
      x: startX - position.x,
      y: startY - position.y,
    });

    const handleInitialMouseMove = (moveEvent: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(moveEvent.clientX - startX, 2) + 
        Math.pow(moveEvent.clientY - startY, 2)
      );
      
      // 如果移动距离超过5px，开始拖拽
      if (distance > 5 && !dragStarted) {     
        setPosition({
            x: startX - 30,
            y: startY - 30,
        });
        dragStarted = true;
        setIsDragging(true);
        setHasDragged(true);
      }
    };

    const handleInitialMouseUp = () => {
      document.removeEventListener('mousemove', handleInitialMouseMove);
      document.removeEventListener('mouseup', handleInitialMouseUp);
    };

    document.addEventListener('mousemove', handleInitialMouseMove);
    document.addEventListener('mouseup', handleInitialMouseUp);
    
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // 限制拖拽范围在视窗内
    const maxX = window.innerWidth - defualtPadding; // 按钮宽度
    const maxY = window.innerHeight - defualtPadding; // 按钮高度
    setPosition({
      x: Math.max(0, Math.min(dragStart.x + newX - 30, maxX)),
      y: Math.max(0, Math.min(dragStart.y + newY - 30, maxY)),
    });
    setHasDragged(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setWasDragging(true);
      // 延迟重置拖拽状态，防止立即触发点击
      setTimeout(() => {
        setWasDragging(false);
      }, 100);
    }
    setIsDragging(false);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart.x, dragStart.y, position.x, position.y]);

  // 处理点击事件（区分拖拽和点击）
  const handleBubbleClick = () => {
    // 如果刚结束拖拽，不触发点击
    if (wasDragging || isDragging) {
      return;
    }
    
    setIsOpen(true);
  };

  return (
    <>
      {/* 聊天气泡按钮 */}
      <div
        style={{
          position: 'fixed',
          bottom: !hasDragged ? '30px' : 'auto',
          right: !hasDragged ? '30px' : 'auto',
          left: hasDragged ? `${position.x}px` : 'auto',
          top: hasDragged ? `${position.y}px` : 'auto',
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <Tooltip title={isDragging ? "拖拽中..." : "AI助手"} placement="left">
          <Badge count={unreadCount} size="small" offset={[-5, 5]}>
            <Button
              ref={buttonRef}
              type="primary"
              shape="circle"
              size="large"
              icon={<RobotOutlined />}
              onClick={handleBubbleClick}
              style={{
                width: '64px',
                height: '64px',
                boxShadow: isDragging 
                  ? '0 8px 30px rgba(24, 144, 255, 0.6)' 
                  : '0 4px 20px rgba(24, 144, 255, 0.4)',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                fontSize: '24px',
                animation: isDragging ? 'none' : 'float 3s ease-in-out infinite',
                transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
                pointerEvents: 'auto',
              }}
              onMouseEnter={(e) => {
                if (!isDragging) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(24, 144, 255, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDragging) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(24, 144, 255, 0.4)';
                }
              }}
            />
          </Badge>
        </Tooltip>
      </div>

      {/* 聊天模态框 */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 0'
          }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>AI助手</div>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                在线 • 即时回复
              </div>
            </div>
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={modalWidth}
        centered={modalWidth !== '100%'}
        style={{ 
          top: modalWidth === '100%' ? 0 : undefined,
          maxWidth: modalWidth === '100%' ? '100vw' : '90vw',
          margin: modalWidth === '100%' ? 0 : undefined,
        }}
        styles={{
          body: { 
            padding: 0,
            height: modalWidth === '100%' ? '80vh' : '500px',
            maxHeight: '80vh',
          },
          header: {
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 0,
          }
        }}
        destroyOnHidden={true}
        closeIcon={<CloseOutlined />}
      >
        {/* 消息列表 */}
        <div
          style={{
            height: modalWidth === '100%' ? 'calc(80vh - 120px)' : '400px',
            maxHeight: 'calc(80vh - 120px)',
            overflowY: 'auto',
            padding: '16px',
            background: '#fafafa',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {/* 头像 */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
                      : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>

                {/* 消息气泡 */}
                <div>
                  <div
                    style={{
                      background: msg.role === 'user' ? '#1890ff' : '#ffffff',
                      color: msg.role === 'user' ? 'white' : '#333',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      wordBreak: 'break-word',
                      position: 'relative',
                      border: msg.role === 'assistant' ? '1px solid #f0f0f0' : 'none',
                    }}
                  >
                    {msg.role === 'user' ? (
                      // 用户消息保持简单文本显示
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                    ) : (
                      // AI消息使用markdown渲染
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {msg.isStreaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#1890ff',
                          borderRadius: '50%',
                          marginLeft: '8px',
                          animation: 'pulse 1s infinite',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '4px',
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* 加载指示器 */}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            background: 'white',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Enter发送，Shift+Enter换行)"
              style={{
                flex: 1,
                border: '1px solid #d9d9d9',
                borderRadius: '12px',
                padding: '12px 16px',
                resize: 'none',
                outline: 'none',
                fontSize: '14px',
                lineHeight: '1.5',
                minHeight: '20px',
                maxHeight: '100px',
                fontFamily: 'inherit',
              }}
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
              disabled={!inputValue.trim()}
              style={{
                borderRadius: '12px',
                height: '44px',
                minWidth: '44px',
              }}
            />
          </div>
        </div>
      </Modal>

      {/* CSS样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #1890ff;
            border-radius: 50%;
            animation: typing-bounce 1.4s infinite ease-in-out;
          }
          
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
          .typing-dot:nth-child(3) { animation-delay: 0s; }
          
          @keyframes typing-bounce {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Markdown 样式 */
          .markdown-content {
            line-height: 1.6;
          }
          
          .markdown-content h1,
          .markdown-content h2,
          .markdown-content h3,
          .markdown-content h4,
          .markdown-content h5,
          .markdown-content h6 {
            margin: 16px 0 8px 0;
            font-weight: 600;
            color: #333;
          }
          
          .markdown-content h1 { font-size: 20px; }
          .markdown-content h2 { font-size: 18px; }
          .markdown-content h3 { font-size: 16px; }
          .markdown-content h4 { font-size: 14px; }
          
          .markdown-content p {
            margin: 8px 0;
            color: #333;
          }
          
          .markdown-content ul,
          .markdown-content ol {
            margin: 8px 0;
            padding-left: 20px;
          }
          
          .markdown-content li {
            margin: 4px 0;
            color: #333;
          }
          
          .markdown-content blockquote {
            margin: 12px 0;
            padding: 8px 12px;
            border-left: 4px solid #1890ff;
            background: rgba(24, 144, 255, 0.05);
            border-radius: 4px;
          }
          
          .markdown-content code {
            background: rgba(24, 144, 255, 0.1);
            color: #d73a49;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
          }
          
          .markdown-content pre {
            background: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            line-height: 1.4;
          }
          
          .markdown-content pre code {
            background: none;
            color: inherit;
            padding: 0;
            border-radius: 0;
          }
          
          .markdown-content a {
            color: #1890ff;
            text-decoration: none;
          }
          
          .markdown-content a:hover {
            text-decoration: underline;
          }
          
          .markdown-content table {
            border-collapse: collapse;
            margin: 12px 0;
            width: 100%;
          }
          
          .markdown-content th,
          .markdown-content td {
            border: 1px solid #e1e4e8;
            padding: 6px 8px;
            text-align: left;
          }
          
          .markdown-content th {
            background: #f6f8fa;
            font-weight: 600;
          }
          
          .markdown-content hr {
            border: none;
            border-top: 2px solid #e1e4e8;
            margin: 16px 0;
          }
          
          .markdown-content strong {
            font-weight: 600;
            color: #333;
          }
          
          .markdown-content em {
            font-style: italic;
            color: #666;
          }

          /* 拖拽相关样式 */
          .dragging-active {
            transition: none !important;
          }
          
          .dragging-active * {
            pointer-events: none !important;
          }

          /* 代码高亮样式 */
          .hljs {
            background: #f6f8fa !important;
            color: #24292e !important;
          }
          
          .hljs-comment,
          .hljs-quote {
            color: #6a737d;
            font-style: italic;
          }
          
          .hljs-keyword,
          .hljs-selector-tag,
          .hljs-subst {
            color: #d73a49;
          }
          
          .hljs-number,
          .hljs-literal,
          .hljs-variable,
          .hljs-template-variable,
          .hljs-tag .hljs-attr {
            color: #005cc5;
          }
          
          .hljs-string,
          .hljs-doctag {
            color: #032f62;
          }
          
          .hljs-title,
          .hljs-section,
          .hljs-selector-id {
            color: #6f42c1;
          }
          
          .hljs-type,
          .hljs-class .hljs-title {
            color: #d73a49;
          }
          
          .hljs-tag,
          .hljs-name,
          .hljs-attribute {
            color: #22863a;
          }
          
          .hljs-regexp,
          .hljs-link {
            color: #032f62;
          }
          
          .hljs-symbol,
          .hljs-bullet {
            color: #e36209;
          }
          
          .hljs-built_in,
          .hljs-builtin-name {
            color: #005cc5;
          }
          
          .hljs-meta {
            color: #6a737d;
          }
          
          .hljs-deletion {
            background: #ffeef0;
          }
          
          .hljs-addition {
            background: #f0fff4;
          }
          
          .hljs-emphasis {
            font-style: italic;
          }
          
          .hljs-strong {
            font-weight: bold;
          }
        `
      }} />
    </>
  );
};

export default ChatbotBubble;