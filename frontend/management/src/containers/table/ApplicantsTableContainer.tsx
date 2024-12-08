import {ApplicantInterface} from "../../utils/types.tsx";
import React from "react";
import ApplicantsTable from "../../components/table/ApplicantsTable.tsx";

function ApplicantsTableContainer({ data, orderBy, setOrderBy }: Props) {
  return (
    <ApplicantsTable data={data} setOrderBy={setOrderBy} orderBy={orderBy} />
  )
}

interface Props {
  data: ApplicantInterface[];
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default ApplicantsTableContainer
