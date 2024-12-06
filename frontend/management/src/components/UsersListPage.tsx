import {Selection, UserInterface} from "../utils/types";
import SearchContainer from "../containers/SearchContainer.tsx";
import {useEffect, useState} from "react";
import PaginationContainer from "../containers/PaginationContainer.tsx";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ItemPerPageSelectContainer from "../containers/ItemsPerPageSelectContainer.tsx";
import "../styles/user-list-page.css"
import UsersTableContainer from "../containers/UsersTableContainer.tsx";
import {Roles} from "../utils/constants.tsx";
import BulkActionSelectContainer from "../containers/BulkActionSelectContainer.tsx";


function UsersListPage({ initialData, initialCurrentPage, initialItemsPerPage, initialTotalItems, initialOrderBy, initialSelection}: Props) {
  const [data, setData] = useState<UserInterface[]>(initialData);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
  const [isSelected, setIsSelected] = useState<Selection[]>(initialSelection);

  function handleIsSelectedChange(data: UserInterface[]) {
    let changedState: Selection[] = [];
    for (let i = 0; i < data.length; i++) {
      changedState.push({id: data[i].id, checked: false});
    }
    setIsSelected(changedState);
  }

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // const res = await getUsers(currentPage, itemsPerPage, orderBy, "");

        const res = {
          data: [
            {
              name: "Fenna",
              id: "12345678909",
              email: "Fenna@email.com",
              role: "",
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
          totalItems: 90
        }
        handleIsSelectedChange(res.data);
        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage, orderBy]);



  return (
    <div className="user-list-page">
      <SearchContainer<UserInterface> setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} subUrl={"/user"}
                                      handleIsSelectedChange={handleIsSelectedChange} orderBy={orderBy} />
      {
        loading ?
          <p>Loading...</p> : //TODO implement temp table
          <>
            <UsersTableContainer data={data} setOrderBy={setOrderBy} setIsSelected={setIsSelected}  isSelected={isSelected}/>
            <div className="user-list-page__inner">
              <BulkActionSelectContainer isSelected={isSelected}/>
              <ItemPerPageSelectContainer itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
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
