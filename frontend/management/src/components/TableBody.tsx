import {ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";
import "../styles/table.css"
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";

function TableBody({ columns, tableData } : Props) {
  return (
    <tbody className="table__body">
    {tableData.map((data : UserInterface | ApplicantInterface)  => {
      if ("role" in data) { // Users
        return (
          <TableRowUsers key={data.id} data={data} columns={columns}/>
        );
      } else if ("status" in data) { //Applicants
        return (
          <TableRowApplicants key={data.id} data={data} columns={columns}/>
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
