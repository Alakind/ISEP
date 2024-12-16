import "../../styles/bulk-action.css"
import {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";

function BulkActionSelect({ loading, options, handleSelect, selectedOption, setSelectedOption} : Props): ReactNode {
  return (
    <span className="bulk-action-select">
      <label htmlFor="bulkActionSelect">Actions:</label>
      <select disabled={loading} onChange={(e: ChangeEvent<HTMLSelectElement>): void => handleSelect(e)} className="form-select" id="bulkActionSelect" defaultValue={selectedOption}>
        {options.map((option: string, index: number): ReactNode => (
          <option key={index} value={option} onClick={(): void => setSelectedOption(option)}>{option}</option>
        ))}
      </select>
    </span>
  )
}

interface Props {
  loading: boolean;
  options: string[];
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}
export default BulkActionSelect
