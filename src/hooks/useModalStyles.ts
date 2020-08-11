import styles from '../styles/ModalTransitions.module.scss';

const useModalStyles = () => {
  return {
    coverTransitionStyles: {
      enter: styles.CoverEnter,
      enterActive: styles.CoverEnterActive,
      enterDone: styles.CoverEnterDone,
      exit: styles.CoverExit,
      exitActive: styles.CoverExitActive,
      exitDone: styles.CoverExitDone,
    },
    modalTransitionStyles: {
      enter: styles.ModalEnter,
      enterActive: styles.ModalEnterActive,
      enterDone: styles.ModalEnterDone,
      exit: styles.ModalExit,
      exitActive: styles.ModalExitActive,
      exitDone: styles.ModalExitDone,
    },
  };
};

export default useModalStyles;
