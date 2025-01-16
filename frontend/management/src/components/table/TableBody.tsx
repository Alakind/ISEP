import {ApplicantInterface, Column, InviteInterface, Selection, UserInterface} from "../../utils/types.tsx";
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";
import TableRowInvites from "./TableRowInvites.tsx";
import TableRowLoading from "./loading/TableRowLoading.tsx";
import {ReactNode} from "react";
import {applicantColumns, dashboardExpiredColumns, dashboardFinishedColumns, dashboardWillExpireColumns, userColumns} from "../../utils/constants.tsx";


function TableBody({columns, tableData, goToApplicantPage, handleSelect, isSelected}: Readonly<Props>): ReactNode {
  return (
    <tbody className="table__body" data-testid={"table-body"}>
    {
      tableData.map((data: UserInterface | ApplicantInterface | InviteInterface): ReactNode | null => {
        if (columns === userColumns) {
          return (
            <TableRowUsers
              key={"user_" + data.id}
              data={data as UserInterface}
              columns={columns}
              handleSelect={handleSelect}
              isSelected={isSelected}
            />
          );
        } else if (columns === applicantColumns) {
          return (
            <TableRowApplicants
              key={"applicant_" + data.id}
              data={data as ApplicantInterface}
              columns={columns}
              goToApplicantPage={goToApplicantPage}
            />
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
