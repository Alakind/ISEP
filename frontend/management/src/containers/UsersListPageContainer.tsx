import UsersListPage from "../components/UsersListPage";
import { UserInterface } from "../utils/types";
import {useEffect, useState} from "react";
import {getUsers} from "../utils/apiFunctions.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

function UsersListContainer() {
  const users: UserInterface[] = [
    {
      name: "Jurre",
      id: "12345678901",
      email: "Jurre@email.com",
      role: "Admin",
      access: false,
    },
    {
      name: "Channa",
      id: "12345678902",
      email: "Channa@email.com",
      role: "Recruiter",
      access: true,
    },
    {
      name: "Nico",
      id: "12345678903",
      email: "Nico@email.com",
      role: "Interviewer",
    },
    {
      name: "FallbackAdmin",
      id: "523",
      email: "fallbackAdmin@infosupport.nl",
      role: "Admin",
      access: true,
    },
  ];

  //FIXME uncomment this when there is a working api
  /*const [users, setUsers] = useState<UserInterface[]>([]);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers(1, 10);
        setUsers(data);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);
  if (error) {
    return <ErrorBoundary error={error} />;
  }*/

  return <UsersListPage users={users} />;
}

export default UsersListContainer;
