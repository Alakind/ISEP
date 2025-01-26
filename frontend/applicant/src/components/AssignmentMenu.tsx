import {AssignmentInterface, SectionInterface} from "../utils/types";
import "../styles/assignment_menu.css";
import {Dispatch, SetStateAction} from "react";

function AssignmentMenu({
                          section,
                          assignmentSectionIndex,
                          currentSectionIndex,
                          changeSectionIndex,
                          currentAssignmentIndex,
                          setCurrentAssignmentIndex,
                          onMouseEnter,
                          onMouseLeave,
                        }: Readonly<Props>) {
  const handleAssignmentClick = (assignment: AssignmentInterface, assignmentIndex: number): void => {
    //TODO save the state of the question(s)

    if (currentSectionIndex !== assignmentSectionIndex) {
      changeSectionIndex(assignmentSectionIndex);
    }

    setCurrentAssignmentIndex((prevIndexes: number[]) =>
      prevIndexes.map((index: number, i: number): number =>
        i === assignmentSectionIndex ? assignmentIndex : index
      )
    );
  };

  return (
    <div
      className="assignment-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {section.assignments.map((assignment: AssignmentInterface, i: number) => (
        <a
          key={assignment.id}
          onClick={() => handleAssignmentClick(assignment, i)}
        >
          <span
            className={`assignment-menu__tile ${
              currentAssignmentIndex[currentSectionIndex] === i &&
              currentSectionIndex == assignmentSectionIndex
                ? "assignment-menu__tile--selected"
                : ""
            }`}
          >
            {i + 1}
          </span>
        </a>
      ))}
    </div>
  );
}

interface Props {
  section: SectionInterface;
  assignmentSectionIndex: number;
  currentSectionIndex: number;
  changeSectionIndex: (sectionIndex: number) => Promise<void>;
  currentAssignmentIndex: number[];
  setCurrentAssignmentIndex: Dispatch<SetStateAction<number[]>>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default AssignmentMenu;
