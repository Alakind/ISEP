import AssessmentResultsOverview from "../../../components/applicant-personal/results/AssessmentResultsOverview.tsx";
import {AssessmentInterface} from "../../../utils/types.tsx";

function AssessmentResultsOverviewContainer({assessmentData}: Props) {
  return (
    <AssessmentResultsOverview assessmentData={assessmentData}/>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
}

export default AssessmentResultsOverviewContainer
