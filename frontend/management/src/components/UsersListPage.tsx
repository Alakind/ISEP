import { UserInterface } from "../utils/types";
import SearchContainer from "../containers/SearchContainer.tsx";
import React, {useEffect, useState} from "react";
import PaginationContainer from "../containers/PaginationContainer.tsx";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ItemPerPageSelectContainer from "../containers/ItemsPerPageSelectContainer.tsx";
import "../styles/user-list-page.css"
import UsersTableContainer from "../containers/UsersTableContainer.tsx";


function UsersListPage({ initialData, initialCurrentPage, initialItemsPerPage, initialTotalItems, initialOrderBy }: Props) {
  const [data, setData] = useState<UserInterface[]>(initialData);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>(initialOrderBy);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // const res = await getUsers(currentPage, itemsPerPage, orderBy);

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
          totalItems: 90
        }
        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage, orderBy]);

  return (
    <div className="user-list-page">
      <SearchContainer setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} />
      {
        loading ?
          <p>Loading...</p> : //TODO implement temp table
          <>
            <UsersTableContainer data={data} setOrderBy={setOrderBy} />
            <div className="user-list-page__inner">
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
}

export default UsersListPage;
