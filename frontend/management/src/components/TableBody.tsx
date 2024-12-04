import {ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";
import "../styles/table.css"
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";

function TableBody({ columns, tableData, goToApplicantPage } : Props) {
  return (
    <tbody className="table__body">
    {tableData.map((data : UserInterface | ApplicantInterface)  => {
      if ("role" in data) { // Users //TODO find another way of checking for a certain interface with checking all accessors
        return (
          <TableRowUsers key={data.id} data={data} columns={columns}/>
        );
      } else if ("status" in data) { //Applicants
        return (
          <TableRowApplicants key={data.id} data={data} columns={columns} goToApplicantPage={goToApplicantPage}/>
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
  tableData: UserInterface[] | ApplicantInterface[]
  goToApplicantPage: (arg0: string) => void;
}

export default TableBody
