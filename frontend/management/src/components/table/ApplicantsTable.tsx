import { ApplicantInterface } from "../../utils/types.tsx";
import {applicantColumns} from "../../utils/constants.tsx";
import TableHeadContainer from "../../containers/table/TableHeadContainer.tsx";
import TableBodyContainer from "../../containers/table/TableBodyContainer.tsx";
import React from "react";
import "../../styles/table.css";

function ApplicantsTable({ data, orderBy, setOrderBy }: Props) {
  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={applicantColumns} orderBy={orderBy} setOrderBy={setOrderBy} />
        <TableBodyContainer columns={applicantColumns} tableData={data} />
      </table>
    </>
  );
}

interface Props {
  data: ApplicantInterface[];
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default ApplicantsTable;
