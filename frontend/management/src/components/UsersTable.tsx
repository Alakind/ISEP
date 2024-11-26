import { UserInterface } from "../utils/types";

function UsersTable({ users }: UsersTableProps) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <th scope="row">{user.name}</th>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

interface UsersTableProps {
  users: UserInterface[];
}

export default UsersTable;
