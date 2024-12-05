import {Roles} from "../utils/constants.tsx";
import "../styles/role-select.css";

function RoleSelect({ id, selectedOption, handleSelect, disabled} : Props) {
  return (
    <span className="role-select">
      {
        disabled ?
          <span className="role-select__select role-select__select--disabled">{selectedOption ? selectedOption.toString() : ""}</span> :
          <select id={`role-select_${id}`} onChange={(e) => handleSelect(e)} className="role-select__select" defaultValue={selectedOption ? selectedOption.toString() : ""}>
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
  selectedOption: Roles|undefined;
  handleSelect: (e) => void;
  disabled: boolean;
}
export default RoleSelect

