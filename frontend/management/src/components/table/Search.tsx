import "../../styles/search.css"
import {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";

function Search({searchKeyword, setSearchKeyword, clearSearch, selectedOption, handleSelect}: Readonly<Props>): ReactNode {
  return (
    <div className="search__div">
      <form className="form-inline search__div__form">
        <select className="form-select search__div__form__select" id="searchSelect" onChange={(e: ChangeEvent<HTMLSelectElement>): void => handleSelect(e)} defaultValue={selectedOption}>
          <option value={"name"}>Name</option>
          <option value={"email"}>Email</option>
          <option value={"both"}>Both</option>
        </select>
        <input id="search" name={"search"} value={searchKeyword} onChange={(e: ChangeEvent<HTMLInputElement>): void => setSearchKeyword(e.target.value)} className="form-control input--mod" type="text"
               placeholder="Search..."
               aria-label="Search"/>
        {
          searchKeyword !== ""
            ? (
              <button onClick={clearSearch} className="btn btn-primary btn--cancel" data-testid={"search-clear-button"}>
                <i className="bi bi-x-lg search__div__form__icon"></i>
              </button>
            ) : (
              <button className="btn btn-primary btn--search" data-testid={"search-button"}>
                <i className="bi bi-search search__div__form__icon"></i>
              </button>
            )
        }
      </form>
    </div>
  )
}

interface Props {
  searchKeyword: string;
  setSearchKeyword: Dispatch<SetStateAction<string>>;
  clearSearch: () => void;
  selectedOption: string;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default Search
