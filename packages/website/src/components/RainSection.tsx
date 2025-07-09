// HOC，给组件添加Rain背景
import React from 'react';
import Rain from './Rain';

export default function RainSection(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    return (
      <div style={{ position: 'relative' }}>
        <Rain/>
        <Component {...props} />
      </div>
    );
  };
}