import {useEffect, useState} from 'react';
import { Themes } from "../utils/constants.tsx";
import ThemeSwitch from "../components/ThemeSwitch.tsx";

function ThemeSwitchContainer() {

    const [theme, setTheme] = useState<Themes>(Themes.DARK);

    useEffect(() => {
        let storedTheme = localStorage.getItem("Theme");
        if (storedTheme == "LIGHT") {
            setTheme(Themes.LIGHT);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("Theme", theme === Themes.DARK ? "DARK" : "LIGHT");
        document.querySelector("body").setAttribute("data-theme", theme.toString())
    }, [theme]);

    const switchTheme = () => {
        setTheme((theme) => (theme === Themes.DARK ? Themes.LIGHT : Themes.DARK));
    }

    return (
       <ThemeSwitch switchTheme={switchTheme} theme={theme}/>
    )
}
export default ThemeSwitchContainer;
