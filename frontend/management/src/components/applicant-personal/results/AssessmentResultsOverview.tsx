import {ReactNode} from "react";
import {AssessmentInterface} from "../../../utils/types.tsx";
import "../../../styles/results-overview.css";

function AssessmentResultsOverview({assessmentData}: Props): ReactNode {
  return (
    <div className={"results-overview"}>
      <div className={"results-overview__score"}>
        <h5>Score</h5>
        <div className={"results-overview__score__percentage"}>45%</div>
        <div className={"results-overview__score__points"}><span id={`${assessmentData.id}_scoredPoints`}>27</span> of <span id={`${assessmentData.id}_totalPoints`}>60</span> points</div>
      </div>
      <div className={"results-overview__comparison"}>
        <h5>Comparison</h5>
        <div className={"results-overview__comparison__bar-chart"}></div>
        <div>Better than <span>46.17</span>% of other applicants</div>
      </div>
      <div className={"results-overview__skills"}>
        <h5>Skills</h5>
        <div className={"results-overview__skills__progress"}>
          <div></div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
}

export default AssessmentResultsOverview
