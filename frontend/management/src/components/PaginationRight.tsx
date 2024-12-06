import "../styles/pagination.css"

// In case if the current page is either the last pages or 4 indexes less the last 5 pages are shown.
function PaginationRight({ pageNumbers, lastPage, currentPage, handleClick } : Props) {
  return (
    <>
      <li className={`page-item page-item--mod ${currentPage === 1 ? "active" : ""}`}>
        <a onClick={(e) => handleClick(e, 1)} href="#" className="page-link">
          1
        </a>
      </li>
      <li className={`page-item page-item--mod disabled`}>
        <a className="page-link">
          ...
        </a>
      </li>
      {pageNumbers.map((number, index) => (
        index + 1 >= lastPage - 4 && (
          <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
              {number}
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
  handleClick: (e: any, number: number) => void;
}

export default PaginationRight