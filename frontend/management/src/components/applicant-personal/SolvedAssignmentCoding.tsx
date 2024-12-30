import {AssignmentCodingSolvedInterface} from "../../utils/types.tsx";

function SolvedAssignmentCoding({assignment}: Props) {
  return (
    <div>SolvedAssignmentCoding {assignment.id}</div>
  )
}

interface Props {
  assignment: AssignmentCodingSolvedInterface
}

export default SolvedAssignmentCoding
