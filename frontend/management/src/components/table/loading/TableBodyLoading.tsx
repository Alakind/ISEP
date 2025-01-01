import {Column} from "../../../utils/types.tsx";
import TableRowLoading from "./TableRowLoading.tsx";
import {ReactNode} from "react";

function TableBodyLoading({columns, itemsPerPage}: Readonly<Props>): ReactNode {
  return (
    <tbody className="table__body" data-testid={"table-body-loading"}>
    {Array.from({length: itemsPerPage}, (_: unknown, index: number): ReactNode => (
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
