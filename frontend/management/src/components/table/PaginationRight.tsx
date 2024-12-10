import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case if the current page is either the last pages or 4 indexes less the last 5 pages are shown.
function PaginationRight({ pageNumbers, lastPage, currentPage, handleClick } : Props): ReactNode {
  return (
    <>
      <li className={`page-item page-item--mod ${currentPage === 0 ? "active" : ""}`}>
        <a onClick={(e: MouseEvent<HTMLAnchorElement>): void => handleClick(e, 0)} href="#" className="page-link">
          1
        </a>
      </li>
      <li className={`page-item page-item--mod disabled`}>
        <a className="page-link">
          ...
        </a>
      </li>
      {pageNumbers.map((number: number, index: number): false | ReactNode => (
        index >= lastPage - 4 && (
          <li key={"right_" + number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <a onClick={(e: MouseEvent<HTMLAnchorElement>): void => handleClick(e, number)} href="#" className="page-link">
              {number+1}
            </a>
          </li>)
      ))}
    </>
  );
}

interface Props {
  pageNumbers: number[];
  lastPage: number;
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLAnchorElement>, number: number) => void;
}

export default PaginationRight