import React, {
  ReactNode,
  useReducer,
  useEffect,
  CSSProperties,
  useMemo,
} from 'react';
import styles from '../styles/Toggle.module.scss';

const FONT_SCALING_FACTOR = 1.5;

export interface ToggleProps {
  left?: ReactNode;
  right?: ReactNode;
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  className?: string;
  size?: number;
  style?: CSSProperties;
  borderSize?: number;
}

const Toggle = ({
  left = '',
  right = '',
  checked = false,
  onToggle = () => {},
  className = '',
  style = {},
  size = 20,
  borderSize = 3,
}: ToggleProps) => {
  const [checkedState, toggleChecked] = useReducer((state: boolean) => {
    // onToggle(!state);
    return !state;
  }, checked);

  // this is necessary to fix the error of including it in the reducer
  useEffect(() => {
    onToggle(checkedState);
  }, [checkedState, onToggle]);

  const baseLRStyles: CSSProperties = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size,
      fontSize: Math.floor(size / FONT_SCALING_FACTOR),
      top: borderSize,
      position: 'absolute',
      color: 'white',
    };
  }, [borderSize, size]);

  return (
    <>
      <label
        className={`${styles.Label} ${className}`}
        style={{
          userSelect: 'none',
          width: 2 * size + 2 * borderSize,
          height: size + 2 * borderSize,
          borderRadius: 2 * size + 2 * borderSize,
          ...style,
        }}
        onClick={() => toggleChecked()}
      >
        <span
          className={checkedState ? styles.ButtonActive : styles.Button}
          style={{
            width: size,
            height: size,
            borderRadius: size,
            top: borderSize,
            left: checkedState ? `calc(100% - ${borderSize}px)` : borderSize,
          }}
        />
        <span
          style={{
            ...baseLRStyles,
            left: borderSize,
          }}
        >
          <span className={styles.CenterContainer}>{left}</span>
        </span>
        <span
          style={{
            ...baseLRStyles,
            right: borderSize,
          }}
        >
          <span className={styles.CenterContainer}>{right}</span>
        </span>
      </label>
    </>
  );
};

export default Toggle;
