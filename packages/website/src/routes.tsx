import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import WorkflowPage from './components/gallery/WorkflowPage';
import PhotoAnalysisPage from './components/gallery/ai/PhotoAnalysisPage';

export const router = createBrowserRouter([
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
]); 