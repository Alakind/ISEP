import {ApplicantInterface, Column, Selection, UserInterface} from "../../utils/types.tsx";
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";

function TableBody({ columns, tableData, goToApplicantPage, handleSelect, isSelected } : Props) {

  return (
    <tbody className="table__body">
    {tableData.map((data : UserInterface | ApplicantInterface)  => {
      if ("role" in data) { // Users //TODO find another way of checking for a certain interface with checking all accessors
        return (
          <TableRowUsers key={data.id} data={(data as UserInterface)} columns={columns} handleSelect={handleSelect} isSelected={isSelected}/>
        );
      } else if ("status" in data) { //Applicants
        return (
          <TableRowApplicants key={data.id} data={(data as ApplicantInterface)} columns={columns} goToApplicantPage={goToApplicantPage}/>
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
  handleSelect: (arg0: string) => void;
  isSelected: Selection[];
}

export default TableBody
