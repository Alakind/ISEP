import { AssignmentTypes } from "../utils/constants";
import {
  AssignmentInterface,
  AssignmentMultipleChoiceInterface,
} from "../utils/types";
import AssignmentMultipleChoice from "./AssignmentMultipleChoice";
import AssignmentOpen from "./AssignmentOpen";

function Assignment({ assignment }: AssignmentProps) {
  return (
    <>
      <div>{assignment.text}</div>
      {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
        <AssignmentMultipleChoice
          assignment={assignment as AssignmentMultipleChoiceInterface}
        />
      )}
      {assignment.type == AssignmentTypes.OPEN && (
        <AssignmentOpen assignment={assignment} />
      )}
    </>
  );
}

interface AssignmentProps {
  assignment: AssignmentInterface;
}

export default Assignment;
