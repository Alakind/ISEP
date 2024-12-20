import "../../styles/assessment-results-viewer.css";
import AssessmentResultsSections from "./AssessmentResultsSections.tsx";
import AssessmentResultsOverview from "./AssessmentResultsOverview.tsx";
import {AssessmentInterface, SectionInterface} from "../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";
import LoadingPage from "../LoadingPage.tsx";

function AssessmentResultsViewer({assessmentData, loading, sectionsData, activeSection, setActiveSection}: Props): ReactNode {
  return (
    <div className="results__container">
      <h4>Results Overview</h4>
      <div className="results__body">
        {
          loading ?
            <LoadingPage additionalClasses={"page--mod"}/> :
            <AssessmentResultsOverview assessmentData={assessmentData}/>
        }
      </div>
      <br/>
      <h4>Summary Assessment</h4>
      <div className="results__body">
        {
          loading ?
            <LoadingPage additionalClasses={"page--mod"}/> :
            <AssessmentResultsSections sections={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection}/>
        }
      </div>
    </div>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
  loading: boolean;
  sectionsData: SectionInterface[];
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
}

export default AssessmentResultsViewer
