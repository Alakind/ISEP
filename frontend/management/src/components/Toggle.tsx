import "../styles/toggle.css";

function Toggle({ toggleValue, changeState, disabled, loading } : Props) {
  return (
    <label className="switch">
      <input type="checkbox" checked={toggleValue} onChange={changeState} disabled={disabled ? disabled : loading}></input>
      <span className="slider round"></span>
    </label>
  )
}

interface Props {
  toggleValue: boolean;
  changeState: () => void;
  disabled: boolean;
  loading: boolean;
}

export default Toggle
