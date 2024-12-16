import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case the total pages amount are 7 or less.
function PaginationAll({ pageNumbers, currentPage, handleClick } : Props): ReactNode {
  return (
    <>
      {pageNumbers.map((number: number): ReactNode => (
        <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
          <a onClick={(e: MouseEvent<HTMLAnchorElement>): void => handleClick(e, number)} href="#" className="page-link">
            {number+1}
          </a>
        </li>
      ))}
    </>
  );
}

interface Props {
  pageNumbers: number[];
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLAnchorElement>, number: number) => void;
}

export default PaginationAll