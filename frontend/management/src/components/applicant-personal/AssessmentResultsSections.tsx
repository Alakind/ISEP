import {SectionInterface} from "../../utils/types.tsx";
import SolvedAssignment from "./SolvedAssignment.tsx";
import React from "react";

function AssessmentResultsSections({sections, activeSection, setActiveSection}: Props) {
  return (
    <div id="accordion">
      {sections.map((section, sectionIndex) => (
        <div key={`section-${section.id}`} className="card">
          <div className="card-header" id={`heading${section.id}`}>
            <h5 className="mb-0">
              <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${section.id}`} aria-expanded="true" aria-controls={`collapse${section.id}`} onClick={() => setActiveSection(sectionIndex)}>
                {section.title}
              </button>
            </h5>
          </div>
          <div id={`collapse${section.id}`} className={`collapse ${activeSection == sectionIndex ? "show" : ""}`} aria-labelledby={`heading${section.id}`} data-parent="#accordion">
            <div className="card-body">
              {section.assignments.map((assignment, assignmentIndex) => (
                 <SolvedAssignment assignment={assignment} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} />
                ))
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface Props {
  sections: SectionInterface[];
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
}

export default AssessmentResultsSections
