import {AssignmentMultipleChoiceSolvedInterface} from "../../../utils/types.tsx";

function SolvedAssignmentMultipleChoice({assignment}: Readonly<Props>) {
  return (
    <>
      {assignment.options.map((option: string, index: number) => {
        const inAnswer: boolean = assignment.answer.answer.includes(index);
        const inSolution: boolean = assignment.referenceAnswer?.answer?.includes(index)
        return (
          <span key={"mc-" + assignment.id + "-" + index} className={`assignment__option-wrapper ${inSolution ? "assignment__option-wrapper--correct" : ""}`}>
            <input
              className={`assignment__input ${inAnswer && !inSolution ? "assignment__input--wrong" : ""} ${inAnswer && inSolution ? "assignment__input--correct" : ""}`}
              type={assignment.isMultipleAnswers ? "checkbox" : "radio"}
              value={option}
              id={`${assignment.id}_${index}`}
              name={`${assignment.id}_${index}`}
              disabled
            />
            <label className={`assignment__label ${inAnswer && !inSolution ? "assignment__label--wrong" : ""}`}
                   htmlFor={`${assignment.id}_${index}`}>
              {option}
            </label>
            {inSolution && (<span className={"assignment__option-wrapper__correct"}>(solution)</span>)}
          </span>
        )
      })}
    </>
  );
}

interface Props {
  assignment: AssignmentMultipleChoiceSolvedInterface;
}

export default SolvedAssignmentMultipleChoice;
