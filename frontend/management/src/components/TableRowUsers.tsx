import {Column, UserInterface} from "../utils/types.tsx";

function TableRowUsers({data, columns} : Props) {
  return (
    <tr>
      {columns.map(({ accessor }) => {
        let value = accessor in data ? (data as UserInterface)[accessor as keyof UserInterface] : "——";

        return <td key={accessor}>{value}</td>; //FIXME make the select disabled if current user
      })}
    </tr>
  )
}

interface Props {
  data: UserInterface
  columns: Column[];
}

export default TableRowUsers
