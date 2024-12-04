import TableBody from "../components/TableBody.tsx";
import {ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";
import {useNavigate} from "react-router-dom";

function TableBodyContainer({ columns, tableData } : Props) {
  const navigate = useNavigate();

  const goToApplicantPage = (applicantId: string): void => {
    navigate(`/applicants/${applicantId}/info`);
  };
  return (
    <TableBody columns={columns} tableData={tableData} goToApplicantPage={goToApplicantPage}/>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[];
}

export default TableBodyContainer
