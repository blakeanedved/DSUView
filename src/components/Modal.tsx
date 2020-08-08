import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/Modal.module.scss';

export interface ModalProps {
  active: boolean;
  children: JSX.Element[] | JSX.Element;
}

const Modal = ({ active, children }: ModalProps) => {
  return createPortal(
    <div
      className={styles.ModalCover}
      style={{
        display: active ? 'block' : 'none',
        transition: 'all 2s',
        backgroundColor: active ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
      }}
    >
      <div className={styles.Modal}>{children}</div>
    </div>,
    document.body
  );
};

export default Modal;
