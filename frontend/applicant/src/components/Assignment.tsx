import { AssignmentTypes } from "../utils/constants";
import {
  AssignmentInterface,
  AssignmentMultipleChoiceInterface,
} from "../utils/types";
import AssignmentMultipleChoice from "./AssignmentMultipleChoice";
import AssignmentOpen from "./AssignmentOpen";
import "../styles/dark_mode_question.css";

function Assignment({ index, assignment }: Props) {
  return (
    <>
      <div className="assignment__header">{index + 1}. {assignment.text}</div>
      <div className="assignment__block">
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

interface Props {
    index: number;
  assignment: AssignmentInterface;
}

export default Assignment;
