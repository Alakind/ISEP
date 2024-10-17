import { AssignmentInterface } from "../utils/types";

function AssignmentOpen({ assignment }: AssignmentOpenChoiceProps) {
  return (
    <>
      <textarea />
      <button type="button">Submit</button>
    </>
  );
}

interface AssignmentOpenChoiceProps {
  assignment: AssignmentInterface;
}

export default AssignmentOpen;
