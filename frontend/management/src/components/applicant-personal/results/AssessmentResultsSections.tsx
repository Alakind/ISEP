import {AssignmentCodingSolvedInterface, AssignmentMultipleChoiceSolvedInterface, AssignmentOpenSolvedInterface, AssignmentSolvedInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import SolvedAssignment from "./SolvedAssignment.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {AssignmentTypes} from "../../../utils/constants.tsx";
import SolvedAssignmentMultipleChoice from "./SolvedAssignmentMultipleChoice.tsx";
import SolvedAssignmentOpen from "./SolvedAssignmentOpen.tsx";
import SolvedAssignmentCoding from "../SolvedAssignmentCoding.tsx";

function AssessmentResultsSections({inviteUuid, sections, activeSection, setActiveSection}: Props): ReactNode {
  return (
    <div id={`invite_accordion_${inviteUuid}`}>
      {sections.map((section: SectionSolvedInterface, sectionIndex: number): ReactNode => (
        <div key={`section-${section.id}`} className="card">
          <div className="card-header section__header" id={`heading-${section.id}`} onClick={(): void => setActiveSection(sectionIndex)}>
            <span>{section.title}</span>
            <span>{section.measuredTime ?? "No measured time"}<br></br><span className={"section__header__sug-time"}>Suggested: {section.suggestedTime ?? "-"} min.</span></span>
            <span>{section.scoredPoints ?? 0} / {section.totalPoints ?? 0}</span>
            <span>{section.totalPoints ? (section.scoredPoints / section.totalPoints * 100).toFixed(2) : (0.00).toFixed(2)} %</span>
          </div>
          <div id={`collapse${section.id}`} className={`collapse ${activeSection == sectionIndex ? "show" : ""}`} aria-labelledby={`heading${section.id}`}
               data-parent={`#invite_accordion_${inviteUuid}`}>
            <div className="card-body">
              {section.assignments.map((assignment: AssignmentSolvedInterface, assignmentIndex: number): ReactNode => (
                <div key={assignmentIndex}>
                  {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
                    <SolvedAssignment assignment={assignment} index={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`}>
                      <SolvedAssignmentMultipleChoice
                        assignment={assignment as AssignmentMultipleChoiceSolvedInterface}
                      />
                    </SolvedAssignment>
                  )}
                  {assignment.type == AssignmentTypes.OPEN && (
                    <SolvedAssignment assignment={assignment} index={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`}>
                      <SolvedAssignmentOpen assignment={assignment as AssignmentOpenSolvedInterface}/>
                    </SolvedAssignment>
                  )}
                  {assignment.type == AssignmentTypes.CODING && (
                    <SolvedAssignment assignment={assignment} index={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`}>
                      <SolvedAssignmentCoding assignment={assignment as AssignmentCodingSolvedInterface}/>
                    </SolvedAssignment>
                  )}
                </div>
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
  inviteUuid: string;
  sections: SectionSolvedInterface[];
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
}

export default AssessmentResultsSections
