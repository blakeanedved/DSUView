import React, {
  ReactNode,
  useContext,
  CSSProperties,
  MutableRefObject,
} from 'react';
import { Theme } from '../themes';

export interface ContentProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  nodeRef?: MutableRefObject<any>;
}

const Content = ({ children, style, className, nodeRef }: ContentProps) => {
  const { theme } = useContext(Theme);

  return (
    <div
      ref={nodeRef}
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
