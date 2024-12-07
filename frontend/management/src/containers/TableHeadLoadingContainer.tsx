import TableHeadLoading from "../components/TableHeadLoading.tsx";
import {Column} from "../utils/types.tsx";

function TableHeadLoadingContainer({columns}:Props) {
  return (
    <TableHeadLoading columns={columns} />
  )
}

interface Props {
  columns: Column[];
}

export default TableHeadLoadingContainer
