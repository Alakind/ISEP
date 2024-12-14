import "../styles/toggle.css";
import {useState} from "react";
import {toast} from "react-toastify";
import Toggle from "../components/Toggle.tsx";

function ToggleContainer({id, checked, disabled, functionCall}: Props) {
  const [toggleValue, setToggleValue] = useState<boolean>(checked ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState(): Promise<void> {
    setLoading(true);
    try {
      if (functionCall) {
        functionCall(!toggleValue);
      }
      setToggleValue(!toggleValue);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Toggle id={id} toggleValue={toggleValue} changeState={changeState} disabled={disabled ?? false} loading={loading}/>
  )
}

interface Props {
  id: string;
  checked: boolean | undefined;
  disabled?: boolean;
  functionCall: (checked: boolean) => void;
}

export default ToggleContainer
