import {ApplicantInterface} from "../../utils/types.tsx";
import {applicantColumns} from "../../utils/constants.tsx";
import TableHeadContainer from "../../containers/table/TableHeadContainer.tsx";
import TableBodyContainer from "../../containers/table/TableBodyContainer.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import "../../styles/table.css";

function ApplicantsTable({data, orderBy, setOrderBy}: Readonly<Props>): ReactNode {
  return (
    <table className="table table-striped" data-testid={"applicants-table"}>
      <TableHeadContainer columns={applicantColumns} orderBy={orderBy} setOrderBy={setOrderBy}/>
      <TableBodyContainer columns={applicantColumns} tableData={data}/>
    </table>
  );
}

interface Props {
  data: ApplicantInterface[];
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
}

export default ApplicantsTable;
