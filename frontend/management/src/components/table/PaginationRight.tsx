import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case if the current page is either the last pages or 4 indexes less the last 5 pages are shown.
function PaginationRight({pageNumbers, lastPage, currentPage, handleClick}: Readonly<Props>): ReactNode {
  return (
    <>
      <li className={`page-item page-item--mod ${currentPage === 0 ? "active" : ""}`} data-testid={"pagination-right-item"}>
        <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, 0)} className="page-link page-link--mod">
          1
        </button>
      </li>
      <li className={`page-item page-item--mod disabled`} data-testid={"pagination-right-item"}>
        <button className="page-link page-link--mod" disabled={true}>
          ...
        </button>
      </li>
      {pageNumbers.map((number: number, index: number): false | ReactNode => (
        index >= lastPage - 4 && (
          <li key={"right_" + number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`} data-testid={"pagination-right-item"}>
            <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, number)} className="page-link page-link--mod">
              {number + 1}
            </button>
          </li>)
      ))}
    </>
  );
}

interface Props {
  pageNumbers: number[];
  lastPage: number;
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLButtonElement>, number: number) => void;
}

export default PaginationRight