import { AssignmentTypes } from "../utils/constants";
import {
  AssignmentInterface,
  AssignmentMultipleChoiceInterface,
} from "../utils/types";
import AssignmentMultipleChoice from "./AssignmentMultipleChoice";
import AssignmentOpen from "./AssignmentOpen";
import "../styles/dark_mode_question.css";

function Assignment({ assignment }: AssignmentProps) {
  return (
    <>
      <div className="question-header">{assignment.text}</div>
      <div className="question-block">
        {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
          <AssignmentMultipleChoice
            assignment={assignment as AssignmentMultipleChoiceInterface}
          />
        )}
        {assignment.type == AssignmentTypes.OPEN && (
          <AssignmentOpen assignment={assignment} />
        )}
      </div>
    </>
  );
}

interface AssignmentProps {
  assignment: AssignmentInterface;
}

export default Assignment;
