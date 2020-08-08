import React, { useContext } from 'react';
import { MdBrightnessHigh, MdBrightnessMedium } from 'react-icons/md';
import themes, { Theme } from '../themes';
import styles from '../styles/Navbar.module.scss';
import Toggle from './Toggle';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(Theme);
  const { pathname } = useLocation();

  return (
    <nav className={styles.Navbar} style={{ backgroundColor: theme.navbar }}>
      <div className={styles.Left}>
        <Link
          to="/"
          className={styles.Brand}
          style={{ color: theme.navbarColor }}
        >
          DSUView
        </Link>
      </div>
      <div className={styles.Right}>
        <Toggle
          size={25}
          borderSize={3}
          checked={theme === themes.dark}
          left={<MdBrightnessHigh />}
          right={<MdBrightnessMedium />}
          onToggle={(state: boolean) => toggleTheme(state)}
          className={styles.VerticalCenter}
        />
        <Link
          to="/calendar"
          className={styles.Link}
          style={{
            backgroundColor:
              pathname === '/calendar' ? theme.activeNavbarLink : 'transparent',
            color: theme.navbarColor,
          }}
        >
          Calendar
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
