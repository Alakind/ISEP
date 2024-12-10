import {Selection, Column} from "../../utils/types.tsx";
import React, {useState} from "react";
import TableHead from "../../components/table/TableHead.tsx";

function TableHeadContainer({ columns, orderBy, setOrderBy, setIsSelected } : Props) {
  const [sortField, setSortField] = useState<string>(orderBy.split(":")[0]);
  const [order, setOrder] = useState<string>(orderBy.split(":")[1]);
  const handleSorting = (accessor: string) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    setOrderBy(`${accessor}:${sortOrder}`)
  };

  const handleSelectAll = (value: boolean) => {
    if (setIsSelected) {
      setIsSelected((prevState: Selection[]) => {
        return prevState.map(item => ({
          ...item,
          checked: value,
        }));
      });
    }
  };

  return (
   <TableHead columns={columns} sortField={sortField} order={order} handleSorting={handleSorting} handleSelectAll={handleSelectAll}/>
  )
}

interface Props {
  columns: Column[];
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setIsSelected?: React.Dispatch<React.SetStateAction<Selection[]>>;
}
export default TableHeadContainer
