import "../../styles/search.css"
import {ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import Search from "../../components/table/Search.tsx";

function SearchContainer({setQuery}: Readonly<Props>): ReactNode {
  const [selectedOption, setSelectedOption] = useState<string>("name");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  function clearSearch(): void {
    setSearchKeyword("")
    setQuery("");
  }

  useEffect(() => {
    updateQuery(selectedOption)
  }, [searchKeyword]);

  function handleSelect(e: ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault();
    setSelectedOption(e.currentTarget.value);
    updateQuery(e.currentTarget.value)
  }

  function updateQuery(currentOption: string): void {
    if (currentOption !== "both") {
      setQuery(currentOption + "=" + searchKeyword);
    } else {
      setQuery("name=" + searchKeyword + "&email=" + searchKeyword);
    }
  }

  return (
    <Search searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} clearSearch={clearSearch} selectedOption={selectedOption} handleSelect={handleSelect}/>
  )
}

interface Props {
  setQuery: Dispatch<SetStateAction<string>>;
}

export default SearchContainer
