import UsersListPage from "../components/UsersListPage";
import { UserInterface } from "../utils/types";

function UsersListContainer() {
  const users: UserInterface[] = [
    {
      name: "Jurre",
      id: "1234567890",
      email: "Jurre@email.com",
      role: "admin",
    },
    {
      name: "Chana",
      id: "1234567890",
      email: "Chana@email.com",
      role: "Interviewer",
    },
    {
      name: "Nico",
      id: "1234567890",
      email: "Nico@email.com",
      role: "Recruiter",
    },
  ];

  return <UsersListPage users={users} />;
}

export default UsersListContainer;
