import {Themes} from "../../utils/constants.tsx";
import {ReactNode} from "react";

function ThemeSwitch({switchTheme, theme}: Readonly<Props>): ReactNode {
  return (
    <button className={"btn--transparent"} onClick={switchTheme}>
      <i className={`bi bi-${theme == Themes.DARK ? "sun" : "moon"}`}></i>
    </button>
  )
}

interface Props {
  switchTheme: () => void;
  theme: (typeof Themes)[keyof typeof Themes];
}

export default ThemeSwitch;
