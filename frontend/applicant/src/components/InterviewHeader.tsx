import { AssignmentTypes } from "../utils/constants";

function InterviewHeader({ section }: InterviewHeaderProps) {
  return (
    <>
      <div>Number of assignments: {section.assignments.length}</div>
    </>
  );
}

interface InterviewHeaderProps {
  section: {
    assignments: {
      type: (typeof AssignmentTypes)[keyof typeof AssignmentTypes];
      isSolved: boolean;
    }[];
  };
}

export default InterviewHeader;
