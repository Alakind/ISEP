import { AssignmentMultipleChoiceInterface } from "../utils/types";
import {useState} from "react";

function AssignmentMultipleChoice({ assignment }: Props) {
  const [isChecked, setIsChecked] = useState<boolean[]>(
      Array(assignment.options.length).fill(false)
  );

  const handleOptionChange = (index: number) => {
    setIsChecked((prev) => {
      if (assignment.isMultipleAnswers) {
        // For checkboxes: toggle the individual option
        return prev.map((checked, i) => (i === index ? !checked : checked));
      } else {
        // For radio buttons: uncheck all others and check the selected one
        return prev.map((_, i) => i === index);
      }
    });
  };

  return (
    <>
      {assignment.options.map((option, i) => (
        <span key={i} className="assignment__option-wrapper">
          <input
            className={`assignment__input ${isChecked[i] ? "assignment__input--checked" : ""}`}
            type={assignment.isMultipleAnswers?"checkbox":"radio"}
            value={option}
            id={`${assignment.id}_${i}`}
            name={`${assignment.id}_${i}`}
            checked={isChecked[i]}
            onChange={() => handleOptionChange(i)}
          />
          <label className="assignment__label" htmlFor={`${assignment.id}_${i}`}>
            {option}
          </label>
        </span>
      ))}
    </>
  );
}

interface Props {
  assignment: AssignmentMultipleChoiceInterface;
}

export default AssignmentMultipleChoice;
