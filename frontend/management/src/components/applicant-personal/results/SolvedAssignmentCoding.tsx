import {AssignmentCodingSolvedInterface} from "../../../utils/types.tsx";

function SolvedAssignmentCoding({assignment}: Readonly<Props>) {
  return (
    <div data-testid={"solved-assignment-coding"}>SolvedAssignmentCoding {assignment.id}</div>
  )
}

interface Props {
  assignment: AssignmentCodingSolvedInterface
}

export default SolvedAssignmentCoding
