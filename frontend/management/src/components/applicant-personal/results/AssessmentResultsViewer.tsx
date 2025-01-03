import "../../../styles/assessment-results-viewer.css";
import AssessmentResultsSections from "./AssessmentResultsSections.tsx";
import {AssessmentInterface, InviteInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import LoadingPage from "../../LoadingPage.tsx";
import StatusItem from "../../StatusItem.tsx";
import AssessmentResultsOverviewContainer from "../../../containers/applicant-personal/results/AssessmentResultsOverviewContainer.tsx";

function AssessmentResultsViewer({assessmentsData, loading, sectionsData, activeSection, setActiveSection, activeAssessment, setActiveAssessment, invitesData}: Props): ReactNode {
  return (
    <>
      <div className={`results__container results__container--mod ${assessmentsData.length === 1 ? "results__container--hidden" : ""}`}>
        <span className={"results__container__span"}>Select:</span>
        <div className={"results__container__assessment-select"}>
          {
            assessmentsData.map((assessmentData: AssessmentInterface, index: number): ReactNode => {
              return (
                <a key={index} onClick={(): void => setActiveAssessment(index)} className={`${activeAssessment === index ? "results__container__assessment-select__active" : ""}`}>
                  <StatusItem status={assessmentData.tag}/>
                </a>
              )
            })
          }
        </div>
      </div>
      <div className={`results__container ${assessmentsData.length === 1 ? "results__container--single" : ""}`}>
        <h4>Results Overview</h4>
        <div className="results__body">
          {
            loading ?
              <LoadingPage additionalClasses={"page--mod"}/> :
              <AssessmentResultsOverviewContainer inviteId={invitesData[activeAssessment].id} assessmentData={assessmentsData[activeAssessment]}/>
          }
        </div>
        <br/>
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
