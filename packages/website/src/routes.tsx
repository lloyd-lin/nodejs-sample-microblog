import React from 'react';
import { createBrowserRouter, ScrollRestoration, Outlet } from 'react-router-dom';
import App from './App';
import WorkflowPage from './components/gallery/WorkflowPage';
import PhotoAnalysisPage from './components/gallery/ai/PhotoAnalysisPage';

// 定义一个包含 Outlet 和 ScrollRestoration 的根布局组件
const RootLayout = () => {
  return (
    <>

      <main>
        <Outlet /> {/* 👈 子路由会在这里渲染 */}
      </main>

      <ScrollRestoration /> {/* 👈 2. 在布局中添加该组件 */}
    </>
  );
};
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/workflow',
        element: <WorkflowPage />,
      },
      {
        path: '/photo-analysis',
        element: <PhotoAnalysisPage />,
      },
    ],
  },
]); 