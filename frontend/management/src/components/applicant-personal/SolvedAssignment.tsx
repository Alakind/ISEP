import {AssignmentInterface} from "../../utils/types.tsx";
import {ReactNode} from "react";

function SolvedAssignment({assignment}: Props): ReactNode {
  return (
    <div>{assignment.description}
      <div>{assignment.answer.answer}</div>
    </div>
  )
}

interface Props {
  assignment: AssignmentInterface;
}

export default SolvedAssignment
