import Checkbox from "../components/Checkbox.tsx";
import {Selection} from "../utils/types.tsx";
import {ReactNode, useState} from "react";


function CheckboxContainer<T extends string | boolean>({id, additionalAction, isSelected}: Props<T>): ReactNode {
  const [isChecked, setIsChecked] = useState(false);

  function handleOptionChange(id: string): void {
    setIsChecked(!isChecked);
    if (additionalAction != undefined) {
      if (id == "checkbox-all") {
        additionalAction(!isChecked as T);
      } else {
        additionalAction(id as T);
      }
    }
  }

  if (id != "checkbox-all") {
    const selectedItem: Selection | undefined = (isSelected as Selection[]).find((item: Selection): boolean => item.id === id);
    return (
      <Checkbox id={id} handleOptionChange={handleOptionChange} isChecked={selectedItem ? selectedItem.checked : false}/>
    )
  } else {
    return (
      <Checkbox id={id} handleOptionChange={handleOptionChange} isChecked={isChecked}/>
    )
  }
}

interface Props<T> {
  id: string;
  additionalAction?: (arg0: T) => void;
  isSelected?: Selection[];
}

export default CheckboxContainer
