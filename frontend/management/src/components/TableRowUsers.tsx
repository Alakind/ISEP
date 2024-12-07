import {Column, Selection, UserInterface} from "../utils/types.tsx";
import RoleSelectContainer from "../containers/RoleSelectContainer.tsx";
import CheckboxContainer from "../containers/CheckboxContainer.tsx";

function TableRowUsers({data, columns, handleSelect, isSelected} : Props) {


  return (
    <tr>
      {columns.map(({ accessor }) => {
        if (accessor == "role") {
          let disabled = false;
          if (data.id == "12345678901" /* TODO to this currentUser.id*/ || data.id == import.meta.env.VITE_DEFAULT_ADMIN_ID /*Standard admin*/) {
            disabled = true
          }

          const subUrl =  "/user/" + data.id;
          return (
            <td key={accessor}>
                <RoleSelectContainer id={data.id} subUrl={subUrl} disabled={disabled} initialRole={data.role}/>
            </td>
          );
        } else if (accessor == "select") {
          return <th key={accessor} ><CheckboxContainer id={data.id} additionalAction={handleSelect} isSelected={isSelected}/></th>
        } else {
          const value = accessor in data ? (data as UserInterface)[accessor as keyof UserInterface] : "——";
          return <td key={accessor}>{value}</td>;
        }
      })}
    </tr>
  )
}

interface Props {
  data: UserInterface
  columns: Column[];
  handleSelect: (arg0: string) => void;
  isSelected: Selection[];
}

export default TableRowUsers
