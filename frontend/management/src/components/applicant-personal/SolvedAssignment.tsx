import {AssignmentInterface} from "../../utils/types.tsx";

function SolvedAssignment({assignment}: Props) {
  return (
    <div>{assignment.description}</div>
  )
}

interface Props {
  assignment: AssignmentInterface;
}

export default SolvedAssignment
