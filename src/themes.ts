import { createContext } from 'react';

export interface ITheme {
  body: string;
  color: string;
  navbar: string;
  navbarColor: string;
  activeNavbarLink: string;
  content: string;
}

const themes: { [name: string]: ITheme } = {
  dark: {
    body: '#202020',
    color: '#FFFFFF',
    navbar: '#363636',
    navbarColor: '#FFFFFF',
    activeNavbarLink: '#292929',
    content: '#242424',
  },
  light: {
    body: '#EEEEEE',
    color: '#000000',
    navbar: '#363636',
    navbarColor: '#FFFFFF',
    activeNavbarLink: '#292929',
    content: '#FFFFFF',
  },
};

export const Theme = createContext({
  theme: themes.dark,
  toggleTheme: (value: boolean | undefined = undefined) => {
    return;
  },
});

export default themes;
