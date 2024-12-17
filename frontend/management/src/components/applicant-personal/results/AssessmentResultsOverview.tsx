import {ReactNode} from "react";
import {AssessmentInterface} from "../../../utils/types.tsx";
import "../../../styles/results-overview.css";
import BarChartContainer from "../../../containers/applicant-personal/results/bar-chart/BarChartContainer.tsx";

function AssessmentResultsOverview({assessmentData, inviteUuid}: Props): ReactNode {
  //TODO retrieve this data from back-end
  const scoredPoints: number = 27;
  const totalPoints: number = 60;
  const percentage: number = scoredPoints / totalPoints * 100;

  return (
    <div className={"results-overview"}>
      <div className={"results-overview__score"}>
        <h5>Score</h5>
        <div className={"results-overview__score__percentage"}>{percentage}%</div>
        <div className={"results-overview__score__points"}><span>{scoredPoints}</span> of <span>{totalPoints}</span> points
        </div>
      </div>
      <div className={"results-overview__comparison"}>
        <h5>Comparison</h5>
        <div className={"results-overview__comparison__bar-chart"}>
          <BarChartContainer inviteUuid={inviteUuid}/>
        </div>
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
  inviteUuid: string;
}

export default AssessmentResultsOverview
