import {AssignmentInterface, SectionInterface} from "../utils/types";
import "../styles/dark_mode_assignment-menu.css"
import React from "react";

function AssignmentMenu({ section,  assignmentSectionIndex, currentSectionIndex, setCurrentSectionIndex, currentAssignmentIndex, setCurrentAssignmentIndex, onMouseEnter, onMouseLeave }: Props) {
    const handleAssignmentClick = (assignment: AssignmentInterface, assignmentIndex: number) : void => {
        if (currentSectionIndex !== assignmentSectionIndex) {
            setCurrentSectionIndex(assignmentSectionIndex);
        }

        setCurrentAssignmentIndex((prevIndexes: number[]) =>
            prevIndexes.map((index:number, i:number):number =>
                i === assignmentSectionIndex ? assignmentIndex : index
            )
        );
    };

    return (
        <div className="assignment-menu" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {section.assignments.map((assignment:AssignmentInterface, i:number) => (
                <a key={assignment.id} onClick={() => handleAssignmentClick(assignment, i)}>
                    <span
                        className={`assignment-menu__tile ${
                            currentAssignmentIndex[currentSectionIndex] === i && (currentSectionIndex == assignmentSectionIndex)
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
    setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
    currentAssignmentIndex: number[];
    setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default AssignmentMenu;
