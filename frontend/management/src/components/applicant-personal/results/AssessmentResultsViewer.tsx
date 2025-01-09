import "../../../styles/assessment-results-viewer.css";
import AssessmentResultsSections from "./AssessmentResultsSections.tsx";
import {AssessmentInterface, InviteInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import LoadingPage from "../../LoadingPage.tsx";
import StatusItem from "../../StatusItem.tsx";
import AssessmentResultsOverviewContainer from "../../../containers/applicant-personal/results/AssessmentResultsOverviewContainer.tsx";
import {InviteStatuses} from "../../../utils/constants.tsx";
import {mapStatus} from "../../../utils/mapping.tsx";

function AssessmentResultsViewer({assessmentsData, loading, sectionsData, activeSection, setActiveSection, activeAssessment, setActiveAssessment, invitesData}: Readonly<Props>): ReactNode {
  return (
    <>
      <div data-testid={"assessment-results-viewer-select"}
           className={`results__container results__container--mod ${assessmentsData.length === 1 ? "results__container--hidden" : ""}`}>
        <span className={"results__container__span"}>Select:</span>
        <div className={"results__container__assessment-select"}>
          {
            invitesData.map((inviteData: InviteInterface, index: number): ReactNode => {
              if (mapStatus(inviteData.status) === InviteStatuses.APP_FINISHED) {
                return (
                  <button data-testid={"select-button"} key={assessmentsData[index].id} onClick={(): void => setActiveAssessment(index)}
                          className={`btn--transparent ${activeAssessment === index ? "results__container__assessment-select__active" : ""}`}>
                    <StatusItem status={assessmentsData[index].tag}/>
                  </button>
                )
              } else {
                return (
                  <button data-testid={"select-button-disabled"} key={assessmentsData[index].id}
                          className={`btn--transparent results__container__assessment-select__disabled`} disabled={true}>
                    <StatusItem status={assessmentsData[index].tag}/>
                  </button>
                )
              }
            })
          }
        </div>
      </div>
      <div data-testid={"assessment-results-viewer-results"}
           className={`results__container ${assessmentsData.length === 1 ? "results__container--single" : ""}`}>
        <h4>Results Overview</h4>
        <div className="results__body">
          {
            loading ?
              <LoadingPage additionalClasses={"page--mod"}/> :
              <AssessmentResultsOverviewContainer inviteId={invitesData[activeAssessment].id} assessmentData={assessmentsData[activeAssessment]}/>
          }
        </div>
        <h4>Summary Assessment</h4>
        <div className="results__body">
          {
            loading ?
              <LoadingPage additionalClasses={"page--mod"}/> :
              <AssessmentResultsSections inviteUuid={invitesData[activeAssessment].id} sections={sectionsData[activeAssessment]} activeSection={activeSection} setActiveSection={setActiveSection}/>
          }
        </div>
      </div>
    </>
  )
}

interface Props {
  assessmentsData: AssessmentInterface[];
  loading: boolean;
  sectionsData: SectionSolvedInterface[][];
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
  activeAssessment: number;
  setActiveAssessment: Dispatch<SetStateAction<number>>;
  invitesData: InviteInterface[];
}

export default AssessmentResultsViewer
