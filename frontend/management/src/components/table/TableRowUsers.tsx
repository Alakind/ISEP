import {Column, Selection, UserInterface} from "../../utils/types.tsx";
import RoleSelectContainer from "../../containers/RoleSelectContainer.tsx";
import CheckboxContainer from "../../containers/CheckboxContainer.tsx";
import {ReactNode} from "react";

function TableRowUsers({data, columns, handleSelect, isSelected}: Readonly<Props>): ReactNode {
  return (
    <tr data-testid={"table-row-users"}>
      {columns.map(({accessor}: Column): ReactNode => {
        if (accessor == "role") {
          let disabled: boolean = false;
          if (data.id == "6" /* TODO to this currentUser.id*/ || data.email == import.meta.env.VITE_DEFAULT_ADMIN_EMAIL /*Standard admin*/) {
            disabled = true
          }

          return (
            <td key={accessor}>
              <RoleSelectContainer id={data.id} disabled={disabled} initialRole={data.role}/>
            </td>
          );
        } else if (accessor == "select") {
          return <th key={accessor}><CheckboxContainer id={data.id} additionalAction={handleSelect} isSelected={isSelected}/></th>
        } else {
          const value: string = accessor in data ? (data)[accessor as keyof UserInterface] : "——";
          return (
            <td key={accessor} data-testid={`${accessor}-cell`}>
              {value}
            </td>
          );
        }
      })}
    </tr>
  )
}

interface Props {
  data: UserInterface
  columns: Column[];
  handleSelect: (id: string) => void;
  isSelected: Selection[];
}

export default TableRowUsers
