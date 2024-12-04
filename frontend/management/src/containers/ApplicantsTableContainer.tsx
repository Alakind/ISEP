import {ApplicantInterface} from "../utils/types.tsx";
import React from "react";
import ApplicantsTable from "../components/ApplicantsTable.tsx";

function ApplicantsTableContainer({ data, setOrderBy }: Props) {
  return (
    <ApplicantsTable data={data} setOrderBy={setOrderBy} />
  )
}

interface Props {
  data: ApplicantInterface[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export default ApplicantsTableContainer
