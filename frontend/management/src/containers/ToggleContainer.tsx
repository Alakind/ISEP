import "../styles/toggle.css";
import Toggle from "../components/Toggle.tsx";

function ToggleContainer({id, disabled, handleChange, toggleValue, text}: Readonly<Props>) {
  return (
    <Toggle id={id} toggleValue={toggleValue} handleChange={handleChange} disabled={disabled ?? false} text={text}/>
  )
}

interface Props {
  id: string;
  disabled?: boolean;
  handleChange: () => void;
  toggleValue: boolean;
  text: string[]
}

export default ToggleContainer
