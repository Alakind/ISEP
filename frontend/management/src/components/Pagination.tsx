import "../styles/pagination.css"
import PaginationAll from "./PaginationAll.tsx";
import PaginationLeft from "./PaginationLeft.tsx";
import PaginationRight from "./PaginationRight.tsx";
import PaginationCenter from "./PaginationCenter.tsx";

function Pagination({ pageNumbers, itemsPerPage, lastPage, currentPage, handleClick } : Props) {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        {/*TODO add 10 previous and 10 next*/}
        {/*TODO Add go to specific page box*/}
        <li className={`page-item ${currentPage=== 1 ? "disabled" : ""}`}>
          <a onClick={(e) => handleClick(e, currentPage-1)} className="page-link" href="#"> <i className="bi bi-caret-left"></i></a>
        </li>
        {
          lastPage <= 7 || itemsPerPage == -1 ?
            <PaginationAll  currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers}/> :
            (currentPage <= 4 ?
                <PaginationLeft  currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/> :
                (currentPage >= lastPage - 3 ?
                    <PaginationRight  currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/> :
                    <PaginationCenter  currentPage={currentPage} handleClick={handleClick} pageNumbers={pageNumbers} lastPage={lastPage}/>
                )
            )
        }
        <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
          <a onClick={(e) => handleClick(e, currentPage+1)} className="page-link" href="#"><i className="bi bi-caret-right"></i></a>
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
  handleClick: (e: any, number: number) => void;
}

export default Pagination
