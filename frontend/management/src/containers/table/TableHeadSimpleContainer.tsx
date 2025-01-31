import {Column} from "../../utils/types.tsx";
import {ReactNode} from "react";
import TableHeadLoading from "../../components/table/loading/TableHeadLoading.tsx";

function TableHeadSimpleContainer({columns}: Readonly<Props>): ReactNode {
  return (
    <TableHeadLoading columns={columns}/>
  )
}

interface Props {
  columns: Column[];
}

export default TableHeadSimpleContainer
