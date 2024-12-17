import {ReactNode} from "react";
import {AssessmentInterface} from "../../../utils/types.tsx";

function AssessmentResultsOverview({assessmentData}: Props): ReactNode {
  return (
    <>
      <div>Coming soon!</div>
      <div>Tag: {assessmentData.tag}</div>
    </>
  )
}

interface Props {
  assessmentData: AssessmentInterface;
}

export default AssessmentResultsOverview
