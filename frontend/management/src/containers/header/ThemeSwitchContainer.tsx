import ThemeSwitch from "../../components/header/ThemeSwitch.tsx";
import {useTheme} from "../../ThemeContext.tsx";

function ThemeSwitchContainer() {
  const {theme, toggleTheme} = useTheme();

  return (
    <ThemeSwitch switchTheme={toggleTheme} theme={theme}/>
  )
}

export default ThemeSwitchContainer;
