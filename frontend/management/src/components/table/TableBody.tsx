import {ApplicantInterface, Column, InviteInterface, Selection, UserInterface} from "../../utils/types.tsx";
import TableRowUsers from "./TableRowUsers.tsx";
import TableRowApplicants from "./TableRowApplicants.tsx";
import TableRowInvites from "./TableRowInvites.tsx";
import TableRowLoading from "./loading/TableRowLoading.tsx";
import {ReactNode} from "react";
import {applicantColumns, dashboardExpiredColumns, dashboardFinishedColumns, dashboardWillExpireColumns, userColumns} from "../../utils/constants.tsx";


function TableBody({columns, tableData, goToApplicantPage, handleSelect, isSelected, additionalData}: Readonly<Props>): ReactNode {
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
        } else if (columns === dashboardFinishedColumns || columns === dashboardExpiredColumns || columns === dashboardWillExpireColumns) {
          const applicantData: ApplicantInterface | undefined = additionalData?.filter((applicant: ApplicantInterface): boolean => (applicant.id === (data as InviteInterface).applicantId))[0]
          let subKey;

          if (columns === dashboardFinishedColumns) {
            subKey = "finished_";
          } else if (columns === dashboardExpiredColumns) {
            subKey = "expired_";
          } else if (columns === dashboardWillExpireColumns) {
            subKey = "will-expire_";
          } else {
            subKey = "unknown_";
          }
          if (applicantData) {
            return (
              <TableRowInvites
                key={"invites_" + subKey + data.id + (data as InviteInterface).applicantId}
                inviteData={data as InviteInterface}
                applicantData={applicantData}
                columns={columns}
                goToApplicantPage={goToApplicantPage}
              />
            )
          } else {
            return (
              <TableRowLoading
                key={"invites_" + subKey + data.id + (data as InviteInterface).applicantId}
                columns={columns}
                id={data.id}
              />
            )
          }
        }
      })
    }
    </tbody>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[] | InviteInterface[];
  goToApplicantPage: (id: string) => void;
  handleSelect: (id: string) => void;
  isSelected: Selection[];
  additionalData?: ApplicantInterface[];
}

export default TableBody
