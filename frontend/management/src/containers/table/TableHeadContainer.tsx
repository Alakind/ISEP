import {Column, Selection} from "../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import TableHead from "../../components/table/TableHead.tsx";

function TableHeadContainer({columns, orderBy, setOrderBy, setIsSelected}: Props): ReactNode {
  const [sortField, setSortField] = useState<string>(orderBy.split(",")[0]);
  const [order, setOrder] = useState<string>(orderBy.split(",")[1]);

  function handleSorting(accessor: string): void {
    const sortOrder: "asc" | "desc" = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    setOrderBy(`${accessor},${sortOrder}`)
  }

  function handleSelectAll(value: boolean): void {
    if (setIsSelected) {
      setIsSelected((prevState: Selection[]): Selection[] => {
        return prevState.map((item: Selection): Selection => ({
          ...item,
          checked: value,
        }));
      });
    }
  }

  return (
    <TableHead columns={columns} sortField={sortField} order={order} handleSorting={handleSorting} handleSelectAll={handleSelectAll}/>
  )
}

interface Props {
  columns: Column[];
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setIsSelected?: Dispatch<SetStateAction<Selection[]>>;
}

export default TableHeadContainer
