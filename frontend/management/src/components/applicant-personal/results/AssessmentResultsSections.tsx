import {AssignmentCodingSolvedInterface, AssignmentMultipleChoiceSolvedInterface, AssignmentOpenSolvedInterface, AssignmentSolvedInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {AssignmentTypes} from "../../../utils/constants.tsx";
import SolvedAssignmentMultipleChoice from "./SolvedAssignmentMultipleChoice.tsx";
import SolvedAssignmentOpen from "./SolvedAssignmentOpen.tsx";
import SolvedAssignmentCoding from "../SolvedAssignmentCoding.tsx";
import SolvedAssignmentContainer from "../../../containers/applicant-personal/results/SolvedAssignmentContainer.tsx";

function AssessmentResultsSections({inviteUuid, sections, activeSection, setActiveSection}: Props): ReactNode {
  return (
    <div id={`invite_accordion_${inviteUuid}`}>
      {sections.map((section: SectionSolvedInterface, sectionIndex: number): ReactNode => (
        <div key={`section-${section.id}`} className="card">
          <div className="card-header section__header" id={`heading-${section.id}`} onClick={(): void => setActiveSection(sectionIndex)}>
            <span>{section.title}</span>
            <span>{section.measuredTime ?? "No measured time"}<br></br><span className={"section__header__sug-time"}>Suggested: {section.suggestedTime ?? "-"} min.</span></span>
            <span>{section.scoredPoints ?? 0} / {section.availablePoints ?? 0}</span>
            <span>{section.availablePoints ? (section.scoredPoints / section.availablePoints * 100).toFixed(2) : (0.00).toFixed(2)} %</span>
          </div>
          <div id={`collapse${section.id}`} className={`collapse ${activeSection == sectionIndex ? "show" : ""}`} aria-labelledby={`heading${section.id}`}
               data-parent={`#invite_accordion_${inviteUuid}`}>
            <div className="card-body">
              {section.assignments.map((assignment: AssignmentSolvedInterface, assignmentIndex: number): ReactNode => (
                <div key={assignmentIndex}>
                  {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}>
                      <SolvedAssignmentMultipleChoice
                        assignment={assignment as AssignmentMultipleChoiceSolvedInterface}
                      />
                    </SolvedAssignmentContainer>
                  )}
                  {assignment.type == AssignmentTypes.OPEN && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}>
                      <SolvedAssignmentOpen assignment={assignment as AssignmentOpenSolvedInterface}/>
                    </SolvedAssignmentContainer>
                  )}
                  {assignment.type == AssignmentTypes.CODING && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}>
                      <SolvedAssignmentCoding assignment={assignment as AssignmentCodingSolvedInterface}/>
                    </SolvedAssignmentContainer>
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
