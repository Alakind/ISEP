import TableBodyLoading from "../../../components/table/loading/TableBodyLoading.tsx";
import {Column} from "../../../utils/types.tsx";
import {ReactNode} from "react";

function TableBodyLoadingContainer({columns, itemsPerPage}:Props): ReactNode {
  return (
    <TableBodyLoading columns={columns} itemsPerPage={itemsPerPage} />
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableBodyLoadingContainer
