import {Themes} from "../utils/constants.tsx";
import {useTheme} from "../utils/providers/UseTheme.tsx";

function ThemeSwitch() {
  const {theme, toggleTheme} = useTheme();
  return (
    <button className={"btn--transparent"} onClick={toggleTheme} data-testid={"theme-switch"}>
      <i className={`bi bi-${theme == Themes.DARK ? "sun" : "moon"}`}></i>
    </button>
  )
}

export default ThemeSwitch;
