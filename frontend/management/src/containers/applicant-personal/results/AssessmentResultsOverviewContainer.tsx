import {useState} from "react";
import AssessmentResultsOverview from "../../../components/applicant-personal/results/AssessmentResultsOverview.tsx";
import {AssessmentInterface, ScoredAssessmentInterface} from "../../../utils/types.tsx";

function AssessmentResultsOverviewContainer({assessmentData, inviteId}: Props) {
  const [assessmentScore, setAssessmentScore] = useState<ScoredAssessmentInterface>({scoredPoints: 0, availablePoints: 0});
  return (
    <AssessmentResultsOverview assessmentData={assessmentData} inviteId={inviteId} assessmentScore={assessmentScore} setAssessmentScore={setAssessmentScore}/>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
  inviteId: string;
}

export default AssessmentResultsOverviewContainer
