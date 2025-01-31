import {ReactNode, useEffect, useMemo, useState} from "react";
import {Themes} from "../constants.tsx";
import {ThemeContext} from "./ThemeContext.tsx";

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