import "../../styles/bulk-action.css"
import React from "react";

function BulkActionSelect({ loading, options, handleSelect, selectedOption, setSelectedOption} : Props) {
  return (
    <span className="bulk-action-select">
      <label htmlFor="bulkActionSelect">Actions:</label>
      <select disabled={loading} onChange={(e) => handleSelect(e)} className="form-select" id="bulkActionSelect" defaultValue={selectedOption}>
        {options.map((option,index) => (
          <option key={index} value={option} onClick={() => setSelectedOption(option)}>{option}</option>
        ))}
      </select>
    </span>
  )
}

interface Props {
  loading: boolean;
  options: string[];
  handleSelect: (e: any) => void;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}
export default BulkActionSelect
