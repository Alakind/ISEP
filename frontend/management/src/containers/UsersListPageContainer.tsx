import UsersListPage from "../components/UsersListPage";
import {Selection, UserInterface} from "../utils/types";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {ReactNode} from "react";

function UsersListContainer(): ReactNode {
  let initialData: UserInterface[] = [];
  const initialCurrentPage = 0;
  const initialItemsPerPage = 10;
  let initialTotalItems: number = 0;
  const initialOrderBy = "name:asc"
  const initialSelection: Selection[] = [];

  function handleIsSelectedChange(data: UserInterface[]): void {
    for (let i: number = 0; i < data.length; i++) {
      initialSelection.push({id: data[i].id, checked: false});
    }
  }

  async function fetchData(): Promise<void> {
    try {
      const res: { data: UserInterface[], totalItems: number } = await getUsers(initialCurrentPage, initialItemsPerPage, initialOrderBy, "");

      initialData = res.data;
      initialTotalItems = res.totalItems;
      handleIsSelectedChange(initialData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  }

  fetchData().then();

  return <UsersListPage initialData={initialData} initialCurrentPage={initialCurrentPage} initialItemsPerPage={initialItemsPerPage} initialTotalItems={initialTotalItems}
                        initialOrderBy={initialOrderBy} initialSelection={initialSelection}/>;
}

export default UsersListContainer;
