import {AssignmentTypes} from "../utils/constants";
import {AssignmentCodingInterface, AssignmentInterface, AssignmentMultipleChoiceInterface, AssignmentOpenInterface,} from "../utils/types";
import AssignmentMultipleChoice from "./AssignmentMultipleChoice";
import AssignmentCoding from "./AssignmentCoding.tsx";
import AssignmentOpen from "./AssignmentOpen";
import "../styles/question.css";

function Assignment({index, assignment, setAssignmentAnswer}: Readonly<Props>) {
  return (
    <>
      <div className="assignment__header">
        {index + 1}. {assignment.description}
      </div>
      <div className="assignment__block">
        {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
          <AssignmentMultipleChoice
            assignment={assignment as AssignmentMultipleChoiceInterface}
            setAssignmentAnswer={setAssignmentAnswer}
          />
        )}
        {assignment.type == AssignmentTypes.OPEN && (
          <AssignmentOpen
            assignment={assignment as AssignmentOpenInterface}
            setAssignmentAnswer={setAssignmentAnswer}
          />
        )}
        {assignment.type == AssignmentTypes.CODING && (
          <AssignmentCoding
            assignment={assignment as AssignmentCodingInterface}
            setAssignmentAnswer={setAssignmentAnswer}
          />
        )}
      </div>
    </>
  );
}

interface Props {
  index: number;
  assignment: AssignmentInterface;
  setAssignmentAnswer: (answer: object) => void;
}

export default Assignment;
