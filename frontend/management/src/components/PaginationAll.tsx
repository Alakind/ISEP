import React from 'react'
import "../styles/pagination.css"

// In case the total pages amount are 7 or less.
function PaginationAll({ pageNumbers, currentPage, handleClick } : Props) {
  return (
    <>
      {pageNumbers.map((number) => (
        <li key={number} className={`page-item page-item--mod ${currentPage === number ? "active" : ""}`}>
          <a onClick={(e) => handleClick(e, number)} href="#" className="page-link">
            {number}
          </a>
        </li>
      ))}
    </>
  );
}

interface Props {
  pageNumbers: number[];
  currentPage: number;
  handleClick: (e, number: number) => void;
}

export default PaginationAll