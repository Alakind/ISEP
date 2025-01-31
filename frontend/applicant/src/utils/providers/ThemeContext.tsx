import {createContext} from 'react';
import {Themes} from "../constants.tsx";

export const ThemeContext = createContext({
  theme: Themes.DARK,
  toggleTheme: () => {
  },
});


