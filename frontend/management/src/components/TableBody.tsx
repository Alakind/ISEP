import {ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";
import "../styles/table.css"
import Toggle from "./Toggle.tsx";

function TableBody({ columns, tableData } : Props) {

  return (
    <tbody className="table__body">
    {tableData.map((data : UserInterface | ApplicantInterface)  => {
      if ("role" in data) { // Users
        return (
          <tr key={data.id}>
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
                      <i className="bi bi-person-fill-slash"></i><Toggle checked={checked} subUrl={subUrl} disabled={disabled} /><i className="bi bi-person-fill-check"></i>
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
        );
      } else if ("status" in data) { //Applicants
        return (
          <tr key={data.id}>
            {columns.map(({ accessor }) => {
              const value : number | string = accessor in data ? (data as ApplicantInterface)[accessor as keyof ApplicantInterface] : "——";
              return <td key={accessor}>{value}</td>;
            })}
          </tr>
        );
      } else {
        return null;
      }

    })}
    </tbody>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[];
}

export default TableBody
