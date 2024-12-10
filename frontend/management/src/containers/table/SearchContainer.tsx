import "../../styles/search.css"
import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {UserInterface} from "../../utils/types.tsx";
import {toast} from "react-toastify";
import {getApplicants, getUsers} from "../../utils/apiFunctions.tsx";
import Search from "../../components/table/Search.tsx";

function SearchContainer({ setData, setTotalItems, setLoading, currentPage, itemsPerPage, subUrl, handleIsSelectedChange, orderBy } : Props ): ReactNode {
  const [query, setQuery] = useState<string>("");

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        let res;
        if (subUrl == "/user") {
          res = await getUsers(currentPage, itemsPerPage, orderBy /*TODO fix that it becomes the current order  */, query);
          setData((res.data));
        } else {
          res = await getApplicants(currentPage, itemsPerPage, orderBy /*TODO fix that it becomes the current order  */, query);
          setData(res.data);
        }

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

  function clearSearch(): void {
    setQuery("");
  }

  return (
    <Search query={query} setQuery={setQuery} clearSearch={clearSearch} />
  )
}

interface Props {
  setData: Dispatch<SetStateAction<any>>;
  setTotalItems: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentPage: number;
  itemsPerPage: number;
  subUrl: string;
  handleIsSelectedChange?: (data: UserInterface[]) => void;
  orderBy: string;
}

export default SearchContainer
