import "../../styles/pagination.css"
import PaginationAll from "./PaginationAll.tsx";
import PaginationLeft from "./PaginationLeft.tsx";
import PaginationRight from "./PaginationRight.tsx";
import PaginationCenter from "./PaginationCenter.tsx";
import {MouseEvent, ReactNode} from "react";

function Pagination({pageNumbers, itemsPerPage, lastPage, currentPage, handleClick}: Readonly<Props>): ReactNode {
  const paginationAll: () => ReactNode = (): ReactNode => {
    return <PaginationAll currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers}/>;
  }

  const paginationNotAll: () => ReactNode = (): ReactNode => {
    return currentPage <= 3
      ? (
        paginationLeft()
      ) : (
        paginationNotLeft()
      )
  }

  const paginationLeft: () => ReactNode = (): ReactNode => {
    return <PaginationLeft currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/>;
  }

  const paginationNotLeft: () => ReactNode = (): ReactNode => {
    return currentPage >= lastPage - 3
      ? (
        <PaginationRight currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/>
      ) : (
        <PaginationCenter currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/>
      )
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        {/*TODO add 10 previous and 10 next*/}
        {/*TODO Add go to specific page box*/}
        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
          <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, currentPage - 1)} className="page-link page-link--mod">
            <i className="bi bi-caret-left"></i>
          </button>
        </li>
        {
          lastPage <= 6 || itemsPerPage == -1
            ? (
              paginationAll()
            ) : (
              paginationNotAll()
            )
        }
        <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
          <button onClick={(e: MouseEvent<HTMLButtonElement>): void => handleClick(e, currentPage + 1)} className="page-link page-link--mod">
            <i className="bi bi-caret-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

interface Props {
  pageNumbers: number[];
  itemsPerPage: number;
  lastPage: number;
  currentPage: number;
  handleClick: (e: MouseEvent<HTMLButtonElement>, number: number) => void;
}

export default Pagination
