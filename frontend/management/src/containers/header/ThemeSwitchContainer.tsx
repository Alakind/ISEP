import {useEffect, useState} from 'react';
import { Themes } from "../../utils/constants.tsx";
import ThemeSwitch from "../../components/header/ThemeSwitch.tsx";

function ThemeSwitchContainer() {

    const [theme, setTheme] = useState<(typeof Themes)[keyof typeof Themes]>(Themes.DARK);

    useEffect((): void => {
        let storedTheme: string | null = localStorage.getItem("Theme");
        if (storedTheme == "LIGHT") {
            setTheme(Themes.LIGHT);
        }
    }, []);

    useEffect((): void => {
        localStorage.setItem("Theme", theme === Themes.DARK ? "DARK" : "LIGHT");
        document.querySelector("body")?.setAttribute("data-theme", theme.toString())
    }, [theme]);

    function switchTheme(): void {
        setTheme((theme: string): string => (
          theme === Themes.DARK ? Themes.LIGHT : Themes.DARK
        ));
    }

    return (
       <ThemeSwitch switchTheme={switchTheme} theme={theme}/>
    )
}
export default ThemeSwitchContainer;
