import "../styles/toggle.css";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import { updateAccess } from "../utils/apiFunctions.tsx";

function Toggle({ checked, subUrl, disabled } : Props) {
  const [toggleValue, setToggleValue] = useState<boolean>(checked ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState() {
    setLoading(true);
    try {
      await updateAccess(subUrl, !toggleValue);
      setToggleValue(!toggleValue);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="switch">
      <input type="checkbox" checked={toggleValue} onChange={changeState} disabled={disabled ? disabled : loading}></input>
      <span className="slider round"></span>
    </label>
  )
}

interface Props {
  checked: boolean|undefined;
  subUrl: string;
  disabled: boolean;
}

export default Toggle
