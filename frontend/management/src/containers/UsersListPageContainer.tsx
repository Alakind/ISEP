import UsersListPage from "../components/UsersListPage";
import {Selection, UserInterface} from "../utils/types";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {Roles} from "../utils/constants.tsx";

function UsersListContainer() {
  let initialData: UserInterface[] = [];
  const initialCurrentPage = 0;
  const initialItemsPerPage = 10;
  let initialTotalItems = 0;
  const initialOrderBy = "name:asc"
  let initialSelection: Selection[] = [];

  function handleIsSelectedChange(data: UserInterface[]) {
    for (let i = 0; i < data.length; i++) {
      initialSelection.push({id: data[i].id, checked: false});
    }
  }

  const fetchData = async() => {
    try {
      //TODO uncomment this when there is a working api
      // const res = await getUsers(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

      const res = {
        data: [
          {
            name: "Fenna",
            id: "12345678909",
            email: "Fenna@email.com",
            role: undefined,
          },
          {
            name: "Jurre",
            id: "12345678901",
            email: "Jurre@email.com",
            role: Roles.ADMIN,
          },
          {
            name: "Channa",
            id: "12345678902",
            email: "Channa@email.com",
            role: Roles.RECRUITER,
          },
          {
            name: "Nico",
            id: "12345678903",
            email: "Nico@email.com",
            role: Roles.INTERVIEWER,
          },
          {
            name: "FallbackAdmin",
            id: "523",
            email: "fallbackAdmin@infosupport.nl",
            role: Roles.ADMIN,
          },
        ],
        totalItems: 5
      }
      initialData = res.data; //TODO WILL BE FIXED WITH API IMPLEMENTATION
      initialTotalItems =res.totalItems;
      handleIsSelectedChange(initialData);
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  fetchData();

  return <UsersListPage initialData={initialData} initialCurrentPage={initialCurrentPage} initialItemsPerPage={initialItemsPerPage} initialTotalItems={initialTotalItems} initialOrderBy={initialOrderBy} initialSelection={initialSelection}/>;
}

export default UsersListContainer;
