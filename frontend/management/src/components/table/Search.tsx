import "../../styles/search.css"
import {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";

function Search({query, setQuery, clearSearch}: Props): ReactNode {
  return (
    <div className="user-list__div">
      <form className="form-inline user-list__form">
        <input id="search" value={query} onChange={(e: ChangeEvent<HTMLInputElement>): void => setQuery(e.target.value)} className="form-control mr-sm-2 input--mod" type="text" placeholder="Search..."
               aria-label="Search"/>
        <a onClick={clearSearch} className="btn btn-primary my-2 my-sm-0 btn--mod btn--search" role="button"><i className="bi bi-x-lg"></i></a>
      </form>
    </div>
  )
}

interface Props {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  clearSearch: () => void;
}

export default Search
