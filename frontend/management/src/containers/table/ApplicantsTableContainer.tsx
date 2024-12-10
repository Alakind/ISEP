import {ApplicantInterface} from "../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import ApplicantsTable from "../../components/table/ApplicantsTable.tsx";

function ApplicantsTableContainer({ data, orderBy, setOrderBy }: Props): ReactNode {
  return (
    <ApplicantsTable data={data} setOrderBy={setOrderBy} orderBy={orderBy} />
  )
}

interface Props {
  data: ApplicantInterface[];
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
}

export default ApplicantsTableContainer
