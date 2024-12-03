import React from 'react'
import "../styles/pagination.css"

function Pagination({ itemsPerPage, totalItems, setCurrentPage, currentPage } : Props) {
  const pageNumbers: number[] = [];

  if (itemsPerPage != -1) {
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
  }
  const lastPage = pageNumbers[pageNumbers.length-1];

  const handleClick = (e, number): void => {
    e.preventDefault();
    setCurrentPage(number);
  }

  // In case if the current page is either 1 till 4 the first 5 pages are shown
  const pagesLeft = () => {
    return (
      <>
        {pageNumbers.map((number, index) => (
          index + 1 <= 5 && (
            <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
              <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
                {number}
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
            {lastPage}
          </a>
        </li>
      </>
    )
  }

  const pagesCenter = () => {
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
          index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1 && (
            <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
              <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
                {number}
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
            {lastPage}
          </a>
        </li>
      </>
    )
  }

  // In case if the current page is either the last pages or 4 indexes less the last 5 pages are shown.
  const pagesRight = () => {
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
    )
  }

  // In case the total pages amount are 7 or less.
  const allPages = () => {
    return (
      <>
        {pageNumbers.map((number, index) => (
          <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
            <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </>
    )
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        <li className={`page-item ${currentPage=== 1 ? "disabled" : ""}`}>
          <a onClick={(e) => handleClick(e, currentPage-1)} className="page-link" href="#"> <i className="bi bi-caret-left"></i></a>
        </li>
        {
          lastPage <= 7 || itemsPerPage == -1 ?
          allPages() :
            (currentPage <= 4 ?
              pagesLeft() :
              (currentPage >= lastPage - 3 ?
                pagesRight() :
                pagesCenter()
              )
            )
        }
        <li className={`page-item ${currentPage=== lastPage ? "disabled" : ""}`}>
          <a onClick={(e) => handleClick(e, currentPage+1)} className="page-link" href="#"><i className="bi bi-caret-right"></i></a>
        </li>
      </ul>
    </nav>
  );
}

interface Props {
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

export default Pagination
