import TableHeadLoading from "../../../components/table/loading/TableHeadLoading.tsx";
import {Column} from "../../../utils/types.tsx";
import {ReactNode} from "react";

function TableHeadLoadingContainer({columns}: Props): ReactNode {
  return (
    <TableHeadLoading columns={columns}/>
  )
}

interface Props {
  columns: Column[];
}

export default TableHeadLoadingContainer
