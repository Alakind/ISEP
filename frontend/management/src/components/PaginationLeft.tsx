import "../styles/pagination.css"

// In case if the current page is either 1 till 4 the first 5 pages are shown
function PaginationLeft({ pageNumbers, lastPage, currentPage, handleClick } : Props) {
  return (
    <>
      {pageNumbers.map((number, index) => (
        index + 1 <= 5 && (
          <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
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

export default PaginationLeft
