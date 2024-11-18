import {AssessmentInterface} from "../utils/types";
import "../styles/dark_mode-section_menu.css"
import React, {useState} from "react";
import AssignmentMenu from "./AssignmentMenu.tsx";

function SectionMenu({ assessment, currentSectionIndex, setCurrentSectionIndex, currentAssignmentIndex, setCurrentAssignmentIndex }: Props) {
    const [hoveredSection, setHoveredSection] = useState<number | null>(null);

    const handleNextSection = (mapIndex) => {
        //TODO save the state of the question(s)

        setCurrentSectionIndex(mapIndex);
    };

    return (
      <div className="section-menu">
        {assessment.sections.map((section, mapIndex) =>
            <span key={section.id} className="section-menu__wrapper"
                  onMouseLeave={() => setHoveredSection(null)}
            >
                <a onClick={() => handleNextSection(mapIndex)}>
                    <div
                        className={`section-menu__tile ${currentSectionIndex === mapIndex ? 'section-menu__tile--selected' : ''}`}
                        onMouseEnter={() => setHoveredSection(mapIndex)}
                    >
                        {section.title}
                    </div>
                </a>

                {hoveredSection === mapIndex && (
                    <AssignmentMenu
                        section={section}
                        assignmentSectionIndex={mapIndex}
                        currentSectionIndex={currentSectionIndex}
                        setCurrentSectionIndex={setCurrentSectionIndex}
                        currentAssignmentIndex={currentAssignmentIndex}
                        setCurrentAssignmentIndex={setCurrentAssignmentIndex}
                        onMouseEnter={() => setHoveredSection(mapIndex)}
                        onMouseLeave={() => setHoveredSection(null)}
                    />
                )}
            </span>
        )}
      </div>
  );
}

interface Props {
    assessment: AssessmentInterface;
    currentSectionIndex: number;
    setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
    currentAssignmentIndex: number[];
    setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
}

export default SectionMenu;
