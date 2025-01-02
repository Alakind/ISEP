import {ApplicantInterface, Column, Selection, UserInterface} from "../../utils/types.tsx";
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";
import {ReactNode} from "react";

function TableBody({columns, tableData, goToApplicantPage, handleSelect, isSelected}: Readonly<Props>): ReactNode {
  return (
    <tbody className="table__body" data-testid={"table-body"}>
    {
      tableData.map((data: UserInterface | ApplicantInterface): ReactNode | null => {
        if ("role" in data) { // Users //TODO find another way of checking for a certain interface with checking all accessors
          return (
            <TableRowUsers key={"user_" + data.id} data={data} columns={columns} handleSelect={handleSelect} isSelected={isSelected}/>
          );
        } else if ("score" in data) { //Applicants
          return (
            <TableRowApplicants key={"applicant_" + data.id} data={data} columns={columns} goToApplicantPage={goToApplicantPage}/>
          );
        }
      })
    }
    </tbody>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[]
  goToApplicantPage: (id: string) => void;
  handleSelect: (id: string) => void;
  isSelected: Selection[];
}

export default TableBody
