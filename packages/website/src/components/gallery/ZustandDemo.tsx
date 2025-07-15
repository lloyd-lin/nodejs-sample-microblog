import React from 'react';
import { Card, Button, Input, List, Space, Typography, Tag, Avatar, Divider, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  MinusOutlined, 
  DeleteOutlined, 
  CheckOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import './ZustandDemo.css';

const { Title, Text } = Typography;

// 定义状态类型
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
}

interface UserState {
  user: User | null;
  isEditing: boolean;
  updateUser: (user: Partial<User>) => void;
  setEditing: (editing: boolean) => void;
  logout: () => void;
}

// 计数器Store
const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
      decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement'),
      reset: () => set({ count: 0 }, false, 'reset'),
      setCount: (count) => set({ count }, false, 'setCount'),
    }),
    { name: 'counter-store' }
  )
);

// 待办事项Store（使用Immer中间件）
const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set) => ({
        todos: [],
        filter: 'all',
        addTodo: (text) => set((state) => {
          state.todos.push({
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date(),
          });
        }),
        toggleTodo: (id) => set((state) => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
          }
        }),
        deleteTodo: (id) => set((state) => {
          state.todos = state.todos.filter(t => t.id !== id);
        }),
        setFilter: (filter) => set((state) => {
          state.filter = filter;
        }),
        clearCompleted: () => set((state) => {
          state.todos = state.todos.filter(t => !t.completed);
        }),
      })),
      { name: 'todo-store' }
    ),
    { name: 'todo-store' }
  )
);

// 用户Store（使用持久化中间件）
const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        },
        isEditing: false,
        updateUser: (userData) => set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }), false, 'updateUser'),
        setEditing: (editing) => set({ isEditing: editing }, false, 'setEditing'),
        logout: () => set({ user: null, isEditing: false }, false, 'logout'),
      }),
      { name: 'user-store' }
    ),
    { name: 'user-store' }
  )
);

// 计数器组件
const CounterSection: React.FC = () => {
  const { count, increment, decrement, reset, setCount } = useCounterStore();
  const [inputValue, setInputValue] = React.useState('');

  const handleSetCount = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num)) {
      setCount(num);
      setInputValue('');
    }
  };

  return (
    <Card title="计数器 (Zustand Basic)" className="zustand-section">
      <div className="counter-display">
        <Title level={2} className="counter-value">{count}</Title>
      </div>
      <Space wrap>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={increment}
        >
          增加
        </Button>
        <Button 
          icon={<MinusOutlined />} 
          onClick={decrement}
        >
          减少
        </Button>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={reset}
        >
          重置
        </Button>
      </Space>
      <Divider />
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="设置数值"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSetCount}
        />
        <Button type="primary" onClick={handleSetCount}>
          设置
        </Button>
      </Space.Compact>
    </Card>
  );
};

// 待办事项组件
const TodoSection: React.FC = () => {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } = useTodoStore();
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <Card 
      title="待办事项 (Zustand + Immer + Persist)" 
      className="zustand-section"
      extra={
        <Space>
          <Text type="secondary">
            活跃: {activeCount} | 完成: {completedCount}
          </Text>
        </Space>
      }
    >
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="添加新任务..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleAddTodo}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddTodo}
        >
          添加
        </Button>
      </Space.Compact>

      <Space style={{ marginBottom: 16 }}>
        <Button 
          type={filter === 'all' ? 'primary' : 'default'}
          onClick={() => setFilter('all')}
        >
          全部 ({todos.length})
        </Button>
        <Button 
          type={filter === 'active' ? 'primary' : 'default'}
          onClick={() => setFilter('active')}
        >
          活跃 ({activeCount})
        </Button>
        <Button 
          type={filter === 'completed' ? 'primary' : 'default'}
          onClick={() => setFilter('completed')}
        >
          完成 ({completedCount})
        </Button>
        {completedCount > 0 && (
          <Button 
            danger 
            onClick={clearCompleted}
          >
            清除已完成
          </Button>
        )}
      </Space>

      <List
        dataSource={filteredTodos}
        locale={{ emptyText: '暂无任务' }}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button
                key="toggle"
                type="text"
                icon={<CheckOutlined />}
                onClick={() => toggleTodo(todo.id)}
                style={{ color: todo.completed ? '#52c41a' : '#d9d9d9' }}
              />,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteTodo(todo.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={
                <Text 
                  delete={todo.completed}
                  type={todo.completed ? 'secondary' : 'success'}
                >
                  {todo.text}
                </Text>
              }
              description={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  创建于 {todo.createdAt.toLocaleString()}
                </Text>
              }
            />
            {todo.completed && <Tag color="success">已完成</Tag>}
          </List.Item>
        )}
      />
    </Card>
  );
};

// 用户信息组件
const UserSection: React.FC = () => {
  const { user, isEditing, updateUser, setEditing, logout } = useUserStore();
  const [editForm, setEditForm] = React.useState({ name: '', email: '' });

  React.useEffect(() => {
    if (user && isEditing) {
      setEditForm({ name: user.name, email: user.email });
    }
  }, [user, isEditing]);

  const handleSave = () => {
    updateUser(editForm);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setEditForm({ name: user.name, email: user.email });
    }
  };

  if (!user) {
    return (
      <Card title="用户信息 (Zustand + Persist)" className="zustand-section">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">用户已登出</Text>
          <br />
          <Button 
            type="primary" 
            style={{ marginTop: 16 }}
            onClick={() => updateUser({
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            })}
          >
            重新登录
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="用户信息 (Zustand + Persist)" 
      className="zustand-section"
      extra={
        <Space>
          {!isEditing ? (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => setEditing(true)}
            >
              编辑
            </Button>
          ) : (
            <>
              <Button 
                icon={<SaveOutlined />} 
                type="primary" 
                onClick={handleSave}
              >
                保存
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </>
          )}
          <Button danger onClick={logout}>
            登出
          </Button>
        </Space>
      }
    >
      <div className="user-profile">
        <Avatar 
          size={64} 
          src={user.avatar} 
          icon={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        
        {!isEditing ? (
          <div>
            <Title level={4}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
          </div>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="姓名"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="邮箱"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </Space>
        )}
      </div>
    </Card>
  );
};

// 主组件
const ZustandDemo: React.FC = () => {
  return (
    <div className="zustand-demo">
      <div className="zustand-header">
        <Title level={3}>🐻 Zustand 状态管理演示</Title>
        <Text type="secondary">轻量级、TypeScript友好的React状态管理库</Text>
      </div>

      <Row gutter={[24, 24]} className="zustand-row">
        <Col span={24}>
          <CounterSection />
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} className="zustand-row">
        <Col span={24}>
          <UserSection />
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} className="zustand-row">
        <Col span={24}>
          <TodoSection />
        </Col>
      </Row>

      <Card className="zustand-features" style={{ marginTop: 24 }}>
        <Title level={4}>Zustand 特性演示</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div className="feature-item">
              <Title level={5}>🎯 简单易用</Title>
              <Text>无需Provider包装，直接使用Hook</Text>
            </div>
          </Col>
          <Col span={8}>
            <div className="feature-item">
              <Title level={5}>🔧 中间件支持</Title>
              <Text>DevTools、Persist、Immer等中间件</Text>
            </div>
          </Col>
          <Col span={8}>
            <div className="feature-item">
              <Title level={5}>📦 轻量级</Title>
              <Text>仅2.5KB，性能优异</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ZustandDemo; 