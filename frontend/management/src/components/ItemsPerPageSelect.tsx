import React from "react";
import "../styles/items-per-page.css"

function ItemPerPageSelect({itemsPerPage, setItemsPerPage} : Props) {
  const handleSelect = (e): void => {
    e.preventDefault();
    setItemsPerPage(e.target.value);
  }

  return (
    <span className="items-per-page-select">
      <label htmlFor="floatingSelectGrid">Items per page:</label>
      <select onChange={(e) => handleSelect(e)} className="form-select" id="floatingSelectGrid" defaultValue={itemsPerPage.toString()}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="100">50</option>
        <option value="-1">All</option>
      </select>
    </span>
  );
}

interface Props {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
}
export default ItemPerPageSelect;