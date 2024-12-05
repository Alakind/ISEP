import TableBody from "../components/TableBody.tsx";
import {ApplicantInterface, Column, UserInterface} from "../utils/types.tsx";

function TableBodyContainer({ columns, tableData } : Props) {
  return (
    <TableBody columns={columns} tableData={tableData}/>
  )
}

interface Props {
  columns: Column[];
  tableData: UserInterface[] | ApplicantInterface[];
}

export default TableBodyContainer
