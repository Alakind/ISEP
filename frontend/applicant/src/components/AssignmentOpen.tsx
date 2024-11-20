import {AssignmentInterface} from "../utils/types";

function AssignmentOpen({ assignment } : Props) {
  return (
    <>
      <textarea
          className="assignment__textarea"
          placeholder="Type here ..."
          name={assignment.id}
      />
    </>
  );
}

interface Props {
    assignment: AssignmentInterface;
}

export default AssignmentOpen;
