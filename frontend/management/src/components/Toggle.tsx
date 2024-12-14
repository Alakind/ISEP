import "../styles/toggle.css";
import {ReactNode} from "react";

function Toggle({id, toggleValue, changeState, disabled, loading}: Props): ReactNode {
  return (
    <label className="switch">
      <input id={id} name={id} type="checkbox" checked={toggleValue} onChange={changeState} disabled={disabled ? disabled : loading}></input>
      <span className="slider round"></span>
    </label>
  )
}

interface Props {
  id: string;
  toggleValue: boolean;
  changeState: () => void;
  disabled: boolean;
  loading: boolean;
}

export default Toggle
