import {Column} from "../utils/types.tsx";

function TableHead({ columns, sortField, order, handleSorting } : Props) {
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
            return <th className={"sort " + cl} scope="col" key={accessor} onClick={sortable ? () => handleSorting(accessor) : null}>{label}</th>
          }
        )}
      </tr>
    </thead>
  )
}

interface Props {
  columns: Column[];
  sortField: string;
  order: string;
  handleSorting: (accessor: string) => void;
}
export default TableHead
