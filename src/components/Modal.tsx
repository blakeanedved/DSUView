import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { createPortal } from 'react-dom';
import Content from './Content';
import useModalStyles from '../hooks/useModalStyles';

export interface ModalProps {
  active: boolean;
  children: JSX.Element[] | JSX.Element;
}

const Modal = ({ active, children }: ModalProps) => {
  const { coverTransitionStyles, modalTransitionStyles } = useModalStyles();
  const coverRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflowY = active ? 'hidden' : 'scroll';
  }, [active]);

  return createPortal(
    <>
      <CSSTransition
        nodeRef={coverRef}
        in={active}
        timeout={500}
        unmountOnExit
        addEndListener={(e: any) => {}}
        classNames={{ ...coverTransitionStyles }}
      >
        <div
          ref={coverRef}
          style={{
            background: 'rgba(0, 0, 0, 1)',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            position: 'fixed',
            zIndex: 8,
            overflow: 'hidden',
          }}
        ></div>
      </CSSTransition>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: 'auto',
          zIndex: 9,
        }}
      >
        <CSSTransition
          nodeRef={modalRef}
          in={active}
          timeout={300}
          unmountOnExit
          addEndListener={(e: any) => {}}
          classNames={{ ...modalTransitionStyles }}
        >
          <Content
            nodeRef={modalRef}
            style={{
              width: 500,
              height: 'auto',
              position: 'relative',
              margin: '30px auto 0',
              zIndex: 9,
            }}
          >
            {children}
          </Content>
        </CSSTransition>
      </div>
    </>,
    document.body
  );
};

export default Modal;
