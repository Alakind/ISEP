import React, {useEffect, useState} from 'react';
import { Themes } from "../utils/constants.tsx";

function ThemeSwitch() {

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
        <span onClick={() => switchTheme()}>
            <i className="bi bi-moon"></i>
        </span>
    )
}
export default ThemeSwitch;
