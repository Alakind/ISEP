import "../styles/toggle.css";
import {ReactNode} from "react";

function Toggle({id, toggleValue, handleChange, disabled}: Props): ReactNode {
  return (
    <label className="switch">
      <input id={id} name={id} type="checkbox" checked={toggleValue} onChange={handleChange} disabled={disabled}></input>
      <span className="slider round"></span>
    </label>
  )
}

interface Props {
  id: string;
  toggleValue: boolean;
  handleChange: () => void;
  disabled: boolean;
}

export default Toggle
