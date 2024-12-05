import {Selection, Column} from "../utils/types.tsx";
import React, {useState} from "react";
import TableHead from "../components/TableHead.tsx";

function TableHeadContainer({ columns, setOrderBy, setIsSelected } : Props) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  const handleSorting = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    setOrderBy(`${accessor}:${sortOrder}`)
  };

  const handleSelectAll = (value: boolean) => {
    setIsSelected((prevState: Selection[]) => {
      return prevState.map(item => ({

        ...item,
        checked: value,
      }));
    });
  };

  return (
   <TableHead columns={columns} sortField={sortField} order={order} handleSorting={handleSorting} handleSelectAll={handleSelectAll}/>
  )
}

interface Props {
  columns: Column[];
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setIsSelected: React.Dispatch<React.SetStateAction<Selection[]>>;
}
export default TableHeadContainer
