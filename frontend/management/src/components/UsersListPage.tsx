import { UserInterface } from "../utils/types";
import UsersTable from "./UsersTable";

function UsersListPage({ users }: UsersListProps) {
  return (
    <div>
      <UsersTable users={users} />
    </div>
  );
}

interface UsersListProps {
  users: UserInterface[];
}

export default UsersListPage;
