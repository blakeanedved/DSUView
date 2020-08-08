import React, { ReactNode, useContext } from 'react';
import { Theme } from '../themes';

export interface ContentProps {
  children?: ReactNode;
}

const Content = ({ children }: ContentProps) => {
  const { theme } = useContext(Theme);

  return (
    <div
      style={{
        margin: 'auto',
        width: '70%',
        backgroundColor: theme.content,
        padding: 50,
        borderRadius: 15,
        boxShadow: '0px 0px 124px 54px rgba(0,0,0,0.12)',
        marginTop: 104,
      }}
    >
      {children}
    </div>
  );
};

export default Content;
