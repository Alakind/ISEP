import "../../styles/pagination.css"
import {MouseEvent, ReactNode} from "react";

// In case if the current page is higher than 4 or lower than last page - 4
function PaginationCenter({pageNumbers, lastPage, currentPage, handleClick}: Readonly<Props>): ReactNode {
  return (
    <>
      <li className={`page-item page-item--mod ${currentPage === 0 ? "active" : ""}`}>
        <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, 0)} className="page-link page-link--mod">
          1
        </button>
      </li>
      <li className={`page-item page-item--mod disabled`}>
        <button className="page-link page-link--mod">
          ...
        </button>
      </li>
      {pageNumbers.map((number: number, index: number): false | ReactNode => (
        index >= currentPage - 1 && index <= currentPage + 1 && (
          <li key={"center_" + number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, number)} className="page-link page-link--mod">
              {number + 1}
            </button>
          </li>)
      ))}
      <li className={`page-item page-item--mod disabled`}>
        <button className="page-link page-link--mod">
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

export default PaginationCenter