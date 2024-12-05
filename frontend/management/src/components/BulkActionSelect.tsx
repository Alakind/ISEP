import "../styles/bulk-action.css"

function BulkActionSelect({ loading, options, handleSelect} : Props) {
  return (
    <span className="bulk-action-select">
      <label htmlFor="bulkActionSelect">Actions:</label>
      <select disabled={loading} onChange={(e) => handleSelect(e)} className="form-select" id="bulkActionSelect" defaultValue={"-"}>
        {options.map((option,index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </span>
  )
}

interface Props {
  loading: boolean;
  options: string[];
  handleSelect: (e) => void;
}
export default BulkActionSelect
