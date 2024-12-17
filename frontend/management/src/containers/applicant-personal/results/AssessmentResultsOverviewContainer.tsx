import AssessmentResultsOverview from "../../../components/applicant-personal/results/AssessmentResultsOverview.tsx";
import {AssessmentInterface} from "../../../utils/types.tsx";

function AssessmentResultsOverviewContainer({assessmentData, inviteUuid}: Props) {
  return (
    <AssessmentResultsOverview assessmentData={assessmentData} inviteUuid={inviteUuid}/>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
  inviteUuid: string;
}

export default AssessmentResultsOverviewContainer
