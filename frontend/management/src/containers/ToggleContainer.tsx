import "../styles/toggle.css";
import {useState} from "react";
import {toast} from "react-toastify";
import Toggle from "../components/Toggle.tsx";

function ToggleContainer({checked, subUrl, disabled}: Props) {
  const [toggleValue, setToggleValue] = useState<boolean>(checked ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState(): Promise<void> {
    setLoading(true);
    try {
      // await updateAccess(subUrl, !toggleValue); //TODO remove container and component is not used anymore
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
    <Toggle toggleValue={toggleValue} changeState={changeState} disabled={disabled} loading={loading}/>
  )
}

interface Props {
  checked: boolean | undefined;
  subUrl: string;
  disabled: boolean;
}

export default ToggleContainer
