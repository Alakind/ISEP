import {Dispatch, ReactNode, SetStateAction} from "react";
import {AssessmentInterface, ScoredAssessmentInterface} from "../../../utils/types.tsx";
import "../../../styles/results-overview.css";
import BarChartContainer from "../../../containers/applicant-personal/results/bar-chart/BarChartContainer.tsx";
import SkillsBlockContainer from "../../../containers/applicant-personal/results/skills/SkillsBlockContainer.tsx";

function AssessmentResultsOverview({assessmentData, inviteId, assessmentScore, setAssessmentScore}: Readonly<Props>): ReactNode {

  return (
    <div className={"results-overview"} data-testid={"assessment-results-overview"}>
      <div className={"results-overview__score"}>
        <h5>Score</h5>
        <div className={"results-overview__score__percentage"}>{((assessmentScore.scoredPoints ?? 0) / assessmentScore.availablePoints * 100).toFixed(0)}%</div>
        <div className={"results-overview__score__points"}><span>{assessmentScore.scoredPoints ?? 0}</span> of <span>{assessmentScore.availablePoints}</span> points
        </div>
      </div>
      <div className={"results-overview__comparison"}>
        <h5>Comparison</h5>
        <div className={"results-overview__comparison__bar-chart"}>
          <BarChartContainer inviteId={inviteId}/>
        </div>
      </div>
      <div className={"results-overview__skills"}>
        <h5>Skills</h5>
        <div className={"results-overview__skills__progress"}>
          <SkillsBlockContainer assessmentId={assessmentData.id} inviteId={inviteId} setAssessmentScore={setAssessmentScore}/>
        </div>
      </div>
    </div>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
  inviteId: string;
  assessmentScore: ScoredAssessmentInterface;
  setAssessmentScore: Dispatch<SetStateAction<ScoredAssessmentInterface>>;
}

export default AssessmentResultsOverview
