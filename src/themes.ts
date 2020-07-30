import { createContext } from "react";

export interface ITheme {
  body: string;
  color: string;
}

const themes: { [name: string]: ITheme } = {
  dark: {
    body: "#282828",
    color: "#FFFFFF",
  },
  light: {
    body: "#FFFFFF",
    color: "#000000",
  },
};

export const Theme = createContext({
  theme: themes.dark,
  toggleTheme: (value: boolean | undefined = undefined) => {
    return;
  },
});

export default themes;
