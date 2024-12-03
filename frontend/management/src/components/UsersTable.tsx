import {Column, UserInterface} from "../utils/types";
import { useSortableTable } from "../utils/useSortableTable.tsx";
import TableBodyContainer from "../containers/TableBodyContainer.tsx";
import TableHeadContainer from "../containers/TableHeadContainer.tsx";

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
        <TableHeadContainer columns={columns} handleSorting={handleSorting} />
        <TableBodyContainer columns={columns} tableData={users} />
      </table>
    </>
  );
}

interface Props {
  users: UserInterface[];
}

export default UsersTable;
