import {Column, UserInterface} from "../utils/types.tsx";
import RoleSelectContainer from "../containers/RoleSelectContainer.tsx";

function TableRowUsers({data, columns} : Props) {
  return (
    <tr>
      {columns.map(({ accessor }) => {
        if (accessor == "role") {
          let disabled = false;
          if (data.id == "12345678901" /* FIXME to this currentUser.id*/) {
            disabled = true
          }

          const subUrl =  "/user/" + data.id;
          return (
            <td key={accessor}>
              <span className="">
                <RoleSelectContainer subUrl={subUrl} disabled={disabled} initialRole={data.role}/>
              </span>
            </td>
          );
        } else {
          let value = accessor in data ? (data as UserInterface)[accessor as keyof UserInterface] : "——";
          return <td key={accessor}>{value}</td>;
        }
      })}
    </tr>
  )
}

interface Props {
  data: UserInterface
  columns: Column[];
}

export default TableRowUsers
