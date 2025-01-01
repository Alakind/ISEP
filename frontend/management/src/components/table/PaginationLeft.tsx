import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case if the current page is either 1 till 4 the first 5 pages are shown
function PaginationLeft({pageNumbers, lastPage, currentPage, handleClick}: Readonly<Props>): ReactNode {
  return (
    <>
      {pageNumbers.map((number: number, index: number): false | ReactNode => (
        index + 1 <= 5 && (
          <li key={"left_" + index} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, number)} className="page-link page-link--mod">
              {number + 1}
            </button>
          </li>)
      ))}
      <li className={`page-item page-item--mod disabled`}>
        <button className="page-link page-link--mod" disabled={true}>
          ...
        </button>
      </li>
      <li className={`page-item page-item--mod ${currentPage === lastPage ? "active" : ""}`}>
        <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, lastPage)} className="page-link page-link--mod">
          {lastPage + 1}
        </button>
      </li>
    </>
  );
}

interface Props {
  pageNumbers: number[];
  lastPage: number;
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLButtonElement>, number: number) => void;
}

export default PaginationLeft
