import { UserInterface } from "../utils/types";
import UsersTable from "./UsersTable";
import SearchContainer from "../containers/SearchContainer.tsx";
import React, {useEffect, useState} from "react";
import Pagination from "./Pagination.tsx";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ItemPerPageSelect from "./ItemsPerPageSelect.tsx";
import "../styles/user-list-page.css"


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
        // const res = await getUsers(currentPage, itemsPerPage);

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
        setData(res.data);
        setTotalItems(res.totalItems);
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage]);

  return (
    <div>
      <SearchContainer setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} />
      {
        loading ?
          <p>Loading...</p> : //TODO implement temp table
          <>
            <UsersTable users={data} />
            <div className="user-list-page">
              <ItemPerPageSelect itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
              <Pagination itemsPerPage={itemsPerPage} totalItems={totalItems} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
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
