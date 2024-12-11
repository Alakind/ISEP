import TableHeadLoadingContainer from "../../../containers/table/loading/TableHeadLoadingContainer.tsx";
import TableBodyLoadingContainer from "../../../containers/table/loading/TableBodyLoadingContainer.tsx";
import {Column} from "../../../utils/types.tsx";
import "../../../styles/table-loading.css";
import {ReactNode} from "react";

function TableLoading({columns, itemsPerPage}:Props): ReactNode {
  return (
    <>
      <table className="table table-striped">
        <TableHeadLoadingContainer columns={columns} />
        <TableBodyLoadingContainer columns={columns} itemsPerPage={itemsPerPage} />
      </table>
    </>
  )
}

interface Props {
  columns: Column[];
  itemsPerPage: number;
}

export default TableLoading
