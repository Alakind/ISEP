import {AssignmentCodingSolvedInterface, AssignmentMultipleChoiceSolvedInterface, AssignmentOpenSolvedInterface, AssignmentSolvedInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {AssignmentTypes} from "../../../utils/constants.tsx";
import SolvedAssignmentMultipleChoice from "./SolvedAssignmentMultipleChoice.tsx";
import SolvedAssignmentOpen from "./SolvedAssignmentOpen.tsx";

import SolvedAssignmentContainer from "../../../containers/applicant-personal/results/SolvedAssignmentContainer.tsx";
import SolvedAssignmentCodingContainer from "../../../containers/applicant-personal/results/SolvedAssignmentCodingContainer.tsx";

function AssessmentResultsSections({inviteUuid, sections, activeSection, setActiveSection}: Readonly<Props>): ReactNode {
  function formatMeasuredTime(seconds: number | undefined): string | undefined {
    if (seconds === undefined || seconds === 0) {
      return undefined;
    }

    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const remainingSeconds: number = seconds % 60;
    if (hours !== 0) {
      return `${hours} hrs. ${minutes} min. ${remainingSeconds} sec.`;
    } else {
      return `${minutes} min. ${remainingSeconds} sec.`;
    }
  }

  function formatAvailableTime(seconds: number | undefined): string | undefined {
    if (seconds === undefined || seconds === 0) {
      return undefined;
    }

    const minutes: number = Math.floor((seconds % 3600) / 60);
    const remainingSeconds: number = seconds % 60;

    return `${minutes} min. ${remainingSeconds} sec.`;
  }

  return (
    <div id={`invite_accordion_${inviteUuid}`} data-testid={"assessment-results-sections"}>
      {sections.map((section: SectionSolvedInterface, sectionIndex: number): ReactNode => (
        <div key={`section-${section.id}`} className="card">
          <button className="card-header section__header" id={`heading-${section.id}`} onClick={(): void => setActiveSection(sectionIndex == activeSection ? -1 : sectionIndex)}
                  data-testid={"section-header"}>
            <span>{section.title}</span>
            <span>
              <b
                className={`${section.measuredSeconds && section.availableSeconds && section.measuredSeconds > section.availableSeconds ? "section__header__meas-time--exceeded" : ""}`}>{formatMeasuredTime(section.measuredSeconds) ?? "No measured time"}</b>
              <br></br>
              <span className={"section__header__sug-time"}>
                Suggested: {formatAvailableTime(section.availableSeconds) ?? "-"}
              </span>
            </span>
            <span>{section.scoredPoints ?? 0} / {section.availablePoints}</span>
            <span>{section.availablePoints && section.scoredPoints ? (section.scoredPoints / section.availablePoints * 100).toFixed(2) : (0.00).toFixed(2)} %</span>
          </button>
          <div id={`collapse${section.id}`} className={`collapse ${activeSection == sectionIndex ? "show" : ""}`} aria-labelledby={`heading${section.id}`}
               data-parent={`#invite_accordion_${inviteUuid}`}>
            <div className="card-body">
              {section.assignments.map((assignment: AssignmentSolvedInterface, assignmentIndex: number): ReactNode => (
                <div key={assignment.id}>
                  {assignment.type == AssignmentTypes.MULTIPLE_CHOICE && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}
                                               inviteId={inviteUuid}>
                      <SolvedAssignmentMultipleChoice
                        assignment={assignment as AssignmentMultipleChoiceSolvedInterface}
                      />
                    </SolvedAssignmentContainer>
                  )}
                  {assignment.type == AssignmentTypes.OPEN && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}
                                               inviteId={inviteUuid}>
                      <SolvedAssignmentOpen assignment={assignment as AssignmentOpenSolvedInterface}/>
                    </SolvedAssignmentContainer>
                  )}
                  {assignment.type == AssignmentTypes.CODING && (
                    <SolvedAssignmentContainer assignment={assignment} assignmentIndex={assignmentIndex} key={`{section-${sectionIndex}_assignment-${assignmentIndex}`} sectionIndex={sectionIndex}
                                               inviteId={inviteUuid}>
                      <SolvedAssignmentCodingContainer assignment={assignment as AssignmentCodingSolvedInterface}/>
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
