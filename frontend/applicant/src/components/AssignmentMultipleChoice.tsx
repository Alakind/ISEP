import { AssignmentMultipleChoiceInterface } from "../utils/types";

function AssignmentMultipleChoice({
  assignment,
}: AssignmentMultipleChoiceProps) {
  return (
    <>
      {assignment.options.map((option, i) => (
        <label key={i}>
          <input type="radio" value={option} name={assignment.id} />
          {option}
        </label>
      ))}
    </>
  );
}

interface AssignmentMultipleChoiceProps {
  assignment: AssignmentMultipleChoiceInterface;
}

export default AssignmentMultipleChoice;
