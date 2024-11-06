import { InterviewInterface } from "../utils/types";
import "../styles/dark_mode_header.css";

function InterviewHeader({ interview }: InterviewHeaderProps) {
  return (
    <header className="interview-header">
      {/* <div>Number of assignments: {section.assignments.length}</div> */}
      {/* //TODO fix dummy data. 1 should be current section */}
      <span className="header-left">
        <div>
          Section 1 of {/*fuck linter*/}
          {interview.sections.length}:
        </div>
        <div>
          {/* TODO make section types a variable */}
          Multiple Choice Questions
        </div>
        <div>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar"></div>
          </div>
        </div>
      </span>
      <span className="header-right">
        <span>
          <span>Time left: </span>
          <span className="time-left">00:12:34</span>
        </span>
        <span>
          <i className="bi bi-clock"></i>
        </span>
      </span>
    </header>
  );
}

interface InterviewHeaderProps {
  interview: InterviewInterface;
}

export default InterviewHeader;
