import {ApplicantInterface, Column, InviteInterface} from "../../utils/types.tsx";
import TableBodyContainer from "../../containers/table/TableBodyContainer.tsx";
import {ReactNode} from "react";
import "../../styles/table.css";
import TableHeadSimpleContainer from "../../containers/table/TableHeadSimpleContainer.tsx";

function InvitesTable({data, dataApplicants, columns}: Readonly<Props>): ReactNode {
  return (
    <table className="table table-striped" data-testid={"invites-table"}>
      <TableHeadSimpleContainer columns={columns}/>
      <TableBodyContainer columns={columns} tableData={data} additionalData={dataApplicants}/>
    </table>
  );
}

interface Props {
  data: InviteInterface[];
  dataApplicants: ApplicantInterface[];
  columns: Column[]
}

export default InvitesTable;
