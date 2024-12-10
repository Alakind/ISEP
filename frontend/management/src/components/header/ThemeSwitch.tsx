import {Themes} from "../../utils/constants.tsx";
import {ReactNode} from "react";

function ThemeSwitchContainer({switchTheme, theme} : Props): ReactNode {
  return (
    <span onClick={switchTheme}>
            <i className={`bi bi-${theme == Themes.DARK ? "sun" : "moon"}`}></i>
        </span>
  )
}

interface Props {
  switchTheme: () => void;
  theme: (typeof Themes)[keyof typeof Themes];
}
export default ThemeSwitchContainer;
