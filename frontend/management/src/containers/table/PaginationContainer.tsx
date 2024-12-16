import {Dispatch, MouseEvent, ReactNode, SetStateAction} from 'react'
import Pagination from "../../components/table/Pagination.tsx";

function PaginationContainer({ itemsPerPage, totalItems, setCurrentPage, currentPage } : Props): ReactNode {
  const pageNumbers: number[] = [];

  if (itemsPerPage != -1) {
    for (let i: number = 0; i < Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(0);
  }
  const lastPage: number = pageNumbers[pageNumbers.length-1];

  function handleClick(e: MouseEvent<HTMLAnchorElement>, number: SetStateAction<number>): void {
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
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
}

export default PaginationContainer
