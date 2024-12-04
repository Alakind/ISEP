import { ApplicantInterface } from "../utils/types";
import {applicantColumns} from "../utils/constants.tsx";
import TableHeadContainer from "../containers/TableHeadContainer.tsx";
import TableBodyContainer from "../containers/TableBodyContainer.tsx";
import React from "react";

function ApplicantsTable({ data, setOrderBy }: Props) {
  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={applicantColumns} setOrderBy={setOrderBy} />
        <TableBodyContainer columns={applicantColumns} tableData={data} />
      </table>
    </>
  );
}

interface Props {
  data: ApplicantInterface[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default ApplicantsTable;
