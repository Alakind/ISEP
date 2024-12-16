import TableLoading from "../components/TableLoading.tsx";
import {Column} from "../utils/types.tsx";

function TableLoadingContainer({columns, itemsPerPage} : Props) {
  return (
    <TableLoading columns={columns} itemsPerPage={itemsPerPage} />
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableLoadingContainer
