import "../styles/search.css"
import React, {useEffect, useState} from "react";
import {ApplicantInterface, UserInterface} from "../utils/types.tsx";
import {toast} from "react-toastify";
import {getApplicants, getUsers} from "../utils/apiFunctions.tsx";
import Search from "../components/Search.tsx";

function SearchContainer<T extends UserInterface | ApplicantInterface>({ setData, setTotalItems, setLoading, currentPage, itemsPerPage, subUrl, handleIsSelectedChange, orderBy } : Props<T> ) {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        let res;
        if (subUrl == "/user") {
          res = await getUsers(currentPage, itemsPerPage, "name:desc" /*TODO fix that it becomes the current order  */, query);
        } else {
          res = await getApplicants(currentPage, itemsPerPage, "name:desc" /*TODO fix that it becomes the current order  */, query);
        }


        /*const res = {
          data: [
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
            {
              name: "Jurre2",
              id: "123456789012",
              email: "Jurre2@email.com",
              role: Roles.ADMIN,
            },
            {
              name: "Channa2",
              id: "123456789022",
              email: "Channa2@email.com",
              role: Roles.RECRUITER,
            },
            {
              name: "Nico2",
              id: "123456789032",
              email: "Nico2@email.com",
              role: Roles.INTERVIEWER,
            },
            {
              name: "FallbackAdmin2",
              id: "5232",
              email: "fallbackAdmin2@infosupport.nl",
              role: Roles.ADMIN,
            },
          ],
          totalItems: 8}*/

        setData(res.data);
        setTotalItems(res.totalItems);
        if (handleIsSelectedChange && subUrl === "/user") {
          handleIsSelectedChange(res.data as UserInterface[]);
        }
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query]);

  const clearSearch = () => {
    setQuery("");
  }

  return (
    <Search query={query} setQuery={setQuery} clearSearch={clearSearch} />
  )
}

interface Props<T> {
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  itemsPerPage: number;
  subUrl: string;
  handleIsSelectedChange?: (data: UserInterface[]) => void;
  orderBy: string;
}

export default SearchContainer
