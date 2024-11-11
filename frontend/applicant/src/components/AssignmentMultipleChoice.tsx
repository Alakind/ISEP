import { AssignmentMultipleChoiceInterface } from "../utils/types";

function AssignmentMultipleChoice({ assignment }: Props) {
  return (
    <>
      {assignment.options.map((option, i) => (
        <span key={i}>
          <input
            className="assignment__input"
            type={assignment.isMultipleAnswers?"checkbox":"radio"}
            value={option}
            name={assignment.id}
          />
          <label className="assignment__label" htmlFor={assignment.id}>
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
