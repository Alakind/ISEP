import Checkbox from "../components/Checkbox.tsx";
import {Selection} from "../utils/types.tsx";
import {ReactNode, useState} from "react";


function CheckboxContainer({id, additionalAction, isSelected} : Props): ReactNode {
  const [isChecked, setIsChecked] = useState(false);

  function handleOptionChange(id: string): void {
    setIsChecked(!isChecked);
    if (additionalAction != undefined) {
      if (id == "checkbox-all") {
        additionalAction(!isChecked);
      } else {
        additionalAction(id);
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

interface Props {
  id: string;
  additionalAction?: (arg0: any ) => void;
  isSelected?: Selection[];
}

export default CheckboxContainer
