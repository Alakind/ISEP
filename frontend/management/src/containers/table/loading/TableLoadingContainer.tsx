import TableLoading from "../../../components/table/loading/TableLoading.tsx";
import {Column} from "../../../utils/types.tsx";
import {ReactNode} from "react";

function TableLoadingContainer({columns, itemsPerPage}: Readonly<Props>): ReactNode {
  return (
    <TableLoading columns={columns} itemsPerPage={itemsPerPage}/>
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableLoadingContainer
