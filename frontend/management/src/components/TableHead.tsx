import {Column} from "../utils/types.tsx";
import {useState} from "react";

function TableHead({ columns, handleSorting } : Props) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead className="table__head">
      <tr>
        {columns.map(({ label, accessor, sortable } : Column) => {
            const cl = sortable
              ? sortField === accessor && order === "asc"
                ? "up"
                : sortField === accessor && order === "desc"
                  ? "down"
                  : "default"
              : "";
            return <th className={"sort " + cl} scope="col" key={accessor} onClick={sortable ? () => handleSortingChange(accessor) : null}>{label}</th>
          }
        )}
      </tr>
    </thead>
  )
}

interface Props {
  columns: Column[];
  handleSorting: (accessor: string, sortOrder: string) => void;
}
export default TableHead
