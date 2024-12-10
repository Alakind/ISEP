import React from "react";
import "../../styles/items-per-page.css"
import ItemPerPageSelect from "../../components/table/ItemsPerPageSelect.tsx";

function ItemPerPageSelectContainer({itemsPerPage, setItemsPerPage} : Props) {
  const handleSelect = (e: { preventDefault: () => void; target: { value: React.SetStateAction<number>; }; }): void => {
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