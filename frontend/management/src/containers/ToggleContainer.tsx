import "../styles/toggle.css";
import Toggle from "../components/Toggle.tsx";

function ToggleContainer({id, disabled, handleChange, toggleValue}: Props) {
  return (
    <Toggle id={id} toggleValue={toggleValue} handleChange={handleChange} disabled={disabled ?? false}/>
  )
}

interface Props {
  id: string;
  disabled?: boolean;
  handleChange: () => void;
  toggleValue: boolean
}

export default ToggleContainer
