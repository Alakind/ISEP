import "../../styles/pagination.css"

// In case if the current page is higher than 4 or lower than last page - 4
function PaginationCenter({ pageNumbers, lastPage, currentPage, handleClick } : Props) {
  return (
    <>
      <li className={`page-item page-item--mod ${currentPage === 0 ? "active" : ""}`}>
        <a onClick={(e) => handleClick(e, 0)} href="#" className="page-link">
          1
        </a>
      </li>
      <li className={`page-item page-item--mod disabled`}>
        <a className="page-link">
          ...
        </a>
      </li>
      {pageNumbers.map((number, index) => (
        index >= currentPage - 1 && index <= currentPage + 1 && (
          <li key={"center_" + number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
              {number+1}
            </a>
          </li>)
      ))}
      <li className={`page-item page-item--mod disabled`}>
        <a className="page-link">
          ...
        </a>
      </li>
      <li className={`page-item page-item--mod ${currentPage === lastPage ? "active" : ""}`}>
        <a onClick={(e) => handleClick(e, lastPage)} href="#" className="page-link">
          {lastPage+1}
        </a>
      </li>
    </>
  );
}

interface Props {
  pageNumbers: number[];
  lastPage: number;
  currentPage: number;
  handleClick: (e: any, number: number) => void;
}

export default PaginationCenter