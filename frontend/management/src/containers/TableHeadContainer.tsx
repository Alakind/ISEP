import {Column} from "../utils/types.tsx";
import React, {useState} from "react";
import TableHead from "../components/TableHead.tsx";

function TableHeadContainer({ columns, setOrderBy } : Props) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  const handleSorting = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    setOrderBy(`${accessor}:${sortOrder}`)
  };

  return (
   <TableHead columns={columns} sortField={sortField} order={order} handleSorting={handleSorting}/>
  )
}

interface Props {
  columns: Column[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}
export default TableHeadContainer
