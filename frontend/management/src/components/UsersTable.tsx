import {Column, UserInterface} from "../utils/types";
import TableHead from "./TableHead.tsx";
import TableBody from "./TableBody.tsx"
import { useSortableTable } from "../utils/useSortableTable.tsx";

function UsersTable({ users }: Props) {

  const columns: Column[] = [
    {label: "Name", accessor: "name", sortable: true},
    {label: "Email", accessor: "email", sortable: true},
    {label: "Role", accessor: "role", sortable: true},
    {label: "Access", accessor: "access", sortable: false}
  ]

  const [tableData, handleSorting] = useSortableTable(users);

  return (
    <>
      <table className="table table-striped">
        <TableHead columns={columns} handleSorting={handleSorting} />
        <TableBody columns={columns} tableData={users} />
      </table>
    </>
  );
}

interface Props {
  users: UserInterface[];
}

export default UsersTable;
