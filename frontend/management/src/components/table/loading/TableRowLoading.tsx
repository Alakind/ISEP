import {Column} from "../../../utils/types.tsx";
import CheckboxLoading from "../../CheckboxLoading.tsx";

function TableRowLoading({columns, id} : Props) {
  return (
    <tr className="table-loading__row">
      {columns.map(({accessor}) => {
        if (accessor == "select") {
          return <td key={accessor} ><CheckboxLoading id={id} /></td>;
        } else {
          return <td key={accessor} ><span className="table-loading__row__cell"></span></td>;
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
