import "../../../styles/assessment-results-viewer.css";
import AssessmentResultsSections from "./AssessmentResultsSections.tsx";
import {AssessmentInterface, SectionSolvedInterface} from "../../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import LoadingPage from "../../LoadingPage.tsx";
import AssessmentResultsOverviewContainer from "../../../containers/applicant-personal/results/AssessmentResultsOverviewContainer.tsx";

function AssessmentResultsViewer({assessmentData, loading, sectionsData, activeSection, setActiveSection, inviteUuid}: Props): ReactNode {
  return (
    <div className="results__container">
      <h4>Results Overview</h4>
      <div className="results__body">
        {
          loading ?
            <LoadingPage additionalClasses={"page--mod"}/> :
            <AssessmentResultsOverviewContainer assessmentData={assessmentData} inviteUuid={inviteUuid}/>
        }
      </div>
      <br/>
      <h4>Summary Assessment</h4>
      <div className="results__body">
        {
          loading ?
            <LoadingPage additionalClasses={"page--mod"}/> :
            <AssessmentResultsSections inviteUuid={inviteUuid} sections={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection}/>
        }
      </div>
    </div>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
  loading: boolean;
  sectionsData: SectionSolvedInterface[];
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
  inviteUuid: string;
}

export default AssessmentResultsViewer
