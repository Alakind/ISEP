import {Themes} from "../utils/constants.tsx";

function ThemeSwitchContainer({switchTheme, theme} : Props) {
  return (
    <span onClick={() => switchTheme()}>
            <i className={`bi bi-${theme == Themes.DARK ? "sun" : "moon"}`}></i>
        </span>
  )
}

interface Props {
  switchTheme: () => void;
  theme: Themes;
}
export default ThemeSwitchContainer;
