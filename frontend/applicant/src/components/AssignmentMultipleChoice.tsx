import { AssignmentMultipleChoiceInterface } from "../utils/types";

function AssignmentMultipleChoice({
  assignment,
}: AssignmentMultipleChoiceProps) {
  return (
    <>
      {assignment.options.map((option, i) => (
        <span>
          <input
            className="question-radio"
            type="radio"
            value={option}
            name={assignment.id}
          />
          <label key={i} htmlFor={assignment.id}>
            {option}
          </label>
        </span>
      ))}
    </>
  );
}

interface AssignmentMultipleChoiceProps {
  assignment: AssignmentMultipleChoiceInterface;
}

export default AssignmentMultipleChoice;
