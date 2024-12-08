import {Column} from "../../../utils/types.tsx";
import CheckboxLoadingContainer from "../../../containers/CheckboxLoadingContainer.tsx";

function TableHeadLoading({ columns } : Props) {
  return (
    <thead className="table__head">
      <tr>
        {columns.map(({label, accessor}: Column) => {
            if (accessor == "select") {
              return <th scope="col" key={accessor}><CheckboxLoadingContainer/></th>
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
