import "../styles/search.css"
import React, {useEffect, useState} from "react";
import {ApplicantInterface, UserInterface} from "../utils/types.tsx";
import {toast} from "react-toastify";
import {getUsers} from "../utils/apiFunctions.tsx";

function Search({ setData, setTotalItems, setLoading, currentPage, itemsPerPage } : Props ) {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // const res = await getSearch(currentPage, itemsPerPage, "/user", query);
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
            {
              name: "Jurre2",
              id: "123456789012",
              email: "Jurre@email.com",
              role: "Admin",
              access: false,
            },
            {
              name: "Channa2",
              id: "123456789022",
              email: "Channa@email.com",
              role: "Recruiter",
              access: true,
            },
            {
              name: "Nico2",
              id: "123456789032",
              email: "Nico@email.com",
              role: "Interviewer",
            },
            {
              name: "FallbackAdmin2",
              id: "5232",
              email: "fallbackAdmin@infosupport.nl",
              role: "Admin",
              access: true,
            },
          ],
          totalItems: 50}

        setData(res.data);
        setTotalItems(res.totalItems);
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

  return (
    <div className="user-list__div">
      <form className="form-inline user-list__form">
        <input id="search" value={query} onChange={(e) => {setQuery(e.target.value); console.log(e.target.value)}} className="form-control mr-sm-2 input--mod" type="text" placeholder="Search..." aria-label="Search" />
        <a onClick={(e) => document.getElementById('search').value = ""} className="btn btn-primary my-2 my-sm-0 btn--mod btn--search" role="button"><i className="bi bi-x-lg"></i></a>
      </form>
    </div>
  )
}

interface Props {
  setData: React.Dispatch<React.SetStateAction<UserInterface[] | ApplicantInterface[]>>;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  itemsPerPage: number;
}

export default Search
