import "../../styles/assessment-results-viewer.css";
import AssessmentResultsSections from "./AssessmentResultsSections.tsx";
import AssessmentResultsOverview from "./AssessmentResultsOverview.tsx";
import {SectionInterface} from "../../utils/types.tsx";
import {Dispatch, ReactNode, SetStateAction} from "react";

function AssessmentResultsViewer({sectionsData, activeSection, setActiveSection}: Props): ReactNode {
  return (
    <>
      <h4>Results Overview</h4>
      <div className="results-container">
        <AssessmentResultsOverview/>
      </div>
      <br/>
      <h4>Results Sections</h4>
      <div className="results-container">
        <AssessmentResultsSections sections={sectionsData} activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
    </>
  )
}

interface Props {
  sectionsData : SectionInterface[];
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
}

export default AssessmentResultsViewer
