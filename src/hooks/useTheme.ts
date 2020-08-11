import { useState, useEffect } from 'react';
import themes, { ITheme } from '../themes';

const useTheme = (initialValue: ITheme) => {
  const [theme, setThemeState] = useState(initialValue);
  const [themeMounted, setThemeMounted] = useState(false);

  const toggleTheme = (value: boolean | undefined = undefined) => {
    if (value === undefined) {
      if (theme === themes.dark) setThemeState(themes.light);
      else if (theme === themes.light) setThemeState(themes.dark);
    } else {
      if (value === true) setThemeState(themes.dark);
      else setThemeState(themes.light);
    }
  };

  useEffect(() => {
    document.body.style.background = theme.body;
    document.body.style.color = theme.color;
    setThemeMounted(true);
    return () => setThemeMounted(false);
  }, [theme]);

  return { theme, toggleTheme, themeMounted };
};

export default useTheme;
