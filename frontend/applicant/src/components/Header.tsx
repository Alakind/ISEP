import { AssessmentInterface } from "../utils/types";
import "../styles/dark_mode_header.css";

function Header({ assessment, currentSectionIndex }: Props) {
  return (
    <header className="header">
      <span className="header__left">
        <div>
          Section {currentSectionIndex + 1} of {assessment.sections.length}:
        </div>
        <div>
          {/* TODO make section types a variable */}
          {assessment.sections[currentSectionIndex].name} Questions
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
  currentSectionIndex: number;
}

export default Header;
