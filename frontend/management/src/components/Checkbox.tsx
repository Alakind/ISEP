import "../styles/checkbox.css";
import {ReactNode} from "react";

function Checkbox({id, handleOptionChange, isChecked}: Readonly<Props>): ReactNode {
  return (
    <input
      className={`checkbox__input ${isChecked ? "checkbox__input--checked" : ""}`}
      id={id}
      type={"checkbox"}
      checked={isChecked}
      onChange={(): void => handleOptionChange(id)}
      data-testid={"checkbox"}
    />
  )
}

interface Props {
  id: string;
  handleOptionChange: (id: string) => void;
  isChecked: boolean;
}

export default Checkbox
