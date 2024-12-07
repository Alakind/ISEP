import "../styles/toggle.css";
import {useState} from "react";
import {toast} from "react-toastify";
import Toggle from "../components/Toggle.tsx";

function ToggleContainer({ checked, subUrl, disabled } : Props) {
  const [toggleValue, setToggleValue] = useState<boolean>(checked ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState() {
    setLoading(true);
    try {
      // await updateAccess(subUrl, !toggleValue); //TODO remove container and component is not used anymore
      setToggleValue(!toggleValue);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Toggle toggleValue={toggleValue} changeState={changeState} disabled={disabled} loading={loading}/>
  )
}

interface Props {
  checked: boolean|undefined;
  subUrl: string;
  disabled: boolean;
}

export default ToggleContainer
