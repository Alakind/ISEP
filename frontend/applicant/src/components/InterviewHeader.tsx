import { SectionInterface } from "../utils/types";

function InterviewHeader({ section }: InterviewHeaderProps) {
  return (
    <>
      <div>Number of assignments: {section.assignments.length}</div>
    </>
  );
}

interface InterviewHeaderProps {
  section: SectionInterface;
}

export default InterviewHeader;
