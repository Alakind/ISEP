import { AssessmentInterface } from "../utils/types";
import "../styles/dark_mode_header.css";

function Header({ assessment }: Props) {
  return (
    <header className="header">
      {/* <div>Number of assignments: {section.assignments.length}</div> */}
      {/* //TODO fix dummy data. 1 should be current section */}
      <span className="header__left">
        <div>
          Section 1 of {assessment.sections.length}:
        </div>
        <div>
          {/* TODO make section types a variable */}
          Multiple Choice Questions
        </div>
        <div>
          <div
            className="progress header__progress"
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="header__progress-bar"></div>
          </div>
        </div>
      </span>
      <span className="header__right">
        <span>
          <span>Time left: </span>
          <span className="header__time-text">00:12:34</span>
        </span>
        <span>
          <i className="bi bi-clock"></i>
        </span>
      </span>
    </header>
  );
}

interface Props {
  assessment: AssessmentInterface;
}

export default Header;
