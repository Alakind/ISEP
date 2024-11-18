import { AssignmentTypes } from "../utils/constants";
import {
    AssignmentCodingInterface,
    AssignmentInterface,
    AssignmentMultipleChoiceInterface,
} from "../utils/types";
import AssignmentMultipleChoice from "./AssignmentMultipleChoice";
import AssignmentCoding from "./AssignmentCoding.tsx";
import AssignmentOpen from "./AssignmentOpen";
import "../styles/dark_mode-question.css";

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
        {assignment.type == AssignmentTypes.CODING && (
          <AssignmentCoding assignment={assignment as AssignmentCodingInterface} />
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
