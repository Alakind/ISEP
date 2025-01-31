import {Column, Selection, UserInterface} from "../../utils/types.tsx";
import RoleSelectContainer from "../../containers/RoleSelectContainer.tsx";
import CheckboxContainer from "../../containers/CheckboxContainer.tsx";
import {ReactNode} from "react";
import {useUserData} from "../../utils/msal/UseUserData.tsx";

function TableRowUsers({data, columns, handleSelect, isSelected}: Readonly<Props>): ReactNode {
  const user = useUserData()
  return (
    <tr data-testid={"table-row-users"}>
      {columns.map(({accessor}: Column): ReactNode => {
        if (accessor == "name") {
          return (
            <th className="table-row__link" key={accessor}>
              <a>{data.name}</a>
            </th>
          );
        } else if (accessor == "role") {
          let disabled: boolean = false;
          if (data.id == user.id || data.email == import.meta.env.VITE_DEFAULT_ADMIN_EMAIL /*Standard admin*/) {
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
          const value: string | Date | undefined = accessor in data ? (data)[accessor as keyof UserInterface] : "——";
          return (
            <td key={accessor} data-testid={`${accessor}-cell`}>
              {String(value)}
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
