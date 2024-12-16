import TableBodyLoading from "../components/TableBodyLoading.tsx";
import {Column} from "../utils/types.tsx";

function TableBodyLoadingContainer({columns, itemsPerPage}:Props) {
  return (
    <TableBodyLoading columns={columns} itemsPerPage={itemsPerPage} />
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableBodyLoadingContainer
