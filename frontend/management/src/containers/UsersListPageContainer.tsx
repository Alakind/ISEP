import UsersListPage from "../components/UsersListPage";
import {Selection, UserInterface} from "../utils/types";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";

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
      const res = await getUsers(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

      initialData = res.data;
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
