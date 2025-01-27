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
  const handleAssignmentClick = (assignmentIndex: number): void => {
    if (currentSectionIndex !== assignmentSectionIndex) {
      changeSectionIndex(assignmentSectionIndex).then();
    }

    setCurrentAssignmentIndex((prevIndexes: number[]) =>
      prevIndexes.map((index: number, i: number): number =>
        i === assignmentSectionIndex ? assignmentIndex : index
      )
    );
  };

  return (
    <div role={"tooltip"} className="assignment-menu" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {section.assignments.map((assignment: AssignmentInterface, i: number) => (
        <button className={"btn--transparent"} key={assignment.id} onClick={() => handleAssignmentClick(i)}>
          <span
            className={`assignment-menu__tile ${
              currentAssignmentIndex[currentSectionIndex] === i &&
              currentSectionIndex == assignmentSectionIndex
                ? "assignment-menu__tile--selected"
                : ""
            }`
            }
          >
            {i + 1}
          </span>
        </button>
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
