import { useState, useEffect } from 'react';
import themes, { ITheme } from '../themes';

const useTheme = (initialValue: ITheme) => {
  const [theme, setThemeState] = useState(initialValue);
  const [themeMounted, setThemeMounted] = useState(false);

  const setTheme = (value: ITheme) => {
    document.body.style.background = value.body;
    document.body.style.color = value.color;
    setThemeState(value);
  };

  const toggleTheme = (value: boolean | undefined = undefined) => {
    if (value === undefined) {
      if (theme === themes.dark) setTheme(themes.light);
      else if (theme === themes.light) setTheme(themes.dark);
    } else {
      if (value === true) setTheme(themes.dark);
      else setTheme(themes.light);
    }
  };

  useEffect(() => {
    document.body.style.background = theme.body;
    document.body.style.color = theme.color;
    setThemeMounted(true);
    return () => setThemeMounted(false);
  }, []);

  return { theme, toggleTheme, themeMounted };
};

export default useTheme;
