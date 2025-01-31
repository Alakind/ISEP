import {Column} from "../../../utils/types.tsx";
import CheckboxLoadingContainer from "../../../containers/CheckboxLoadingContainer.tsx";
import {ReactNode} from "react";

function TableRowLoading({columns, id}: Readonly<Props>): ReactNode {
  return (
    <tr className="table-loading__row" data-testid={`table-row-loading-${id}`}>
      {columns.map(({accessor}: Column): ReactNode => {
        if (accessor == "select") {
          return <td key={accessor}><CheckboxLoadingContainer id={id}/></td>;
        } else {
          return <td key={accessor}><span className="table-loading__row__cell" data-testid={"empty-cell"}></span></td>;
        }
      })}
    </tr>
  )
}

interface Props {
  columns: Column[];
  id: string;
}

export default TableRowLoading
