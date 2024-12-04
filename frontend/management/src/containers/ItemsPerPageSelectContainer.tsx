import React from "react";
import "../styles/items-per-page.css"
import ItemPerPageSelect from "../components/ItemsPerPageSelect.tsx";

function ItemPerPageSelectContainer({itemsPerPage, setItemsPerPage} : Props) {
  const handleSelect = (e): void => {
    e.preventDefault();
    setItemsPerPage(e.target.value);
  }

  return (
    <ItemPerPageSelect handleSelect={handleSelect} itemsPerPage={itemsPerPage}/>
  );
}

interface Props {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
}
export default ItemPerPageSelectContainer;