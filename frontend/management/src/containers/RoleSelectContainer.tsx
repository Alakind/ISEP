import {useState} from 'react'
import RoleSelect from "../components/RoleSelect.tsx";
import {updateRole} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Roles} from "../utils/constants.tsx"


function RoleSelectContainer({id, subUrl, disabled, initialRole}: Props) {
  const [selectedOption, setSelectedOption] = useState<(typeof Roles)[keyof typeof Roles]>(initialRole);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState(e: { target: { value: any; }; }) {
    setLoading(true);
    try {
      const res = await updateRole(id, subUrl, e.target.value);
      e.target.value = res.role.toString();
      setSelectedOption(res.role.toString());
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
  initialRole: (typeof Roles)[keyof typeof Roles];
}

export default RoleSelectContainer
