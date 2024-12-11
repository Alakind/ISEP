import {Selection, UserInterface} from "../utils/types";
import SearchContainer from "../containers/table/SearchContainer.tsx";
import {ReactNode, useEffect, useState} from "react";
import PaginationContainer from "../containers/table/PaginationContainer.tsx";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ItemPerPageSelectContainer from "../containers/table/ItemsPerPageSelectContainer.tsx";
import "../styles/user-list-page.css"
import UsersTableContainer from "../containers/table/UsersTableContainer.tsx";
import {userColumns} from "../utils/constants.tsx";
import BulkActionSelectContainer from "../containers/table/BulkActionSelectContainer.tsx";
import TableLoadingContainer from "../containers/table/loading/TableLoadingContainer.tsx";

function UsersListPage({initialData, initialCurrentPage, initialItemsPerPage, initialTotalItems, initialOrderBy, initialSelection}: Props): ReactNode {
  const [data, setData] = useState<UserInterface[]>(initialData);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
  const [isSelected, setIsSelected] = useState<Selection[]>(initialSelection);

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

  return (
    <div className="user-list-page">
      <SearchContainer setData={updateData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/user"}
                       handleIsSelectedChange={handleIsSelectedChange} orderBy={orderBy}/>
      {
        (totalItems == 0 || loading) ?
          <TableLoadingContainer columns={userColumns} itemsPerPage={itemsPerPage}/> :
          <>
            <UsersTableContainer data={data} setOrderBy={setOrderBy} setIsSelected={setIsSelected} isSelected={isSelected} orderBy={orderBy}/>
            <div className="user-list-page__inner">
              <BulkActionSelectContainer isSelected={isSelected}/>
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}/>
              <PaginationContainer itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            </div>
          </>
      }
    </div>
  );
}

interface Props {
  initialData: UserInterface[];
  initialCurrentPage: number;
  initialItemsPerPage: number;
  initialTotalItems: number;
  initialOrderBy: string;
  initialSelection: Selection[];
}

export default UsersListPage;
