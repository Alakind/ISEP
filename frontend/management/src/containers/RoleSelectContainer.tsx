import React, {useState} from 'react'
import RoleSelect from "../components/RoleSelect.tsx";
import {updateRole} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Roles} from "../utils/constants.tsx"


function RoleSelectContainer({ id, subUrl, disabled, initialRole} : Props) {
  const [selectedOption, setSelectedOption] = useState<Roles|undefined>(initialRole);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState(e) {
    setLoading(true);
    try {
      await updateRole(id, subUrl, e.target.value);
      setSelectedOption(e.target.value);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    loading
      ? <RoleSelect id={id} selectedOption={selectedOption} disabled={true} handleSelect={changeState}/>
      : <RoleSelect id={id} selectedOption={selectedOption} disabled={disabled} handleSelect={changeState}/>

  )
}

interface Props {
  id: string;
  subUrl: string;
  disabled: boolean;
  initialRole: Roles | undefined;
}

export default RoleSelectContainer
