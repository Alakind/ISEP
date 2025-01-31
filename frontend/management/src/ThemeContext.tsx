import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {Themes} from "./utils/constants.tsx";

export const ThemeContext = createContext({
  theme: Themes.DARK,
  toggleTheme: () => {
  },
});

export const ThemeProvider = ({children}: { children: ReactNode }) => {
  const [theme, setTheme] = useState(Themes.DARK);

  useEffect(() => {
    const storedTheme = localStorage.getItem("Theme");
    if (storedTheme === Themes.LIGHT) {
      setTheme(Themes.LIGHT);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useMemo(
    () => () => {
      setTheme((prevTheme) => (prevTheme === Themes.DARK ? Themes.LIGHT : Themes.DARK));
    },
    []
  );

  const contextValue = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};