import UsersListPage from "../components/UsersListPage";
import { UserInterface } from "../utils/types";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

function UsersListContainer() {
  let initialData: UserInterface[] = [];
  const initialCurrentPage = 1;
  const initialItemsPerPage = 10;
  let initialTotalItems = 0;
  const initialOrderBy = "-name"

  const fetchData = async() => {
    try {
      //TODO uncomment this when there is a working api
      // const res = await getUsers(initialCurrentPage, initialItemsPerPage, initialOrderBy);

      const res = {
        data: [
          {
            name: "Fenna",
            id: "12345678909",
            email: "Fenna@email.com",
            role: null,
            access: false,
          },
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
        ],
        totalItems: 5
      }
      initialData = res.data;
      initialTotalItems =res.totalItems;
    } catch (error) {
      toast.error(error.message)
    }
  }
  fetchData();

  return <UsersListPage initialData={initialData} initialCurrentPage={initialCurrentPage} initialItemsPerPage={initialItemsPerPage} initialTotalItems={initialTotalItems} initialOrderBy={initialOrderBy}/>;
}

export default UsersListContainer;
