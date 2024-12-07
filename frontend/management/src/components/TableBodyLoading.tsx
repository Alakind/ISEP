import {Column} from "../utils/types.tsx";
import TableRowLoading from "./TableRowLoading.tsx";

function TableBodyLoading({columns, itemsPerPage} : Props) {
  return (
    <tbody className="table__body">
    {Array.from({length: itemsPerPage}, (_, index) => (
      <TableRowLoading key={index} id={index.toString()} columns={columns}/>
    ))}
    </tbody>
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableBodyLoading
