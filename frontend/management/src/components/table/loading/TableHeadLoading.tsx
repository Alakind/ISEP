import {Column} from "../../../utils/types.tsx";
import CheckboxLoadingContainer from "../../../containers/CheckboxLoadingContainer.tsx";
import {ReactNode} from "react";

function TableHeadLoading({columns}: Readonly<Props>): ReactNode {
  return (
    <thead className="table__head">
    <tr>
      {columns.map(({label, accessor}: Column): ReactNode => {
          if (accessor == "select") {
            return <th scope="col" key={accessor} data-testid={"checkbox-loading-checkbox-all"}><CheckboxLoadingContainer id={"checkbox-all"}/></th>
          } else {
            return <th scope="col" key={accessor}>{label}</th>
          }
        }
      )}
    </tr>
    </thead>
  )
}

interface Props {
  columns: Column[];
}

export default TableHeadLoading
