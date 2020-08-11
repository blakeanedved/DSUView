import React, { ReactNode, useContext, CSSProperties } from 'react';
import { Theme } from '../themes';

export interface ContentProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const Content = ({ children, style, className = undefined }: ContentProps) => {
  const { theme } = useContext(Theme);

  return (
    <div
      className={className}
      style={{
        margin: 'auto',
        width: '70%',
        backgroundColor: theme.content,
        padding: 50,
        borderRadius: 15,
        boxShadow: '0px 0px 124px 54px rgba(0,0,0,0.12)',
        marginTop: 104,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Content;
