import {Column} from "../utils/types.tsx";
import {useState} from "react";
import TableHead from "../components/TableHead.tsx";

function TableHeadContainer({ columns, handleSorting } : Props) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
   <TableHead columns={columns} sortField={sortField} order={order} handleSortingChange={handleSortingChange}/>
  )
}

interface Props {
  columns: Column[];
  handleSorting: (accessor: string, sortOrder: string) => void;
}
export default TableHeadContainer
