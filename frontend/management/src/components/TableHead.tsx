import {Column} from "../utils/types.tsx";
import CheckboxContainer from "../containers/CheckboxContainer.tsx";

function TableHead({ columns, sortField, order, handleSorting, handleSelectAll } : Props) {
  return (
    <thead className="table__head">
      <tr>
        {columns.map(({ label, accessor, sortable } : Column) => {
            if (accessor == "select") {
              return <th className="sort" scope="col" key={accessor} ><CheckboxContainer id={"checkbox-all"} additionalAction={handleSelectAll}/></th>
            } else {
              const cl = sortable
                ? sortField === accessor && order === "asc"
                  ? "up"
                  : sortField === accessor && order === "desc"
                    ? "down"
                    : "default"
                : "";
              return <th className={"sort " + cl} scope="col" key={accessor} onClick={sortable ? () => handleSorting(accessor) : null}>{label}</th>
            }
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
  handleSelectAll: (value: boolean) => void;
}
export default TableHead
