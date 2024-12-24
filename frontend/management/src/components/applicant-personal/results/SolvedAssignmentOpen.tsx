import {AssignmentOpenSolvedInterface} from "../../../utils/types.tsx";

function SolvedAssignmentOpen({assignment}: Props) {
  return (
    <>
      <textarea
        className="assignment__textarea"
        placeholder="No answer provided"
        name={assignment.id}
        value={assignment.answer?.answer}
        contentEditable={false}
        readOnly={true}
      />
    </>
  );
}

interface Props {
  assignment: AssignmentOpenSolvedInterface;
}

export default SolvedAssignmentOpen;
