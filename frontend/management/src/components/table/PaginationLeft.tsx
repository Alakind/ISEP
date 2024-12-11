import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case if the current page is either 1 till 4 the first 5 pages are shown
function PaginationLeft({pageNumbers, lastPage, currentPage, handleClick}: Props): ReactNode {
  return (
    <>
      {pageNumbers.map((number: number, index: number): false | ReactNode => (
        index + 1 <= 5 && (
          <li key={"left_" + index} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <a onClick={(e: MouseEvent<HTMLAnchorElement>): void => handleClick(e, number)} href="#" className="page-link">
              {number + 1}
            </a>
          </li>)
      ))}
      <li className={`page-item page-item--mod disabled`}>
        <a className="page-link">
          ...
        </a>
      </li>
      <li className={`page-item page-item--mod ${currentPage === lastPage ? "active" : ""}`}>
        <a onClick={(e: MouseEvent<HTMLAnchorElement>): void => handleClick(e, lastPage)} href="#" className="page-link">
          {lastPage + 1}
        </a>
      </li>
    </>
  );
}

interface Props {
  pageNumbers: number[];
  lastPage: number;
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLAnchorElement>, number: number) => void;
}

export default PaginationLeft
