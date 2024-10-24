import Assignment from "../components/Assignment";
import { InterviewInterface } from "../utils/types";
import "../styles/dark_mode_main.css";

function InterviewMain({ interview }: InterviewHeaderProps) {
  return (
    <main>
      {interview.sections.map((section) =>
        section.assignments.map((assignment) => (
          <div className="assignment" key={assignment.id}>
            <Assignment assignment={assignment} />
          </div>
        ))
      )}
    </main>
  );
}

interface InterviewHeaderProps {
  interview: InterviewInterface;
}

export default InterviewMain;
