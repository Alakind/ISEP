import {Roles} from "../utils/constants.tsx";
import "../styles/dropdown.css";
import {ChangeEvent, ReactNode} from "react";

function RoleSelect({id, selectedOption, handleSelect, disabled}: Props): ReactNode {
  return (
    <span className="dropdown">
      {
        disabled ?
          <span className="dropdown__select dropdown__select--disabled">{selectedOption ? selectedOption.toString() : ""}</span> :
          <select id={`role-select_${id}`} onChange={(e: ChangeEvent<HTMLSelectElement>): void => handleSelect(e)} className="dropdown__select"
                  defaultValue={selectedOption ? selectedOption.toString() : ""}>
            <option value={Roles.NO_ACCESS.toString()}>{Roles.NO_ACCESS.toString()}</option>
            <option value={Roles.ADMIN.toString()}>{Roles.ADMIN.toString()}</option>
            <option value={Roles.RECRUITER.toString()}>{Roles.RECRUITER.toString()}</option>
            <option value={Roles.INTERVIEWER.toString()}>{Roles.INTERVIEWER.toString()}</option>
          </select>
      }
    </span>
  )
}

interface Props {
  id: string;
  selectedOption: (typeof Roles)[keyof typeof Roles];
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export default RoleSelect

