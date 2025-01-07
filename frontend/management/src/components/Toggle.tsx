import "../styles/toggle.css";
import {ReactNode} from "react";

function Toggle({id, toggleValue, handleChange, disabled, text}: Readonly<Props>): ReactNode {
  return (
    <label className="switch" data-testid={"toggle"}>
      <span className="text-left">{text[0]}</span>
      <div className="switch-container">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={toggleValue}
          onChange={handleChange}
          disabled={disabled}
        ></input>
        <span className="slider round"></span>
      </div>
      {text.length === 2 && <span className="text-right">{text[1]}</span>}
    </label>
  )
}

interface Props {
  id: string;
  toggleValue: boolean;
  handleChange: () => void;
  disabled: boolean;
  text: string[];
}

export default Toggle
