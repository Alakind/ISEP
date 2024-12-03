import { UserInterface } from "../utils/types";
import UsersTable from "./UsersTable";
import Search from "./Search.tsx";
import {useEffect, useState} from "react";
import Pagination from "./Pagination.tsx";
import {getUsers} from "../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import ItemPerPageSelect from "./ItemsPerPageSelect.tsx";
import "../styles/user-list-page.css"


function UsersListPage({ users }: UsersListProps) {
  const [data, setData] = useState<UserInterface[]>(users);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // const res = await getUsers(currentPage, itemsPerPage);

        const res = {
          data: [
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
        totalItems: 4}
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
      <Search setData={setData} setTotalItems={setTotalItems} setLoading={setLoading} currentPage={currentPage} itemsPerPage={itemsPerPage} />
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

interface UsersListProps {
  users: UserInterface[];
}

export default UsersListPage;
