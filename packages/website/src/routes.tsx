import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import WorkflowPage from './components/gallery/WorkflowPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/workflow',
    element: <WorkflowPage />,
  },
]); 