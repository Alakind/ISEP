import {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";
import "../../styles/items-per-page.css"
import ItemPerPageSelect from "../../components/table/ItemsPerPageSelect.tsx";

function ItemPerPageSelectContainer({itemsPerPage, setItemsPerPage}: Readonly<Props>): ReactNode {
  function handleSelect(e: ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault();
    setItemsPerPage(Number(e.target.value));
  }

  return (
    <ItemPerPageSelect handleSelect={handleSelect} itemsPerPage={itemsPerPage}/>
  );
}

interface Props {
  itemsPerPage: number;
  setItemsPerPage: Dispatch<SetStateAction<number>>
}

export default ItemPerPageSelectContainer;