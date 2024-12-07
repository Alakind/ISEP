import "../styles/checkbox.css";

function Checkbox({ id, handleOptionChange, isChecked } : Props) {
  return (
    <input
      className={`checkbox__input ${isChecked ? "checkbox__input--checked" : ""}`}
      id={id}
      type={"checkbox"}
      checked={isChecked}
      onChange={() => handleOptionChange(id)}
    />
  )
}

interface Props {
  id: string;
  handleOptionChange: (id: string) => void;
  isChecked: boolean;
}

export default Checkbox
