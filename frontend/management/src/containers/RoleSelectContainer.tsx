import {ChangeEvent, ReactNode, useState} from 'react'
import RoleSelect from "../components/RoleSelect.tsx";
import {updateUser} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Roles} from "../utils/constants.tsx"
import {UserInterface} from "../utils/types.tsx";

function RoleSelectContainer({id, disabled, initialRole}: Props): ReactNode {
  const [selectedOption, setSelectedOption] = useState<(typeof Roles)[keyof typeof Roles]>(initialRole);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeState(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    setLoading(true);
    try {
      const res: { data: Partial<UserInterface> } = await updateUser(id, {role: e.target.value});
      if (res.data.role !== undefined) {
        e.target.value = res.data.role.toString();
        setSelectedOption(res.data.role.toString());
        toast.success("Successfully changed role");
      } else {
        throw new Error("Failed to update role: role is undefined in the response.");
      }
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
    loading
      ? <RoleSelect id={id} selectedOption={selectedOption} disabled={true} handleSelect={changeState}/>
      : <RoleSelect id={id} selectedOption={selectedOption} disabled={disabled} handleSelect={changeState}/>

  )
}

interface Props {
  id: string;
  disabled: boolean;
  initialRole: (typeof Roles)[keyof typeof Roles];
}

export default RoleSelectContainer
