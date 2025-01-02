import {Column} from "../../utils/types.tsx";
import CheckboxContainer from "../../containers/CheckboxContainer.tsx";
import {ReactNode} from "react";

function TableHead({columns, sortField, order, handleSorting, handleSelectAll}: Readonly<Props>): ReactNode {
  function notDown(accessor: string): "up" | "default" {
    return sortField === accessor && order === "desc"
      ? (
        "up"
      ) : (
        "default"
      );
  }

  function notEmpty(accessor: string): "up" | "default" | "down" {
    return (
      sortField === accessor && order === "asc"
        ? (
          "down"
        ) : (
          notDown(accessor)
        )
    )
  }

  return (
    <thead className="table__head">
    <tr>
      {columns.map(({label, accessor, sortable}: Column): ReactNode => {
          if (accessor == "select") {
            return (
              <th scope="col" key={accessor} data-testid={"checkbox-all"}>
                <CheckboxContainer id={"checkbox-all"} additionalAction={handleSelectAll}/>
              </th>
            )
          } else {
            const cl: "down" | "up" | "default" | "" = sortable
              ? (
                notEmpty(accessor)
              ) : (
                ""
              );

            if (cl === "") {
              return (
                <th scope="col" key={accessor}>
                  {label}
                </th>
              )
            } else {
              return (
                <th className={"sort " + cl} scope="col" key={accessor} onClick={(): void => handleSorting(accessor)}>
                  {label}
                </th>
              )
            }
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
