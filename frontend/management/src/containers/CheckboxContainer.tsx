import Checkbox from "../components/Checkbox.tsx";
import {Selection} from "../utils/types.tsx";
import {useState} from "react";


function CheckboxContainer({id, additionalAction, isSelected} : Props) {
  const [isChecked, setIsChecked] = useState(false);
  const handleOptionChange = (id: string) => {
    setIsChecked(!isChecked);
    if (additionalAction != undefined) {
      if (id == "checkbox-all") {
        additionalAction(!isChecked);
      } else {
        additionalAction(id);
      }
    }
  };

  if (id != "checkbox-all") {
    const selectedItem = (isSelected as Selection[]).find((item) => item.id === id);
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
