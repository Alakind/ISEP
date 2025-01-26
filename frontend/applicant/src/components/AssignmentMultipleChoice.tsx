import { sendMultipleChoiceSolution } from "../utils/apiFunctions";
import { AssignmentMultipleChoiceInterface } from "../utils/types";
import { useEffect, useState } from "react";

function AssignmentMultipleChoice({ assignment, setAssignmentAnswer }: Props) {
  const [checkedAnswers, setCheckedAnswers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCheckedAnswers((prev) => {
      const answers: Set<string> = new Set();
      for (const currentAnswer in assignment.answer.answer) {
        answers.add(currentAnswer);
      }
      return answers;
    });
  }, []);

  const handleOptionChange = async (option: string) => {
    let newAnswers = new Set();
    setCheckedAnswers((prev: Set<string>) => {
      newAnswers = new Set(prev);
      if (prev.has(option)) {
        newAnswers.delete(option);
      } else {
        newAnswers.add(option);
      }

      return newAnswers;
    });
    setAssignmentAnswer(newAnswers);

    await sendMultipleChoiceSolution(assignment, [...checkedAnswers]);
  };

  return (
    <>
      {assignment.options.map((option, i) => (
        <span key={i} className="assignment__option-wrapper">
          <input
            className={`assignment__input ${
              checkedAnswers.has(option) ? "assignment__input--checked" : ""
            }`}
            type={assignment.isMultipleAnswers ? "checkbox" : "radio"}
            value={option}
            id={`${assignment.id}_${i}`}
            name={`${assignment.id}_${i}`}
            checked={checkedAnswers.has(option)}
            onChange={() => handleOptionChange(option)}
          />
          <label
            className="assignment__label"
            htmlFor={`${assignment.id}_${i}`}
          >
            {option}
          </label>
        </span>
      ))}
    </>
  );
}

interface Props {
  assignment: AssignmentMultipleChoiceInterface;
  setAssignmentAnswer: (arg: object) => void;
}

export default AssignmentMultipleChoice;
