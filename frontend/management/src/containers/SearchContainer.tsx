import "../styles/search.css"
import React, {useEffect, useState} from "react";
import {ApplicantInterface, UserInterface} from "../utils/types.tsx";
import {toast} from "react-toastify";
import {getSearch} from "../utils/apiFunctions.tsx";
import Search from "../components/Search.tsx";
import {Roles} from "../utils/constants.tsx";

function SearchContainer({ setData, setTotalItems, setLoading, currentPage, itemsPerPage, subUrl, handleIsSelectedChange } : Props ) {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // const res = await getSearch(currentPage, itemsPerPage, subUrl, query);
        const res = {
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
              email: "Jurre@email.com",
              role: Roles.ADMIN,
            },
            {
              name: "Channa2",
              id: "123456789022",
              email: "Channa@email.com",
              role: Roles.RECRUITER,
            },
            {
              name: "Nico2",
              id: "123456789032",
              email: "Nico@email.com",
              role: Roles.INTERVIEWER,
            },
            {
              name: "FallbackAdmin2",
              id: "5232",
              email: "fallbackAdmin@infosupport.nl",
              role: Roles.ADMIN,
            },
          ],
          totalItems: 8}

        setData(res.data);
        setTotalItems(res.totalItems);
        if (handleIsSelectedChange != undefined) {
          handleIsSelectedChange(res.data);
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query]);

  // filteredData = useMemo(() => {
  //   return data.filter((item) => {
  //     const searchField = typeof item === "string" ? item : item.name || "";
  //     return searchField.toLowerCase().includes(query.toLowerCase())
  //   })
  // }, [data, query]);

  // useEffect(() => {
  //   onFilterUpdate(filteredData);
  // }, [filteredData]);

  const clearSearch = () => {
    setQuery("");
  }

  return (
    <Search query={query} setQuery={setQuery} clearSearch={clearSearch} />
  )
}

interface Props {
  setData: React.Dispatch<React.SetStateAction<UserInterface[] | ApplicantInterface[]>>;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  itemsPerPage: number;
  subUrl: string;
  handleIsSelectedChange?: (data: UserInterface[]) => void;
}

export default SearchContainer
