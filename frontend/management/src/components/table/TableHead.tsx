import {Column} from "../../utils/types.tsx";
import CheckboxContainer from "../../containers/CheckboxContainer.tsx";
import {ReactNode} from "react";

function TableHead({ columns, sortField, order, handleSorting, handleSelectAll } : Props): ReactNode {
  return (
    <thead className="table__head">
      <tr>
        {columns.map(({ label, accessor, sortable } : Column): ReactNode => {
            if (accessor == "select") {
              return <th className="sort" scope="col" key={accessor} ><CheckboxContainer id={"checkbox-all"} additionalAction={handleSelectAll}/></th>
            } else {
              const cl: "down" | "up" | "default" | "" = sortable
                ? sortField === accessor && order === "asc"
                  ? "down"
                  : sortField === accessor && order === "desc"
                    ? "up"
                    : "default"
                : "";
              return <th className={"sort " + cl} scope="col" key={accessor} onClick={(): void => handleSorting(accessor)}>{label}</th>
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
