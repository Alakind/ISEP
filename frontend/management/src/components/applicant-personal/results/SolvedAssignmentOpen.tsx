import {AssignmentOpenSolvedInterface} from "../../../utils/types.tsx";

function SolvedAssignmentOpen({assignment}: Readonly<Props>) {
  return (
    <>
      <textarea
        className="assignment__textarea"
        placeholder="No answer provided"
        name={assignment.id}
        value={assignment.answer?.answer ?? ""}
        contentEditable={false}
        readOnly={true}
        data-testid={"open-answer"}
      />
      <b>Reference answer:</b>
      <textarea
        className="assignment__textarea"
        placeholder="No reference answer available"
        name={assignment.id + "-reference"}
        value={assignment.referenceAnswer?.answer ?? ""}
        contentEditable={false}
        readOnly={true}
        data-testid={"open-reference-answer"}
      />
    </>
  );
}

interface Props {
  assignment: AssignmentOpenSolvedInterface;
}

export default SolvedAssignmentOpen;
