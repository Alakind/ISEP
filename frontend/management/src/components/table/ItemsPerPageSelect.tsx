import "../../styles/items-per-page.css"

function ItemPerPageSelect({itemsPerPage, handleSelect} : Props) {
  return (
    <span className="items-per-page-select">
      <label htmlFor="floatingSelectGrid">Items per page:</label>
      <select onChange={(e) => handleSelect(e)} className="form-select" id="floatingSelectGrid" defaultValue={itemsPerPage.toString()}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={-1}>All</option>
      </select>
    </span>
  );
}

interface Props {
  itemsPerPage: number;
  handleSelect: (e: any) => void;
}
export default ItemPerPageSelect;