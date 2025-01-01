import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case the total pages amount are 7 or less.
function PaginationAll({pageNumbers, currentPage, handleClick}: Readonly<Props>): ReactNode {
  return (
    <>
      {pageNumbers.map((number: number): ReactNode => (
        <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
          <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, number)} className="page-link page-link--mod">
            {number + 1}
          </button>
        </li>
      ))}
    </>
  );
}

interface Props {
  pageNumbers: number[];
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLButtonElement>, number: number) => void;
}

export default PaginationAll