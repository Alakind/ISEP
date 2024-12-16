import UsersListPage from "../components/UsersListPage";
import {Selection, UserInterface} from "../utils/types";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import {ReactNode, useEffect, useState} from "react";

function UsersListContainer(): ReactNode {
  const [data, setData] = useState<UserInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("name:asc");
  const [isSelected, setIsSelected] = useState<Selection[]>([]);

  function handleIsSelectedChange(data: UserInterface[]): void {
    const changedState: Selection[] = [];
    for (let i: number = 0; i < data.length; i++) {
      changedState.push({id: data[i].id, checked: false});
    }
    setIsSelected(changedState);
  }

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const res: { data: UserInterface[], totalItems: number } = await getUsers(currentPage, itemsPerPage, orderBy, "");

        handleIsSelectedChange(res.data);
        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData().then();
  }, [currentPage, itemsPerPage, orderBy]);

  function updateData(data: UserInterface[]): void {
    setData(data);
  }

  function removeUser(id: string): void {
    setData((prev: UserInterface[]): UserInterface[] => prev.filter((user: UserInterface): boolean => user.id !== id));
  }

  return <UsersListPage handleIsSelectedChange={handleIsSelectedChange} data={data} updateData={updateData} totalItems={totalItems} setTotalItems={setTotalItems} loading={loading}
                        setLoading={setLoading} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} orderBy={orderBy}
                        setOrderBy={setOrderBy} isSelected={isSelected} setIsSelected={setIsSelected} removeUser={removeUser}/>;
}

export default UsersListContainer;
