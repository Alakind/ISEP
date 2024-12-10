import "../../styles/search.css"
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {ApplicantInterface, UserInterface} from "../../utils/types.tsx";
import {toast} from "react-toastify";
import {getApplicants, getUsers} from "../../utils/apiFunctions.tsx";
import Search from "../../components/table/Search.tsx";

function SearchContainer<T extends UserInterface | ApplicantInterface>({setData, setTotalItems, setLoading, currentPage, itemsPerPage, subUrl, handleIsSelectedChange, orderBy}: Props<T>): ReactNode {
  const [query, setQuery] = useState<string>("");

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        let res;
        if (subUrl == "/user") {
          res = await getUsers(currentPage, itemsPerPage, orderBy, query);
          setData((res.data as T[]));
        } else {
          res = await getApplicants(currentPage, itemsPerPage, orderBy, query);
          setData(res.data as T[]);
        }

        setTotalItems(res.totalItems);
        if (handleIsSelectedChange && subUrl === "/user") {
          handleIsSelectedChange(res.data as UserInterface[]);
        }
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

    fetchData();
  }, [query]);

  function clearSearch(): void {
    setQuery("");
  }

  return (
    <Search query={query} setQuery={setQuery} clearSearch={clearSearch}/>
  )
}

interface Props<T> {
  setData: (data: T[]) => void;
  setTotalItems: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentPage: number;
  itemsPerPage: number;
  subUrl: string;
  handleIsSelectedChange?: (data: UserInterface[]) => void;
  orderBy: string;
}

export default SearchContainer
