import {ApplicantInterface, Column, InviteInterface} from "../../utils/types.tsx";
import {ReactNode} from "react";
import InvitesTable from "../../components/table/InvitesTable.tsx";

function InvitesTableContainer({data, dataApplicants, columns}: Readonly<Props>): ReactNode {
  return (
    <InvitesTable data={data} dataApplicants={dataApplicants} columns={columns}/>
  )
}

interface Props {
  data: InviteInterface[];
  dataApplicants: ApplicantInterface[];
  columns: Column[]
}

export default InvitesTableContainer
