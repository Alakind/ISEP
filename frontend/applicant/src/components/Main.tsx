import Assignment from "../components/Assignment";
import { AssessmentInterface } from "../utils/types";
import "../styles/dark_mode_main.css";

function Main({ assessment }: Props) {
  return (
    <main>
      <div className="main-container">
        {assessment.sections.map((section) =>
          section.assignments.map((assignment) => (
            <div className="assignment" key={assignment.id}>
              <Assignment assignment={assignment} />
            </div>
          ))
        )}
      </div>
    </main>
  );
}

interface Props {
  assessment: AssessmentInterface;
}

export default Main;
