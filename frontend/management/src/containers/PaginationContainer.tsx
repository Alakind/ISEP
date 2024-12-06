import React from 'react'
import Pagination from "../components/Pagination.tsx";

function PaginationContainer({ itemsPerPage, totalItems, setCurrentPage, currentPage } : Props) {
  const pageNumbers: number[] = [];

  if (itemsPerPage != -1) {
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
  }
  const lastPage = pageNumbers[pageNumbers.length-1];

  const handleClick = (e: { preventDefault: () => void; }, number: React.SetStateAction<number>): void => {
    e.preventDefault();
    setCurrentPage(number);
  }

  return (
    <Pagination
      currentPage={currentPage}
      handleClick={handleClick}
      itemsPerPage={itemsPerPage}
      lastPage={lastPage}
      pageNumbers={pageNumbers}
    />
  );
}

interface Props {
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

export default PaginationContainer
