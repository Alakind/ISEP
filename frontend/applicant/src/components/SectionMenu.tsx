import {AssessmentInterface} from "../utils/types";
import "../styles/section_menu.css"
import React, {useState} from "react";
import AssignmentMenu from "./AssignmentMenu.tsx";

function SectionMenu({assessment, currentSectionIndex, changeSectionIndex, currentAssignmentIndex, setCurrentAssignmentIndex}: Readonly<Props>) {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  const handleNextSection = (mapIndex: number) => {
    changeSectionIndex(mapIndex).then();
  };

  return (
    <div className="section-menu">
      {assessment.sections.map((section, mapIndex) =>
        <span role={"tooltip"} key={section.id} className="section-menu__wrapper" onMouseLeave={() => setHoveredSection(null)}>
          <button className={"btn--transparent"} onClick={() => handleNextSection(mapIndex)}>
              <div role="tooltip" className={`section-menu__tile ${currentSectionIndex === mapIndex ? 'section-menu__tile--selected' : ''}`} onMouseEnter={() => setHoveredSection(mapIndex)}>
                  {section.title}
              </div>
          </button>
          {hoveredSection === mapIndex && (
            <AssignmentMenu
              section={section}
              assignmentSectionIndex={mapIndex}
              currentSectionIndex={currentSectionIndex}
              changeSectionIndex={changeSectionIndex}
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
  changeSectionIndex: (sectionIndex: number) => Promise<void>;
  currentAssignmentIndex: number[];
  setCurrentAssignmentIndex: React.Dispatch<React.SetStateAction<number[]>>;
}

export default SectionMenu;
