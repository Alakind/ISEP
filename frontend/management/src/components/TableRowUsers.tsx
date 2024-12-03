import React from 'react'
import {Column, UserInterface} from "../utils/types.tsx";
import ToggleContainer from "../containers/ToggleContainer.tsx";

function TableRowUsers({data, columns} : Props) {
  return (
    <tr>
      {columns.map(({ accessor }) => {
        if (accessor == "access") {
          const checked : boolean|undefined = "access" in data ? (data as UserInterface)["access"] : false;

          let disabled = false;
          if ((data as UserInterface)["email"] == import.meta.env.VITE_DEFAULT_ADMIN_EMAIL) {
            disabled = true
          }

          const subUrl =  "/user/" + data.id;
          return (
            <td key={accessor}>
              <span className="table__body__access">
                <i className="bi bi-person-fill-slash"></i><ToggleContainer checked={checked} subUrl={subUrl} disabled={disabled} /><i className="bi bi-person-fill-check"></i>
              </span>
            </td>
          );
        } else {
          let value = accessor in data && accessor != "access" ? (data as UserInterface)[accessor as keyof UserInterface] : "——";
          if (accessor == "role" ) {}
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
