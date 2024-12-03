import {UserInterface} from "../utils/types";
import { useSortableTable } from "../utils/useSortableTable.tsx";
import TableBodyContainer from "../containers/TableBodyContainer.tsx";
import TableHeadContainer from "../containers/TableHeadContainer.tsx";
import {userColumns} from "../utils/constants.tsx";

function UsersTable({ users }: Props) {

  const [tableData, handleSorting] = useSortableTable(users);

  return (
    <>
      <table className="table table-striped">
        <TableHeadContainer columns={userColumns} handleSorting={handleSorting} />
        <TableBodyContainer columns={userColumns} tableData={tableData} />
      </table>
    </>
  );
}

interface Props {
  users: UserInterface[];
}

export default UsersTable;
